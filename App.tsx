import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DiaryEditor } from './components/DiaryEditor';
import { DiaryView } from './components/DiaryView';
import { GratitudeJar } from './components/GratitudeJar';
import { StatsView } from './components/StatsView';
import { DiaryEntry, ViewType, User } from './types';
import { Header } from './components/Header';
import { ExportModal } from './components/ExportModal';
import { AuthView } from './components/AuthView';
import { authService } from './services/authService';
import { SettingsView } from './components/SettingsView';
import { googleDriveService } from './services/googleDriveService';

const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [view, setView] = useState<ViewType>('diary');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is signed in, load their data from Firestore.
        const userEntries = await authService.getEntriesForUser(user.id);
        const sorted = userEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setDiaryEntries(sorted);
        setSelectedEntry(sorted[0] || null);
      } else {
        // User is signed out, clear their data.
        setDiaryEntries([]);
        setSelectedEntry(null);
      }
      setIsInitializing(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Persist diary entries whenever they change for the current user
  useEffect(() => {
    if (currentUser && !isInitializing) {
        authService.saveEntriesForUser(currentUser.id, diaryEntries);
    }
  }, [diaryEntries, currentUser, isInitializing]);
  
  // Check for auto-backup on app load
  useEffect(() => {
    if (currentUser && diaryEntries.length > 0) {
        const checkAutoBackup = async () => {
            if (googleDriveService.isConnected() && googleDriveService.isAutoBackupEnabled()) {
                const lastBackup = googleDriveService.getLastBackupDate();
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                if (!lastBackup || lastBackup < oneWeekAgo) {
                    console.log("Automatic weekly sync triggered.");
                    try {
                        await googleDriveService.backupNow(diaryEntries);
                        console.log("Automatic sync successful.");
                    } catch (error) {
                        console.error("Automatic sync failed:", error);
                    }
                }
            }
        };
        checkAutoBackup();
    }
  }, [currentUser, diaryEntries]);

  const handleLogout = useCallback(async () => {
    await authService.signOutUser();
  }, []);

  const handleSaveEntry = useCallback((entry: DiaryEntry) => {
    if (!currentUser) return;
    
    const entryToSave = { ...entry, userId: currentUser.id };

    setDiaryEntries(prevEntries => {
      const existingIndex = prevEntries.findIndex(e => e.id === entryToSave.id);
      if (existingIndex > -1) {
        const newEntries = [...prevEntries];
        newEntries[existingIndex] = entryToSave;
        return newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return [...prevEntries, entryToSave].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    setSelectedEntry(entryToSave);
    setIsEditing(false);
  }, [currentUser]);

  const handleUpdateEntryFeedback = useCallback((entryId: string, feedbackContent: string) => {
    if (!currentUser) return;

    setDiaryEntries(prevEntries => {
        const entryIndex = prevEntries.findIndex(e => e.id === entryId);
        if (entryIndex === -1) return prevEntries;

        const updatedEntry: DiaryEntry = {
            ...prevEntries[entryIndex],
            aiFeedback: {
                id: `fb-${new Date().toISOString()}`,
                content: feedbackContent,
                generatedAt: new Date().toISOString(),
                tone: 'insightful',
            }
        };
        
        const newEntries = [...prevEntries];
        newEntries[entryIndex] = updatedEntry;

        if (selectedEntry?.id === entryId) {
            setSelectedEntry(updatedEntry);
        }

        return newEntries;
    });
  }, [currentUser, selectedEntry]);
  
  const handleNewEntry = useCallback(() => {
    setSelectedEntry(null);
    setIsEditing(true);
  }, []);

  const handleSelectEntry = useCallback((entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setIsEditing(false);
  }, []);

  const handleEditEntry = useCallback(() => {
    if(selectedEntry) {
      setIsEditing(true);
    }
  }, [selectedEntry]);

  const handleDeleteEntry = useCallback((id: string) => {
    const newEntries = diaryEntries.filter(e => e.id !== id);
    setDiaryEntries(newEntries);
    
    if (selectedEntry?.id === id) {
      const sortedNew = newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSelectedEntry(sortedNew.length > 0 ? sortedNew[0] : null);
      setIsEditing(false);
    }
  }, [selectedEntry, diaryEntries]);

  const handleExport = useCallback((startDate: string, endDate: string) => {
    if (diaryEntries.length === 0) {
        alert("No entries to export.");
        return;
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredEntries = diaryEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
    });

    if (filteredEntries.length === 0) {
        alert("No entries found in the selected date range.");
        return;
    }

    const fileContent = JSON.stringify(filteredEntries, null, 2);

    const blob = new Blob([fileContent], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `ai-diary-export-${startDate}-to-${endDate}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  }, [diaryEntries]);

  const handleImportEntries = useCallback((importedEntries: DiaryEntry[]) => {
    const existingIds = new Set(diaryEntries.map(e => e.id));
    const newEntries = importedEntries.filter(e => !existingIds.has(e.id));

    if (newEntries.length > 0) {
        console.log(`Imported ${newEntries.length} new entries.`);
        setDiaryEntries(prevEntries => 
            [...prevEntries, ...newEntries]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
    } else {
        console.log("No new entries to import from the source.");
    }
  }, [diaryEntries]);

  const sortedEntries = useMemo(() => {
    return diaryEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [diaryEntries]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 dark:from-gray-900 dark:via-purple-900/50 dark:to-gray-800 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <AuthView />;
  }

  const renderContent = () => {
    switch (view) {
      case 'diary':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1 bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-mplus text-gray-700 dark:text-gray-200">Entries</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsExportModalOpen(true)} title="Export entries" className="p-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm">
                    <ExportIcon />
                  </button>
                  <button onClick={handleNewEntry} className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">
                    + New
                  </button>
                </div>
              </div>
              <ul className="space-y-2">
                {sortedEntries.map(entry => (
                  <li key={entry.id} onClick={() => handleSelectEntry(entry)} className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedEntry?.id === entry.id ? 'bg-purple-200 dark:bg-purple-800/60 shadow-md' : 'hover:bg-gray-200/70 dark:hover:bg-gray-700/50'}`}>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{entry.content.split('\n')[0]}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2 bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg h-full">
              {isEditing ? (
                <DiaryEditor onSave={handleSaveEntry} onCancel={() => setIsEditing(false)} currentEntry={selectedEntry} />
              ) : selectedEntry ? (
                <DiaryView entry={selectedEntry} onEdit={handleEditEntry} onDelete={handleDeleteEntry} onUpdateFeedback={handleUpdateEntryFeedback} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-400">Select an entry to view or create a new one.</p>
                  <button onClick={handleNewEntry} className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    Create New Entry
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'gratitude':
        return <GratitudeJar />;
      case 'stats':
        return <StatsView />;
      case 'settings':
        return <SettingsView entries={diaryEntries} user={currentUser} onImport={handleImportEntries} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 dark:from-gray-900 dark:via-purple-900/50 dark:to-gray-800 text-gray-800 dark:text-gray-100">
        <main className="max-w-7xl mx-auto p-4 flex gap-6 h-screen">
          <Sidebar currentView={view} setView={setView} />
          <div className="flex-1 flex flex-col gap-6">
            <Header user={currentUser} onLogout={handleLogout} />
            <div className="flex-1 overflow-hidden">
               {renderContent()}
            </div>
          </div>
        </main>
        <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} onExport={handleExport} />
    </div>
  );
};

export default App;
