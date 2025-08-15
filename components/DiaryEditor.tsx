import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types';

interface DiaryEditorProps {
    onSave: (entry: DiaryEntry) => void;
    onCancel: () => void;
    currentEntry: DiaryEntry | null;
}

export const DiaryEditor: React.FC<DiaryEditorProps> = ({ onSave, onCancel, currentEntry }) => {
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (currentEntry) {
            setContent(currentEntry.content);
            setDate(new Date(currentEntry.date).toISOString().split('T')[0]);
            setTags(currentEntry.tags.join(', '));
        } else {
            setContent('');
            setDate(new Date().toISOString().split('T')[0]);
            setTags('');
        }
    }, [currentEntry]);

    const handleSave = () => {
        if (!content.trim()) {
            alert("Diary content cannot be empty.");
            return;
        }
        const entry: DiaryEntry = {
            ...(currentEntry || {}),
            id: currentEntry?.id || new Date().toISOString(),
            date: new Date(date).toISOString(),
            content: content,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        } as DiaryEntry; // Cast because userId is missing if new. App.tsx will add it.
        onSave(entry);
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 font-mplus text-gray-700 dark:text-gray-200">{currentEntry ? 'Edit Entry' : 'New Entry'}</h2>
            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-purple-500 focus:border-purple-500"
                />
            </div>
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What happened today?"
                className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white/50 dark:bg-gray-700/50 focus:ring-purple-500 focus:border-purple-500 leading-relaxed"
            ></textarea>
            <div className="mt-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Tags (comma separated)</label>
                <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="e.g., work, personal, fun"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Add from services (mock)</p>
                 <div className="flex flex-wrap gap-2">
                    <button className="flex items-center px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <LocationIcon /> <span className="ml-1">Location</span>
                    </button>
                    <button className="flex items-center px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <PhotoIcon /> <span className="ml-1">Photo</span>
                    </button>
                    <button className="flex items-center px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <TaskIcon /> <span className="ml-1">Task</span>
                    </button>
                     <button className="flex items-center px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <FitbitIcon /> <span className="ml-1">Fitbit</span>
                    </button>
                 </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button onClick={onCancel} className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">Save</button>
            </div>
        </div>
    );
};

const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
const TaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const FitbitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256"><path d="M239.93,103.3a8,8,0,0,0-8.21-7.42l-40.42,4.62-11-25.13a8,8,0,0,0-14.58-6.37l-32.84,75-40.2-60.3a8,8,0,0,0-13.4,8.94l25.32,38-23.4,9.36a8,8,0,0,0-5.83,12.27L96.2,185.7a8,8,0,0,0,14.58-6.37l11-25.13,32.84-75,54.93,82.39A8,8,0,0,0,218,156V112a8,8,0,0,0-5.52-7.58l-8.58-2.86,15.22-34.61a8,8,0,0,0,.81-3.65Z"></path></svg>;
