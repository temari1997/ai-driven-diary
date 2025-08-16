
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full p-3 my-1 rounded-lg transition-all duration-200 ${
            isActive
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-500 dark:text-gray-400 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 hover:text-purple-700 dark:hover:text-white'
        }`}
    >
        {icon}
        <span className="ml-4 font-semibold">{label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
    return (
        <aside className="w-64 bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg flex-shrink-0 flex flex-col">
            <div className="flex items-center mb-8">
                <div className="p-2 bg-white rounded-full shadow-md">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>
                </div>
                <h1 className="text-2xl font-bold ml-3 font-mplus text-gray-800 dark:text-white">AI Diary</h1>
            </div>

            <nav className="flex-1">
                <NavItem
                    icon={<DiaryIcon />}
                    label="Diary"
                    isActive={currentView === 'diary'}
                    onClick={() => setView('diary')}
                />
                <NavItem
                    icon={<GratitudeIcon />}
                    label="Gratitude Jar"
                    isActive={currentView === 'gratitude'}
                    onClick={() => setView('gratitude')}
                />
                <NavItem
                    icon={<StatsIcon />}
                    label="Stats & Trends"
                    isActive={currentView === 'stats'}
                    onClick={() => setView('stats')}
                />
            </nav>
            
            <div className="mt-auto">
                 <NavItem
                    icon={<SettingsIcon />}
                    label="Settings"
                    isActive={currentView === 'settings'}
                    onClick={() => setView('settings')}
                />
                <div className="text-center text-xs text-gray-400 mt-4">
                    v{__APP_VERSION__}
                </div>
            </div>
        </aside>
    );
};

const DiaryIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.137A2 2 0 019.618 3h4.764a2 2 0 011.914 1.137l3.462 6.825A2 2 0 0118.382 12H5.618a2 2 0 01-1.22-3.038l3.306-6.825z"></path>
    </svg>
);

const GratitudeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
    </svg>
);

const StatsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
);
