"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Use alias path for consistency.
import Icon from '@/components/ui/Icon';

interface RevenueData {
    day: string;
    revenue: number;
}

interface RevenueChartProps {
    data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data = [] }) => {
    const [tooltip, setTooltip] = useState<{ x: number, y: number, data: RevenueData } | null>(null);

    const maxValue = Math.max(...data.map(d => d.revenue), 0);
    const chartHeight = 250;
    const barWidth = 30;
    const barMargin = 20;

    const handleMouseMove = (e: React.MouseEvent<SVGRectElement>, item: RevenueData) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ x: rect.left + window.scrollX, y: rect.top + window.scrollY, data: item });
    };

    return (
        <div className="bg-white dark:bg-[var(--card-background)] p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-[var(--card-border)] h-full">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Revenue (Last 7 Days)</h3>
                <Icon name="activity" className="text-gray-400 dark:text-gray-400" />
            </div>
            <div className="mt-6">
                <svg width="100%" height={chartHeight + 40} aria-labelledby="chart-title">
                    <title id="chart-title">7-day Revenue Bar Chart</title>
                    {data.map((item, index) => {
                        const barHeight = maxValue > 0 ? (item.revenue / maxValue) * chartHeight : 0;
                        const x = index * (barWidth + barMargin) + barMargin;
                        const y = chartHeight - barHeight;

                        return (
                            <g key={item.day}>
                                <motion.rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="currentColor"
                                    className="text-blue-500 hover:text-blue-700 transition-colors"

                                    onMouseMove={(e) => handleMouseMove(e, item)}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                                <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" fontSize="12" className="fill-current text-gray-500 dark:text-gray-400">
                                    {item.day}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
            <AnimatePresence>
                {tooltip && (
                    <motion.div

                        style={{ top: tooltip.y - 60, left: tooltip.x - 30 }}
                        className="absolute bg-gray-800 text-white text-sm rounded-lg py-2 px-3 shadow-lg pointer-events-none"
                    >
                        <p className="font-bold">₹{tooltip.data.revenue.toLocaleString('en-IN')}</p>
                        <p className="text-gray-300 text-xs">{tooltip.data.day}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RevenueChart;