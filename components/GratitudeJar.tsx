
import React, { useState } from 'react';
import { Gratitude } from '../types';

const initialGratitudes: Gratitude[] = [
    { id: 'g1', author: 'user', content: '今日の夕飯、美味しかった！ありがとう。', date: new Date().toISOString() },
    { id: 'g2', author: 'partner', content: '仕事お疲れ様。いつも頑張っててすごい。', date: new Date(Date.now() - 3600000).toISOString() },
    { id: 'g3', author: 'user', content: '週末の計画を一緒に立ててくれて嬉しいな。', date: new Date(Date.now() - 86400000).toISOString() },
];

const GratitudeCard: React.FC<{ gratitude: Gratitude }> = ({ gratitude }) => {
    const isUser = gratitude.author === 'user';
    return (
        <div className={`p-4 rounded-xl shadow-md transform transition-transform hover:-translate-y-1 ${isUser ? 'bg-blue-100 dark:bg-blue-800/50' : 'bg-pink-100 dark:bg-pink-800/50'}`}>
            <p className="text-gray-700 dark:text-gray-200">{gratitude.content}</p>
            <p className="text-xs text-right mt-2 text-gray-500 dark:text-gray-400">
                {isUser ? 'You' : 'Partner'} - {new Date(gratitude.date).toLocaleDateString()}
            </p>
        </div>
    )
}

export const GratitudeJar: React.FC = () => {
    const [gratitudes, setGratitudes] = useState<Gratitude[]>(initialGratitudes);
    const [newGratitude, setNewGratitude] = useState('');

    const handleAddGratitude = () => {
        if (!newGratitude.trim()) return;
        const newEntry: Gratitude = {
            id: new Date().toISOString(),
            author: 'user',
            content: newGratitude,
            date: new Date().toISOString(),
        };
        setGratitudes([newEntry, ...gratitudes]);
        setNewGratitude('');
    };

    return (
        <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg h-full flex flex-col">
            <div className="text-center mb-6">
                 <h2 className="text-3xl font-bold font-mplus text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">Gratitude Jar</h2>
                 <p className="text-gray-500 dark:text-gray-400 mt-1">A shared space for thankfulness.</p>
            </div>

            <div className="mb-6">
                <textarea
                    value={newGratitude}
                    onChange={(e) => setNewGratitude(e.target.value)}
                    placeholder="What are you thankful for today?"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white/50 dark:bg-gray-700/50 focus:ring-pink-500 focus:border-pink-500"
                    rows={3}
                ></textarea>
                <button 
                    onClick={handleAddGratitude}
                    className="mt-2 w-full py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                    Add to Jar
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gratitudes.map(g => (
                        <GratitudeCard key={g.id} gratitude={g} />
                    ))}
                </div>
            </div>
        </div>
    );
};
   