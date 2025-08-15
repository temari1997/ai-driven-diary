import React, { useEffect, useCallback } from 'react';
import { User } from '../types';

interface GoogleAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAllow: () => void;
    user: User;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose, onAllow, user }) => {
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
    
    const handleAllow = () => {
        onAllow();
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="google-auth-title"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center space-x-2 mb-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" className="w-8 h-8"/>
                    <h2 id="google-auth-title" className="text-xl font-medium text-gray-700 dark:text-gray-200">Sign in with Google</h2>
                </div>
                
                <div className="border rounded-lg p-4 mb-6">
                    <p className="text-center text-sm mb-4 text-gray-600 dark:text-gray-400">Choose an account to continue to <strong>AI Diary</strong></p>
                    <div className="flex items-center space-x-4 p-3 border rounded-md hover:bg-blue-50 dark:hover:bg-gray-700/50 cursor-pointer">
                        <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt="User Avatar" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{user.email.split('@')[0]}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        To continue, Google will share your name, email address, and profile picture with <strong>AI Diary</strong>. Before using this app, you can review its <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">privacy policy</a> and <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">terms of service</a>.
                    </p>
                </div>
                
                <hr className="my-4 border-gray-200 dark:border-gray-700"/>

                <div className="mb-4">
                     <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">AI Diary wants to access your Google Account</p>
                     <div className="flex items-start space-x-3 p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">See, edit, create, and delete your Google Drive files</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">This allows the app to store and retrieve your diary backups from a dedicated spreadsheet in your Google Drive.</p>
                        </div>
                     </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
                    <button onClick={handleAllow} className="px-8 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow">Allow</button>
                </div>
            </div>
        </div>
    );
};