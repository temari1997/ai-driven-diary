
import React, { useState, useEffect, useCallback } from 'react';

interface CredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (clientId: string, apiKey: string) => void;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [clientId, setClientId] = useState('');
    const [apiKey, setApiKey] = useState('');

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) {
        return null;
    }

    const handleSaveClick = () => {
        if (!clientId.trim() || !apiKey.trim()) {
            alert("Please provide both a Client ID and an API Key.");
            return;
        }
        onSave(clientId, apiKey);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="credentials-modal-title"
        >
            <div 
                className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-white/20 shadow-lg w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="credentials-modal-title" className="text-xl font-bold font-mplus text-gray-700 dark:text-gray-200 mb-4">Google API Credentials</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    To connect to your own Google Drive, this application needs API credentials. Please create them in your Google Cloud Console and paste them below. These keys will be stored securely in your browser's local storage and will not be sent anywhere else.
                </p>
                <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 block">
                    Go to Google Cloud Console &rarr;
                </a>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Google Client ID</label>
                        <input
                            type="text"
                            id="clientId"
                            value={clientId}
                            onChange={e => setClientId(e.target.value)}
                            placeholder="xxxx.apps.googleusercontent.com"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Google API Key</label>
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={handleSaveClick} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">Save and Continue</button>
                </div>
            </div>
        </div>
    );
};
