
import React from 'react';
import { DiaryEntry } from '../types';
import { AIFeedbackDisplay } from './AIFeedbackDisplay';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DiaryViewProps {
    entry: DiaryEntry;
    onEdit: () => void;
    onDelete: (id: string) => void;
    onUpdateFeedback: (entryId: string, feedbackContent: string) => void;
}

export const DiaryView: React.FC<DiaryViewProps> = ({ entry, onEdit, onDelete, onUpdateFeedback }) => {
    return (
        <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                    <h2 className="font-mplus mb-0 text-gray-800 dark:text-gray-100">{new Date(entry.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {entry.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs text-purple-700 bg-purple-100 dark:text-purple-200 dark:bg-purple-800/50 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                    <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><EditIcon /></button>
                    <button onClick={() => onDelete(entry.id)} className="p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50 text-red-500 transition-colors"><DeleteIcon /></button>
                </div>
            </div>
            
            <hr className="my-4 border-gray-200 dark:border-gray-700"/>
            
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {entry.content}
                    </ReactMarkdown>
                </div>

                {entry.photos && entry.photos.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Photos</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {entry.photos.map((photo, index) => (
                                <img key={index} src={photo} alt={`Diary photo ${index + 1}`} className="w-full aspect-square object-cover rounded-lg shadow-md" />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4">
                <AIFeedbackDisplay 
                    entry={entry} 
                    onFeedbackGenerated={(feedbackContent) => onUpdateFeedback(entry.id, feedbackContent)}
                />
            </div>
        </div>
    );
};

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;