
import React from 'react';

export const Header: React.FC = () => {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="flex justify-between items-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 backdrop-blur-lg shadow-md">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-mplus">Today's Reflection</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{today}</p>
            </div>
            <div className="flex items-center">
                <p className="mr-4 font-semibold text-gray-700 dark:text-gray-300">Onigiri-san</p>
                <img src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-purple-300 shadow-sm" />
            </div>
        </header>
    );
}
   