import React, { useState, useEffect } from 'react';
import { DiaryEntry, User } from '../types';
import { googleDriveService } from '../services/googleDriveService';
import { GoogleAuthModal } from './GoogleAuthModal';

interface SettingsViewProps {
    entries: DiaryEntry[];
    user: User;
    onImport: (entries: DiaryEntry[]) => void;
}

const GoogleDriveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.57 6.43L12 17.57 5.43 6.43zM21.43 6.43h-2.86l-6.57 11.14h2.86zM9.14 2.86L15.71 14H2.57z"/>
    </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);


export const SettingsView: React.FC<SettingsViewProps> = ({ entries, user, onImport }) => {
    const [isConnected, setIsConnected] = useState(googleDriveService.isConnected());
    const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(googleDriveService.isAutoBackupEnabled());
    const [lastBackup, setLastBackup] = useState<Date | null>(googleDriveService.getLastBackupDate());
    const [isLoading, setIsLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [sheetUrl, setSheetUrl] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (isConnected) {
            const url = googleDriveService.getBackupSheetUrl();
            setSheetUrl(url);
        } else {
            setSheetUrl(null);
        }
    }, [isConnected]);

    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(null), 4000);
    };

    const handleConnect = () => {
        setIsAuthModalOpen(true);
    };

    const handleAllowConnect = async () => {
        setIsLoading(true);
        try {
            await googleDriveService.connect();
            setIsConnected(true);
            setIsAutoBackupEnabled(googleDriveService.isAutoBackupEnabled());
            const url = googleDriveService.getBackupSheetUrl();
            setSheetUrl(url);
            showFeedback("Successfully connected to Google Drive!");
        } catch (error) {
            showFeedback("Failed to connect. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleDisconnect = async () => {
        await googleDriveService.disconnect();
        setIsConnected(false);
        setSheetUrl(null);
        showFeedback("Disconnected from Google Drive.");
    };

    const handleBackupNow = async () => {
        setIsLoading(true);
        try {
            const backupDate = await googleDriveService.backupNow(entries);
            setLastBackup(backupDate);
            showFeedback(`Sync successful! (${backupDate.toLocaleTimeString()})`);
        } catch (error) {
            showFeedback("Sync failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleImportNow = async () => {
        setIsImporting(true);
        try {
            const importedEntries = await googleDriveService.importFromBackup(user.id);
            onImport(importedEntries);
            const existingIds = new Set(entries.map(e => e.id));
            const newEntriesCount = importedEntries.filter(e => !existingIds.has(e.id)).length;

            if (newEntriesCount > 0) {
                 showFeedback(`${newEntriesCount} new entries imported successfully!`);
            } else {
                 showFeedback("No new entries found to import.");
            }
        } catch (error) {
            showFeedback("Import failed. Please try again.");
            console.error("Import error:", error);
        } finally {
            setIsImporting(false);
        }
    };

    const handleTestConnection = async () => {
        setIsTesting(true);
        try {
            const message = await googleDriveService.testConnection();
            showFeedback(message);
        } catch (error: any) {
            showFeedback(error.message || "Connection test failed.");
        } finally {
            setIsTesting(false);
        }
    };

    const handleToggleAutoBackup = () => {
        const newValue = !isAutoBackupEnabled;
        googleDriveService.setAutoBackupEnabled(newValue);
        setIsAutoBackupEnabled(newValue);
        showFeedback(`Weekly automatic sync ${newValue ? 'enabled' : 'disabled'}.`);
    };
    
    return (
         <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg h-full flex flex-col overflow-y-auto">
            <h2 className="text-3xl font-bold font-mplus mb-6 text-gray-700 dark:text-gray-200">Settings</h2>
            
            <div className="bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                     <GoogleDriveIcon />
                    <h3 className="text-xl font-bold font-mplus text-gray-700 dark:text-gray-200">Google Drive Sync</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
                    Sync your diary entries to a Google Sheet. New records are added during the weekly sync, or you can trigger a manual sync at any time.
                </p>

                {!isConnected ? (
                     <button 
                        onClick={handleConnect}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400"
                    >
                        {isLoading ? 'Connecting...' : 'Connect to Google Drive'}
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-800/50 rounded-lg">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200 truncate">Connected as {user.email}</p>
                            <button onClick={handleDisconnect} className="text-xs text-red-600 dark:text-red-400 hover:underline flex-shrink-0 ml-2">Disconnect</button>
                        </div>
                        
                        {sheetUrl && (
                             <div className="p-3 bg-gray-100 dark:bg-gray-900/40 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Synced Google Sheet:</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="flex-1 text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 p-2 rounded truncate" title={sheetUrl}>{sheetUrl}</span>
                                    <button
                                        onClick={() => alert("This is a demo feature. In a real application, this link would open your synced Google Sheet.")}
                                        className="flex-shrink-0 text-sm text-blue-600 dark:text-blue-400 hover:underline p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                        title="Open Google Sheet (Demo)"
                                    >
                                        <ExternalLinkIcon />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900/40 rounded-lg">
                           <div className="flex flex-col">
                             <label htmlFor="auto-backup" className="font-medium text-gray-700 dark:text-gray-300">Weekly Automatic Sync</label>
                             <span className="text-xs text-gray-500 dark:text-gray-400">Syncs automatically every 7 days.</span>
                           </div>
                            <button
                                id="auto-backup"
                                role="switch"
                                aria-checked={isAutoBackupEnabled}
                                onClick={handleToggleAutoBackup}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isAutoBackupEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAutoBackupEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>
                        
                        <div>
                            <button
                                onClick={handleTestConnection}
                                disabled={isLoading || isImporting || isTesting}
                                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                                {isTesting ? 'Testing...' : 'Test Connection'}
                            </button>
                        </div>
                        
                        <div>
                            <button
                                onClick={handleBackupNow}
                                disabled={isLoading || isImporting || isTesting}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-200 hover:bg-purple-300 dark:text-purple-100 dark:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Syncing...' : 'Sync Now'}
                            </button>
                            {lastBackup && (
                                <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                                    Last sync: {lastBackup.toLocaleString()}
                                </p>
                            )}
                        </div>

                        <div>
                            <button
                                onClick={handleImportNow}
                                disabled={isLoading || isImporting || isTesting}
                                className="w-full py-2 px-4 mt-2 border border-purple-300 dark:border-purple-600 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 dark:text-purple-100 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                                {isImporting ? 'Importing...' : 'Import from Google Sheet'}
                            </button>
                        </div>
                    </div>
                )}
                 {feedbackMessage && <p className="text-sm text-center mt-4 text-purple-700 dark:text-purple-300">{feedbackMessage}</p>}
            </div>
            
            <GoogleAuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)}
                onAllow={handleAllowConnect}
                user={user}
            />

        </div>
    );
};