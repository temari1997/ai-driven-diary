import React from 'react';
import { User } from '../types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 backdrop-blur-lg shadow-md">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-mplus">Today's Reflection</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{today}</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
                 <div className="text-right flex-1">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px] sm:max-w-xs">{user.email}</p>
                    <button onClick={onLogout} className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                        Logout
                    </button>
                </div>
                <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-purple-300 shadow-sm" />
            </div>
        </header>
    );
}
