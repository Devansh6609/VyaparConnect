// src/components/dashboard/charts/LineChart.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChartData {
    label: string;
    value: number;
}

interface LineChartProps {
    data: ChartData[];
    isCurrency?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ data = [], isCurrency }) => {
    const [tooltip, setTooltip] = useState<{ x: number, y: number, data: ChartData } | null>(null);

    const padding = { top: 20, right: 10, bottom: 30, left: 60 };
    const chartHeight = 250;
    const chartWidth = 750; // Increased width to fill container
    const maxValue = Math.max(...data.map(d => d.value), 0) * 1.1;

    const numTicks = 5;
    const yAxisTicks = Array.from({ length: numTicks + 1 }, (_, i) => {
        const value = (maxValue / numTicks) * i;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        return { value, y };
    });

    const formatYAxisLabel = (value: number) => {
        if (isCurrency) {
            return `₹${value.toLocaleString('en-IN', { notation: 'compact', compactDisplay: 'short' })}`;
        }
        return value.toLocaleString('en-IN');
    };

    const points = data.map((item, index) => {
        const x = data.length > 1 ? (index / (data.length - 1)) * chartWidth : chartWidth / 2;
        const y = chartHeight - (maxValue > 0 ? (item.value / maxValue) * chartHeight : 0);
        return { x: x + padding.left, y: y + padding.top, data: item };
    });

    const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

    const handleMouseOver = (e: React.MouseEvent<SVGCircleElement>, pointData: ChartData) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top,
            data: pointData
        });
    };

    const pointSpacing = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;
    const estimatedLabelWidth = 40; // A rough estimate for labels like "Oct 15"
    const labelSkipInterval = Math.max(1, Math.ceil(estimatedLabelWidth / pointSpacing));

    return (
        <div className="relative">
            <svg width="100%" height={chartHeight + padding.top + padding.bottom} viewBox={`0 0 ${chartWidth + padding.left + padding.right} ${chartHeight + padding.top + padding.bottom}`} aria-labelledby="chart-title">
                <title id="chart-title">Line Chart</title>

                {/* Y-axis with labels and grid lines */}
                <g className="text-gray-400 dark:text-gray-500">
                    {yAxisTicks.map(tick => (
                        <g key={tick.value} transform={`translate(0, ${tick.y})`}>
                            <line x1={padding.left} x2={padding.left + chartWidth} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,3" />
                            <text x={padding.left - 8} y="0" dy="0.32em" textAnchor="end" fontSize="12" className="fill-current">
                                {formatYAxisLabel(tick.value)}
                            </text>
                        </g>
                    ))}
                </g>

                {/* Line and Points */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-blue-500"
                />
                <g>
                    {points.map((point, index) => (
                        <g key={data[index].label}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="10"
                                fill="transparent"
                                onMouseOver={(e) => handleMouseOver(e, data[index])}
                                onMouseLeave={() => setTooltip(null)}
                            />
                            <circle
                                cx={point.x}
                                cy={point.y}
                                fill="currentColor"
                                className="text-blue-500 pointer-events-none"
                                r="4"
                            />
                            {index % labelSkipInterval === 0 && (
                                <text x={point.x} y={chartHeight + padding.top + 20} textAnchor="middle" fontSize="12" className="fill-current text-gray-500 dark:text-gray-400">
                                    {data[index].label}
                                </text>
                            )}
                        </g>
                    ))}
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

export default LineChart;