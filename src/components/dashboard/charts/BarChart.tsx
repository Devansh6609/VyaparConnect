
// src/components/dashboard/charts/BarChart.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChartData {
    label: string;
    value: number;
}

interface BarChartProps {
    data: ChartData[];
    isCurrency?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data = [], isCurrency }) => {
    const [tooltip, setTooltip] = useState<{ x: number, y: number, data: ChartData } | null>(null);

    const padding = { top: 20, right: 10, bottom: 30, left: 60 };
    const chartHeight = 250;
    const chartWidth = 750; // Increased width to fill container
    const maxValue = Math.max(...data.map(d => d.value), 0) * 1.1; // Add 10% headroom

    const numTicks = 5;
    const yAxisTicks = Array.from({ length: numTicks + 1 }, (_, i) => {
        const value = (maxValue / numTicks) * i;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        return { value, y };
    });

    const formatYAxisLabel = (value: number) => {
        if (isCurrency) {
            // Using compact notation for Indian locale (Lakh, Crore)
            return `₹${value.toLocaleString('en-IN', { notation: 'compact', compactDisplay: 'short' })}`;
        }
        return value.toLocaleString('en-IN');
    };

    const handleMouseOver = (e: React.MouseEvent<SVGRectElement>, item: ChartData) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top,
            data: item
        });
    };

    const barSpacing = data.length > 0 ? chartWidth / data.length : 0;
    const estimatedLabelWidth = 40; // A rough estimate for labels like "Oct 15"
    const labelSkipInterval = Math.max(1, Math.ceil(estimatedLabelWidth / barSpacing));

    return (
        <div className="relative">
            <svg width="100%" height={chartHeight + padding.top + padding.bottom} viewBox={`0 0 ${chartWidth + padding.left + padding.right} ${chartHeight + padding.top + padding.bottom}`} aria-labelledby="chart-title">
                <title id="chart-title">Bar Chart</title>

                {/* Y-axis with labels and grid lines */}
                <g className="text-gray-400 dark:text-gray-500">
                    {yAxisTicks.map(tick => (
                        <g key={tick.value} transform={`translate(0, ${tick.y})`}>
                            <line x1={padding.left} x2={padding.left + chartWidth} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,3" />
                            <text
                                x={padding.left - 8}
                                y="0"
                                dy="0.32em"
                                textAnchor="end"
                                fontSize="12"
                                className="fill-current"
                            >
                                {formatYAxisLabel(tick.value)}
                            </text>
                        </g>
                    ))}
                </g>

                {/* Bars and X-axis labels */}
                <g transform={`translate(${padding.left}, ${padding.top})`}>
                    {data.map((item, index) => {
                        const barWidth = barSpacing * 0.6;
                        const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
                        const x = index * barSpacing + (barSpacing - barWidth) / 2;
                        const y = chartHeight - barHeight;

                        return (
                            <g key={item.label}>
                                <rect
                                    x={x}
                                    width={barWidth}
                                    rx={3}
                                    fill="currentColor"
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    onMouseOver={(e) => handleMouseOver(e, item)}
                                    onMouseLeave={() => setTooltip(null)}
                                    y={y}
                                    height={barHeight}
                                />
                                {index % labelSkipInterval === 0 && (
                                    <text x={x + barWidth / 2} y={chartHeight + 15} textAnchor="middle" fontSize="12" className="fill-current text-gray-500 dark:text-gray-400">
                                        {item.label}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>
            <AnimatePresence>
                {tooltip && (
                    <div
                        style={{
                            position: 'fixed',
                            top: tooltip.y,
                            left: tooltip.x,
                            transform: 'translate(-50%, -100%) translateY(-8px)',
                        }}
                        className="bg-gray-800 text-white text-sm rounded-lg py-1 px-3 shadow-lg pointer-events-none z-10"
                    >
                        <p className="font-bold whitespace-nowrap">{isCurrency ? '₹' : ''}{tooltip.data.value.toLocaleString('en-IN')}</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BarChart;
