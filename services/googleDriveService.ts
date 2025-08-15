
import { DiaryEntry } from '../types';

const CONNECTED_KEY = 'gdrive_connected';
const LAST_BACKUP_KEY = 'gdrive_last_backup';
const AUTO_BACKUP_KEY = 'gdrive_auto_backup';
const SPREADSHEET_ID_KEY = 'gdrive_spreadsheet_id';
const ACCESS_TOKEN_KEY = 'gdrive_access_token';
// Keys for user-provided credentials
const CLIENT_ID_KEY = 'gdrive_client_id';
const API_KEY_KEY = 'gdrive_api_key';

const SPREADSHEET_NAME = 'AI-Diary-Backup';
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

// Helper functions to get credentials from localStorage
const getGoogleClientId = (): string | null => localStorage.getItem(CLIENT_ID_KEY);
const getGoogleApiKey = (): string | null => localStorage.getItem(API_KEY_KEY);

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

let tokenClient: any = null;

const loadGapiClient = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const apiKey = getGoogleApiKey();
        if (!apiKey) {
            return reject(new Error('Google API Key is not set.'));
        }

        window.gapi.load('client', async () => {
            try {
                await window.gapi.client.init({
                    apiKey: apiKey,
                    discoveryDocs: [
                        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                        'https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest',
                    ],
                });
                resolve();
            } catch (error) {
                reject(new Error('Failed to initialize Google API client.'));
            }
        });
    });
};

const findOrCreateSpreadsheet = async (): Promise<string> => {
    let spreadsheetId = localStorage.getItem(SPREADSHEET_ID_KEY);
    if (spreadsheetId) return spreadsheetId;

    try {
        const response = await window.gapi.client.drive.files.list({
            q: `mimeType='application/vnd.google-apps.spreadsheet' and name='${SPREADSHEET_NAME}' and trashed=false`,
            fields: 'files(id, name)',
        });
        
        if (response.result.files && response.result.files.length > 0) {
            spreadsheetId = response.result.files[0].id;
        } else {
            const createResponse = await window.gapi.client.sheets.spreadsheets.create({
                properties: {
                    title: SPREADSHEET_NAME,
                },
            });
            spreadsheetId = createResponse.result.spreadsheetId;
        }

        if (!spreadsheetId) {
            throw new Error("Could not find or create spreadsheet.");
        }
        localStorage.setItem(SPREADSHEET_ID_KEY, spreadsheetId);
        return spreadsheetId;

    } catch (error) {
        console.error('Error in findOrCreateSpreadsheet:', error);
        throw new Error("Failed to access Google Drive to find or create the backup sheet.");
    }
};


export const googleDriveService = {
  areCredentialsSet: (): boolean => {
    return !!getGoogleClientId() && !!getGoogleApiKey();
  },
  
  setCredentials: (clientId: string, apiKey: string): void => {
    localStorage.setItem(CLIENT_ID_KEY, clientId);
    localStorage.setItem(API_KEY_KEY, apiKey);
  },

  isConnected: (): boolean => {
    return localStorage.getItem(CONNECTED_KEY) === 'true' && localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
  },

  connect: async (): Promise<void> => {
    const clientId = getGoogleClientId();
    const apiKey = getGoogleApiKey();

    if (!clientId || !apiKey) {
        throw new Error("Google API credentials are not configured.");
    }

    return new Promise((resolve, reject) => {
        try {
             tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: SCOPES,
                callback: async (tokenResponse: any) => {
                    if (tokenResponse.error) {
                        return reject(new Error(tokenResponse.error_description || 'An error occurred during authentication.'));
                    }
                    localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.access_token);
                    window.gapi.client.setToken(tokenResponse);
                    
                    try {
                        await loadGapiClient();
                        await findOrCreateSpreadsheet(); // Ensure spreadsheet exists on first connect
                        localStorage.setItem(CONNECTED_KEY, 'true');
                         if (localStorage.getItem(AUTO_BACKUP_KEY) === null) {
                            localStorage.setItem(AUTO_BACKUP_KEY, 'true');
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
            });
            tokenClient.requestAccessToken();
        } catch (error) {
             reject(new Error("Failed to initialize Google authentication."));
        }
    });
  },

  disconnect: async (): Promise<void> => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
        window.google.accounts.oauth2.revoke(token, () => {});
    }
    localStorage.removeItem(CONNECTED_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(SPREADSHEET_ID_KEY);
    // Do NOT remove credentials on disconnect, user might want to reconnect later.
  },

  testConnection: async (): Promise<string> => {
    if (!googleDriveService.isConnected()) {
        throw new Error("Not connected to Google Drive.");
    }
    try {
        await findOrCreateSpreadsheet();
        return "Connection test successful. Ready to sync.";
    } catch(error: any) {
        throw new Error(`Connection test failed: ${error.message}`);
    }
  },

  backupNow: async (entries: DiaryEntry[]): Promise<Date> => {
    if (!googleDriveService.isConnected()) throw new Error("Not connected to Google Drive.");
    if (entries.length === 0) return new Date();

    const spreadsheetId = await findOrCreateSpreadsheet();
    const headers = ['id', 'userId', 'date', 'content', 'tags', 'emotion', 'location', 'aiFeedbackContent'];
    const rows = entries.map(e => [
        e.id, e.userId, e.date, e.content, e.tags.join(','), e.emotion || '', e.location || '', e.aiFeedback?.content || ''
    ]);

    try {
        await window.gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [headers, ...rows],
            },
        });

        const backupDate = new Date();
        localStorage.setItem(LAST_BACKUP_KEY, backupDate.toISOString());
        return backupDate;
    } catch (error) {
        console.error('Backup Error:', error);
        throw new Error("Failed to sync data to Google Sheet.");
    }
  },

  importFromBackup: async (userId: string): Promise<DiaryEntry[]> => {
    if (!googleDriveService.isConnected()) throw new Error("Not connected to Google Drive.");
    
    const spreadsheetId = await findOrCreateSpreadsheet();
    
    try {
        const response = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A:H',
        });

        const rows = response.result.values;
        if (!rows || rows.length < 2) {
            return []; // No data to import
        }

        const headerRow = rows[0];
        const dataRows = rows.slice(1);
        
        const importedEntries: DiaryEntry[] = dataRows.map(row => {
            const entry: any = {};
            headerRow.forEach((header, index) => {
                entry[header] = row[index];
            });
            
            return {
                id: entry.id,
                userId: entry.userId,
                date: entry.date,
                content: entry.content,
                tags: entry.tags ? entry.tags.split(',') : [],
                emotion: entry.emotion || undefined,
                location: entry.location || undefined,
                aiFeedback: entry.aiFeedbackContent ? {
                    id: `fb-${entry.id}`,
                    content: entry.aiFeedbackContent,
                    generatedAt: new Date().toISOString(),
                    tone: 'insightful'
                } : undefined
            };
        }).filter(e => e.id && e.userId === userId); // ensure entry is valid and belongs to the user
        
        return importedEntries;

    } catch (error) {
        console.error('Import Error:', error);
        throw new Error("Failed to import data from Google Sheet.");
    }
  },

  getLastBackupDate: (): Date | null => {
    const dateStr = localStorage.getItem(LAST_BACKUP_KEY);
    return dateStr ? new Date(dateStr) : null;
  },

  isAutoBackupEnabled: (): boolean => {
    if (googleDriveService.isConnected() && localStorage.getItem(AUTO_BACKUP_KEY) === null) {
        return true;
    }
    return localStorage.getItem(AUTO_BACKUP_KEY) === 'true';
  },

  setAutoBackupEnabled: (enabled: boolean): void => {
    localStorage.setItem(AUTO_BACKUP_KEY, String(enabled));
  },

  getBackupSheetUrl: (): string | null => {
    const spreadsheetId = localStorage.getItem(SPREADSHEET_ID_KEY);
    if (googleDriveService.isConnected() && spreadsheetId) {
        return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    }
    return null;
  }
};
