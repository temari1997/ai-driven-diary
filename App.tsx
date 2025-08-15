
import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { DiaryEditor } from './components/DiaryEditor';
import { DiaryView } from './components/DiaryView';
import { GratitudeJar } from './components/GratitudeJar';
import { StatsView } from './components/StatsView';
import { DiaryEntry, ViewType } from './types';
import { Header } from './components/Header';
import { generateMockEntries } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('diary');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(generateMockEntries());
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(diaryEntries[0] || null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleSaveEntry = useCallback((entry: DiaryEntry) => {
    setDiaryEntries(prevEntries => {
      const existingIndex = prevEntries.findIndex(e => e.id === entry.id);
      if (existingIndex > -1) {
        const newEntries = [...prevEntries];
        newEntries[existingIndex] = entry;
        return newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return [...prevEntries, entry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    setSelectedEntry(entry);
    setIsEditing(false);
  }, []);
  
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
    setDiaryEntries(prev => prev.filter(e => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(diaryEntries.length > 1 ? diaryEntries.filter(e => e.id !== id)[0] : null);
      setIsEditing(false);
    }
  }, [selectedEntry, diaryEntries]);

  const sortedEntries = useMemo(() => {
    return diaryEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [diaryEntries]);

  const renderContent = () => {
    switch (view) {
      case 'diary':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1 bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-mplus text-gray-700 dark:text-gray-200">Entries</h2>
                <button onClick={handleNewEntry} className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">
                  + New
                </button>
              </div>
              <ul className="space-y-2">
                {sortedEntries.map(entry => (
                  <li key={entry.id} onClick={() => handleSelectEntry(entry)} className={`p-3 rounded-lg cursor-pointer transition-all ${selectedEntry?.id === entry.id ? 'bg-purple-200 dark:bg-purple-700 shadow-inner' : 'hover:bg-gray-200/50 dark:hover:bg-gray-700'}`}>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{new Date(entry.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{entry.content.split('\n')[0]}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2 bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg h-full overflow-y-auto">
              {isEditing ? (
                <DiaryEditor onSave={handleSaveEntry} currentEntry={selectedEntry} onCancel={() => setIsEditing(false)} />
              ) : selectedEntry ? (
                <DiaryView entry={selectedEntry} onEdit={handleEditEntry} onDelete={handleDeleteEntry}/>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <p className="text-lg">Select an entry to read or create a new one.</p>
                  <p className="mt-2">「今日の出来事を記録しよう」</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'gratitude':
        return <GratitudeJar />;
      case 'stats':
        return <StatsView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 dark:from-gray-900 dark:via-purple-900/50 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <div className="flex h-screen p-4 gap-4">
        <Sidebar currentView={view} setView={setView} />
        <main className="flex-1 flex flex-col h-[calc(100vh-2rem)]">
          <Header />
          <div className="flex-1 overflow-hidden mt-4">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
   