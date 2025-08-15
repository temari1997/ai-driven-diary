import { DiaryEntry } from '../types';

const CONNECTED_KEY = 'gdrive_connected';
const LAST_BACKUP_KEY = 'gdrive_last_backup';
const AUTO_BACKUP_KEY = 'gdrive_auto_backup';

export const googleDriveService = {
  isConnected: (): boolean => {
    return localStorage.getItem(CONNECTED_KEY) === 'true';
  },

  connect: async (): Promise<void> => {
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem(CONNECTED_KEY, 'true');
    // Enable auto-backup by default on first connect
    if (localStorage.getItem(AUTO_BACKUP_KEY) === null) {
        localStorage.setItem(AUTO_BACKUP_KEY, 'true');
    }
  },

  disconnect: async (): Promise<void> => {
    localStorage.removeItem(CONNECTED_KEY);
  },

  backupNow: async (entries: DiaryEntry[]): Promise<Date> => {
    if (!googleDriveService.isConnected()) {
        throw new Error("Not connected to Google Drive.");
    }

    if (entries.length === 0) {
      console.log("No entries to sync.");
      // We can throw an error or just resolve. Let's resolve.
      return new Date(); 
    }
    
    console.log("Starting sync to Google Sheets...");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would use the Google Sheets API.
    // First, you'd find or create a spreadsheet named 'AI Diary Backup'.
    // Then, you'd find or create a sheet (tab) within it.
    // Finally, you'd append the new rows.

    // 1. Define Headers
    const headers = ['ID', 'Date', 'Content', 'Tags', 'Emotion', 'Location'];

    // 2. Transform entries into rows (array of arrays)
    const rows = entries.map(entry => [
        entry.id,
        entry.date,
        entry.content,
        entry.tags.join(', '), // Join tags into a single string
        entry.emotion || '',
        entry.location || ''
    ]);

    // In a real implementation, you would check for existing IDs to avoid duplicates,
    // or only append entries created since the last backup. For this simulation,
    // we'll just simulate appending all current entries.
    
    console.log(`Simulating appending ${rows.length} rows to Google Sheet 'AI Diary Backup'.`);
    console.log("Headers:", headers);
    if(rows.length > 0) {
        console.log("First row example:", rows[0]);
    }
    
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
  }
};