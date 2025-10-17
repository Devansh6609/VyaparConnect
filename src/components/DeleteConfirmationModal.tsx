"use client";
import React from 'react';
// FIX: Used type-only import to prevent module resolution errors.
import type { Message } from '../types';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
    message: Message;
    onClose: () => void;
    onConfirmDelete: (messageId: string) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ message, onClose, onConfirmDelete }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800">Delete message?</h2>
                    <div className="my-4 p-3 bg-gray-100 rounded-md text-sm text-gray-700 truncate">
                        {message.text || message.fileName || 'Attachment'}
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-transparent rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirmDelete(message.id)}
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-transparent rounded-md hover:bg-red-50 transition-colors flex items-center"
                    >
                        <Trash2 size={16} className="mr-1.5" /> Delete for Everyone
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;