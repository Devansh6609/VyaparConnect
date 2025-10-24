// src/components/dashboard/charts/PieChart.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChartData {
    label: string;
    value: number;
}

interface PieChartProps {
    data: ChartData[];
}

const STAGE_CONFIG: { [key: string]: { label: string; color: string } } = {
    NEW_LEAD: { label: 'New Lead', color: '#3b82f6' },
    CONTACTED: { label: 'Contacted', color: '#6366f1' },
    QUOTATION_SENT: { label: 'Quotation Sent', color: '#8b5cf6' },
    PAYMENT_PENDING: { label: 'Payment Pending', color: '#eab308' },
    COMPLETED: { label: 'Completed', color: '#22c55e' },
    LOST: { label: 'Lost', color: '#ef4444' },
    Unknown: { label: 'Unknown', color: '#64748b' }
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

const getPieSlicePath = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
};


const PieChart: React.FC<PieChartProps> = ({ data = [] }) => {
    const [hoveredSlice, setHoveredSlice] = useState<ChartData | null>(null);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativeAngle = 0;

    const slices = data.map(item => {
        const angle = total > 0 ? (item.value / total) * 360 : 0;
        const path = getPieSlicePath(75, 75, 75, cumulativeAngle, cumulativeAngle + angle);
        cumulativeAngle += angle;
        return { path, ...item };
    });

    const hoveredLabel = hoveredSlice ? (STAGE_CONFIG[hoveredSlice.label]?.label || hoveredSlice.label) : 'Total';
    const hoveredValue = hoveredSlice ? hoveredSlice.value : total;

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start gap-8 sm:gap-12">
            <div className="relative">
                <svg width="150" height="150" viewBox="0 0 150 150">
                    {slices.map((slice, index) => (
                        <path
                            key={slice.label}
                            d={slice.path}
                            fill={STAGE_CONFIG[slice.label]?.color || STAGE_CONFIG.Unknown.color}
                            onMouseEnter={() => setHoveredSlice(slice)}
                            onMouseLeave={() => setHoveredSlice(null)}
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <AnimatePresence mode="wait">
                        <div
                            key={hoveredLabel}
                            className="text-center"
                        >
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{hoveredValue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{hoveredLabel}</p>
                        </div>
                    </AnimatePresence>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                {data.map(item => (
                    <div
                        key={item.label}
                        className="flex items-center"
                        onMouseEnter={() => setHoveredSlice(item)}
                        onMouseLeave={() => setHoveredSlice(null)}
                    >
                        <span style={{ backgroundColor: STAGE_CONFIG[item.label]?.color || STAGE_CONFIG.Unknown.color }} className="w-3 h-3 rounded-sm mr-2"></span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{STAGE_CONFIG[item.label]?.label || item.label}:</span>
                        <span className="ml-2 font-semibold text-gray-800 dark:text-gray-100">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;