import React, { useState, useEffect, useCallback } from 'react';

// --- Helper Functions for Dates ---
const getISODateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const getPastDate = (daysAgo: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
};

const getMonthStartDate = (): Date => {
    const date = new Date();
    date.setDate(1);
    return date;
}

// --- Quick Select Button Component ---
interface QuickSelectButtonProps {
    label: string;
    onClick: () => void;
}
const QuickSelectButton: React.FC<QuickSelectButtonProps> = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 dark:text-purple-200 dark:bg-purple-800/50 rounded-full hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
    >
        {label}
    </button>
);


interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (startDate: string, endDate: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
    const today = getISODateString(new Date());
    const [startDate, setStartDate] = useState(getISODateString(getPastDate(30)));
    const [endDate, setEndDate] = useState(today);

    // --- Accessibility: Close on Escape key ---
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

    const handleExportClick = () => {
        if (!startDate || !endDate) {
            alert("Please select both a start and end date.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            alert("Start date cannot be after end date.");
            return;
        }
        onExport(startDate, endDate);
    };
    
    // --- Quick Select Handlers ---
    const selectLast7Days = () => {
        setStartDate(getISODateString(getPastDate(7)));
        setEndDate(today);
    }
    
    const selectLast30Days = () => {
        setStartDate(getISODateString(getPastDate(30)));
        setEndDate(today);
    }

    const selectThisMonth = () => {
        setStartDate(getISODateString(getMonthStartDate()));
        setEndDate(today);
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
        >
            <div 
                className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-white/20 shadow-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="export-modal-title" className="text-xl font-bold font-mplus text-gray-700 dark:text-gray-200 mb-4">Export Entries</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select a date range for the export.</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    <QuickSelectButton label="Last 7 Days" onClick={selectLast7Days} />
                    <QuickSelectButton label="Last 30 Days" onClick={selectLast30Days} />
                    <QuickSelectButton label="This Month" onClick={selectThisMonth} />
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            max={today}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={handleExportClick} className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md">Export</button>
                </div>
            </div>
        </div>
    );
};
