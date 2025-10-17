
"use client";
import React, { useEffect, useRef } from 'react';

interface EmojiPickerProps {
    onSelectEmoji: (emoji: string) => void;
    onClose: () => void;
}

const EMOJIS = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃',
    '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟',
    '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧',
    '😷', '🤒', '🤕', '🤑', '🤠', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎',
    '🖤', '🤍', '💔', '👍', '👎', '👌', '✌️', '🤞', '🙏', '🙌', '👏', '🤝',
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji, onClose }) => {
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={pickerRef} className="absolute bottom-full mb-2 bg-white p-3 rounded-2xl shadow-lg border w-80 h-60 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
                {EMOJIS.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => onSelectEmoji(emoji)}
                        className="text-2xl hover:bg-gray-200 rounded-lg p-1 transition-colors"
                        aria-label={`Emoji ${emoji}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmojiPicker;
