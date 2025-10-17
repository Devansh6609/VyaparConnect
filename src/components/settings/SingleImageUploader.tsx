// src/components/settings/SingleImageUploader.tsx
"use client";

import React, { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

interface SingleImageUploaderProps {
    initialUrl?: string | null;
    onUpload: (url: string) => void;
    isQrCode?: boolean;
}

const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({ initialUrl, onUpload, isQrCode = false }) => {
    const [imageUrl, setImageUrl] = useState(initialUrl);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/uploads/file', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setImageUrl(data.url);
            onUpload(data.url);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            {imageUrl ? (
                <div className="flex items-center space-x-4">
                    <img
                        src={imageUrl}
                        alt="preview"
                        className={`border rounded-md p-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${isQrCode ? 'h-32 w-32' : 'h-16'} object-contain`}
                    />
                    <label className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                        Change
                        <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />
                    </label>
                </div>
            ) : (
                <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin h-8 w-8" />
                            <span className="mt-2 text-sm font-medium">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="h-8 w-8" />
                            <span className="mt-2 text-sm font-medium">Click to upload</span>
                            <span className="text-xs">PNG or JPG</span>
                            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />
                        </>
                    )}
                </label>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default SingleImageUploader;
