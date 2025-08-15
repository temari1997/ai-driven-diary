import { DiaryEntry } from '../types';

const CONNECTED_KEY = 'gdrive_connected';
const LAST_BACKUP_KEY = 'gdrive_last_backup';
const AUTO_BACKUP_KEY = 'gdrive_auto_backup';
const SHEET_URL_KEY = 'gdrive_sheet_url';

export const googleDriveService = {
  isConnected: (): boolean => {
    return localStorage.getItem(CONNECTED_KEY) === 'true';
  },

  connect: async (): Promise<void> => {
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem(CONNECTED_KEY, 'true');

    // Check if a sheet URL already exists. If not, "create" one.
    let sheetUrl = localStorage.getItem(SHEET_URL_KEY);
    if (!sheetUrl) {
      console.log("First time connection: Simulating creation of new Google Sheet.");
      // Generate a unique-looking but still fake URL to simulate creation.
      sheetUrl = `https://docs.google.com/spreadsheets/d/1-simulated-sheet-id-for-user-${Date.now()}`;
      localStorage.setItem(SHEET_URL_KEY, sheetUrl);
    }

    // Enable auto-backup by default on first connect
    if (localStorage.getItem(AUTO_BACKUP_KEY) === null) {
        localStorage.setItem(AUTO_BACKUP_KEY, 'true');
    }
  },

  disconnect: async (): Promise<void> => {
    localStorage.removeItem(CONNECTED_KEY);
    localStorage.removeItem(SHEET_URL_KEY);
  },

  testConnection: async (): Promise<string> => {
    if (!googleDriveService.isConnected()) {
        throw new Error("Not connected to Google Drive.");
    }
    // Simulate a quick API check
    await new Promise(resolve => setTimeout(resolve, 800));
    return "Connection test successful. Ready to sync.";
  },

  backupNow: async (entries: DiaryEntry[]): Promise<Date> => {
    if (!googleDriveService.isConnected()) {
        throw new Error("Not connected to Google Drive.");
    }

    if (entries.length === 0) {
      console.log("No entries to sync.");
      return new Date(); 
    }
    
    const sheetUrl = localStorage.getItem(SHEET_URL_KEY);
    console.log(`Starting sync to Google Sheets: ${sheetUrl}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would use the Google Sheets API.
    const headers = ['ID', 'Date', 'Content', 'Tags', 'Emotion', 'Location'];
    const rows = entries.map(entry => [
        entry.id,
        entry.date,
        entry.content,
        entry.tags.join(', '),
        entry.emotion || '',
        entry.location || ''
    ]);
    
    console.log(`Simulating appending ${rows.length} rows to Google Sheet.`);
    
    const backupDate = new Date();
    localStorage.setItem(LAST_BACKUP_KEY, backupDate.toISOString());
    
    console.log("Sync to Google Sheets successful!");
    return backupDate;
  },

  importFromBackup: async (userId: string): Promise<DiaryEntry[]> => {
    if (!googleDriveService.isConnected()) {
        throw new Error("Not connected to Google Drive.");
    }
    
    console.log("Starting import from Google Sheets...");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would read the rows from the Google Sheet and parse them back into DiaryEntry objects.
    // For this simulation, we'll return a hardcoded list of mock entries.
    const importedEntries: DiaryEntry[] = [
        {
          id: `imported-1-${userId}`,
          userId,
          date: new Date(Date.now() - 86400000 * 10).toISOString(),
          content: `Google Driveからインポートされた日記です。\n\n昔の旅行の思い出。きれいな海辺でリラックスできた。また行きたいな。`,
          tags: ['旅行', '思い出', '海'],
          emotion: 'happy',
          location: '沖縄のビーチ',
        },
        {
          id: `imported-2-${userId}`,
          userId,
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          content: `インポートされたもう一つの日記。\n\nプロジェクトが無事に終わって一安心。チームのみんなに感謝。`,
          tags: ['仕事', '達成感', '感謝'],
          emotion: 'excited',
        },
        // This entry might already exist if the user started with mock data, so the merge logic should ignore it.
        {
          id: `1-${userId}`, 
          userId,
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          content: `これは重複する可能性のある日記のコンテンツです。インポート処理で無視されるはず。`,
          tags: ['重複テスト'],
          emotion: 'calm',
        }
    ];
    
    console.log(`Simulating importing ${importedEntries.length} rows from Google Sheet.`);
    console.log("Import from Google Sheets successful!");
    return importedEntries;
  },

  getLastBackupDate: (): Date | null => {
    const dateStr = localStorage.getItem(LAST_BACKUP_KEY);
    return dateStr ? new Date(dateStr) : null;
  },

  isAutoBackupEnabled: (): boolean => {
    // Default to true if connected but not set
    if (googleDriveService.isConnected() && localStorage.getItem(AUTO_BACKUP_KEY) === null) {
        return true;
    }
    return localStorage.getItem(AUTO_BACKUP_KEY) === 'true';
  },

  setAutoBackupEnabled: (enabled: boolean): void => {
    localStorage.setItem(AUTO_BACKUP_KEY, String(enabled));
  },

  getBackupSheetUrl: (): string | null => {
    if (googleDriveService.isConnected()) {
        return localStorage.getItem(SHEET_URL_KEY);
    }
    return null;
  }
};