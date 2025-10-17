// src/components/transactions/FilterModal.tsx
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
// FIX: Used type-only import with path alias to prevent module resolution errors.
import type { QuotationStatus } from '../../types';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters: { statuses: QuotationStatus[] };
    onApplyFilters: (filters: { statuses: QuotationStatus[] }) => void;
}

const allStatuses: QuotationStatus[] = [
    'DRAFT', 'SENT', 'CONFIRMED', 'BILLED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED'
];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, currentFilters, onApplyFilters }) => {
    const [selectedStatuses, setSelectedStatuses] = useState<QuotationStatus[]>(currentFilters.statuses);

    const handleStatusChange = (status: QuotationStatus) => {
        setSelectedStatuses(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const handleApply = () => {
        onApplyFilters({ statuses: selectedStatuses });
    };

    const handleReset = () => {
        setSelectedStatuses([]);
        onApplyFilters({ statuses: [] });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Filter Transactions">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        {allStatuses.map(status => (
                            <label key={status} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedStatuses.includes(status)}
                                    onChange={() => handleStatusChange(status)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm capitalize">{status.replace('_', ' ').toLowerCase()}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 border rounded-md">
                        Reset
                    </button>
                    <div className="flex space-x-2">
                        <button onClick={onClose} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
                        <button onClick={handleApply} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Apply Filters</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FilterModal;