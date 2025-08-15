import React, { useState } from 'react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (startDate: string, endDate: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

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

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-white/20 shadow-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold font-mplus text-gray-700 dark:text-gray-200 mb-4">Export Entries</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Select a date range for the export.</p>
                
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
