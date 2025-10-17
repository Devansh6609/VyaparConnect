// src/components/ui/Tag.tsx
import React from 'react';
import { X } from 'lucide-react';

interface TagProps {
    name: string;
    color: string;
    onRemove?: () => void;
}

const Tag: React.FC<TagProps> = ({ name, color, onRemove }) => {
    return (
        <div
            className="flex items-center text-xs font-medium rounded-full px-2.5 py-1"
            style={{
                // Use a semi-transparent background color derived from the tag's main color
                backgroundColor: `${color}20`, // e.g., #3b82f620 for blue with 12.5% opacity
                color: color,
            }}
        >
            <span>{name}</span>
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1.5 -mr-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
                    aria-label={`Remove tag ${name}`}
                >
                    <X size={12} style={{ color: color }} />
                </button>
            )}
        </div>
    );
};

export default Tag;
