
import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types';
import { getAIFeedback } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIFeedbackDisplayProps {
    entry: DiaryEntry;
    onFeedbackGenerated: (feedbackContent: string) => void;
}

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
);

export const AIFeedbackDisplay: React.FC<AIFeedbackDisplayProps> = ({ entry, onFeedbackGenerated }) => {
    const [feedback, setFeedback] = useState<string | null>(entry.aiFeedback?.content || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFeedback = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newFeedback = await getAIFeedback(entry.content);
            setFeedback(newFeedback);
            onFeedbackGenerated(newFeedback);
        } catch (err) {
            setError('Failed to get feedback. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Reset feedback when entry changes
    useEffect(() => {
        setFeedback(entry.aiFeedback?.content || null);
    }, [entry]);


    return (
        <div className="mt-6 p-4 bg-purple-50 dark:bg-gray-700/50 rounded-xl border border-purple-200 dark:border-purple-800/60 relative">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <img src="https://picsum.photos/seed/okayu/32/32" alt="Okayu avatar" className="w-8 h-8 rounded-full mr-3 border-2 border-white" />
                    <h3 className="font-bold text-purple-800 dark:text-purple-200 font-mplus">おかゆからのフィードバック</h3>
                </div>
                {feedback && !isLoading && (
                    <button 
                        onClick={fetchFeedback} 
                        title="Regenerate feedback" 
                        className="p-1.5 rounded-full text-purple-600 dark:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 transition-colors"
                        aria-label="Regenerate feedback"
                    >
                        <RefreshIcon />
                    </button>
                )}
            </div>
            {isLoading ? (
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
                    <span>考えてるよ...</span>
                </div>
            ) : error ? (
                <div className="flex justify-between items-center">
                    <p className="text-red-500 text-sm">{error}</p>
                    <button onClick={fetchFeedback} className="px-3 py-1 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                        Try Again
                    </button>
                </div>
            ) : feedback ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 max-h-48 overflow-y-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedback}</ReactMarkdown>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No feedback yet. Generate one?</p>
                    <button onClick={fetchFeedback} className="px-3 py-1 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                        Generate
                    </button>
                </div>
            )}
        </div>
    );
};
