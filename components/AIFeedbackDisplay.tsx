
import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types';
import { getAIFeedback } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIFeedbackDisplayProps {
    entry: DiaryEntry;
    onFeedbackGenerated: (feedbackContent: string) => void;
}

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
            <div className="flex items-center mb-2">
                <img src="https://picsum.photos/seed/okayu/32/32" alt="Okayu avatar" className="w-8 h-8 rounded-full mr-3 border-2 border-white" />
                <h3 className="font-bold text-purple-800 dark:text-purple-200 font-mplus">おかゆからのフィードバック</h3>
            </div>
            {isLoading ? (
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
                    <span>考えてるよ...</span>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : feedback ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
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