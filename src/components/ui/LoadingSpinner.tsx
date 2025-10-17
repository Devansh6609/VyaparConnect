// src/components/ui/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
    const styles = {
        bubble: {
            animation: 'vc-pulse-bubble 2.5s infinite ease-in-out',
            transformOrigin: 'center',
        },
        vPath: {
            strokeDasharray: 90,
            strokeDashoffset: 90,
            animation: 'vc-draw-v 1.5s ease-out forwards infinite',
        },
        ellipsis1: {
            animation: 'vc-blink-ellipsis 1.4s infinite 0s',
        },
        ellipsis2: {
            animation: 'vc-blink-ellipsis 1.4s infinite 0.2s',
        },
        ellipsis3: {
            animation: 'vc-blink-ellipsis 1.4s infinite 0.4s',
        },
    };

    return (
        <div className="flex flex-col items-center justify-center p-8" role="status" aria-label="Loading">
            <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                <g style={styles.bubble}>
                    <path
                        d="M85,50 A35,35 0 1,1 15,50 A35,35 0 0,1 85,50 Z"
                        fill="currentColor"
                        fillOpacity="0.1"
                    />
                    <path
                        d="M20,70 Q30,85 40,70 L20,70 Z"
                        fill="currentColor"
                        fillOpacity="0.1"
                    />
                </g>
                <path
                    style={styles.vPath}
                    d="M30 35 L 50 58 L 70 35"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <g className="text-gray-400" fill="currentColor">
                    <circle style={styles.ellipsis1} cx="38" cy="72" r="3" />
                    <circle style={styles.ellipsis2} cx="50" cy="72" r="3" />
                    <circle style={styles.ellipsis3} cx="62" cy="72" r="3" />
                </g>
            </svg>
            <p className="text-gray-500 mt-2 text-sm font-medium animate-pulse">Connecting...</p>
        </div>
    );
};

export default LoadingSpinner;
