// src/components/dashboard/AnalyticsChart.tsx
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Icon from '@/components/ui/Icon';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import type { SalesFunnelProps } from './SalesFunnel';
import { CalendarDays, Loader2 } from 'lucide-react';
// FIX: Replaced failing date-fns imports with manual implementations below to fix module resolution errors.
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';


interface RevenueData {
    day: string;
    revenue: number;
}

interface ChartData {
    label: string;
    value: number;
}

interface AnalyticsChartProps {
    revenueData: ChartData[];
    funnelData: { stage: string; count: number }[];
}

type AnalysisType = 'revenue' | 'funnel';
type ChartType = 'bar' | 'line' | 'pie';
type DateFilterPreset = 'today' | '7d' | '30d' | 'custom';

// FIX: Manual implementation of date-fns functions to avoid module resolution errors.
const startOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};
const endOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
};
const subDays = (date: Date, amount: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - amount);
    return newDate;
};


const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ revenueData, funnelData }) => {
    const [analysis, setAnalysis] = useState<AnalysisType>('revenue');
    const [chartType, setChartType] = useState<ChartType>('bar');

    const [currentRevenueData, setCurrentRevenueData] = useState<ChartData[]>(revenueData);
    const [isLoading, setIsLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [customRange, setCustomRange] = useState({ from: '', to: '' });
    const [activeFilter, setActiveFilter] = useState<DateFilterPreset>('7d');
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNewData = async (from: Date, to: Date) => {
        setIsLoading(true);
        try {
            const fromISO = from.toISOString();
            const toISO = to.toISOString();
            const res = await fetch(`/api/analytics/revenue?from=${fromISO}&to=${toISO}`);
            if (!res.ok) throw new Error("Failed to fetch revenue data.");
            const newData = await res.json();
            setCurrentRevenueData(newData);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
            setIsFilterOpen(false);
        }
    };

    const handleFilterSelect = (filter: DateFilterPreset) => {
        setActiveFilter(filter);
        if (filter === 'custom') return;

        const now = new Date();
        let fromDate: Date;
        const toDate = endOfDay(now);

        if (filter === 'today') {
            fromDate = startOfDay(now);
        } else if (filter === '30d') {
            fromDate = startOfDay(subDays(now, 29));
        } else { // 7d default
            fromDate = startOfDay(subDays(now, 6));
        }

        setCustomRange({ from: format(fromDate, 'yyyy-MM-dd'), to: format(toDate, 'yyyy-MM-dd') });
        fetchNewData(fromDate, toDate);
    };

    const handleCustomRangeApply = () => {
        if (customRange.from && customRange.to) {
            setActiveFilter('custom');
            fetchNewData(new Date(customRange.from), new Date(customRange.to));
        }
    };

    const handleAnalysisChange = (newAnalysis: AnalysisType) => {
        setAnalysis(newAnalysis);
        if (newAnalysis === 'revenue') setChartType('bar');
        if (newAnalysis === 'funnel') setChartType('pie');
    };

    const isChartTypeDisabled = (type: ChartType) => {
        if (analysis === 'revenue') return type === 'pie';
        if (analysis === 'funnel') return type === 'line';
        return false;
    };

    const chartData = useMemo(() => {
        if (analysis === 'revenue') return currentRevenueData;
        if (analysis === 'funnel') return funnelData.map(d => ({ label: d.stage, value: d.count }));
        return [];
    }, [analysis, currentRevenueData, funnelData]);

    const title = analysis === 'revenue' ? 'Revenue' : 'Sales Funnel Breakdown';
    const filterLabel = {
        'today': 'Today',
        '7d': 'Last 7 Days',
        '30d': 'Last 30 Days',
        'custom': 'Custom Range'
    }[activeFilter];

    return (
        <div className="bg-white dark:bg-[var(--card-background)] p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-[var(--card-border)] h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                    {analysis === 'revenue' && (
                        <div className="relative" ref={filterRef}>
                            <button onClick={() => setIsFilterOpen(p => !p)} className="flex items-center text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                <CalendarDays size={14} className="mr-1.5" />
                                {filterLabel}
                            </button>
                            <AnimatePresence>
                                {isFilterOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-xl z-10 p-2">
                                        <button onClick={() => handleFilterSelect('today')} className="w-full text-left text-sm px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Today</button>
                                        <button onClick={() => handleFilterSelect('7d')} className="w-full text-left text-sm px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Last 7 Days</button>
                                        <button onClick={() => handleFilterSelect('30d')} className="w-full text-left text-sm px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Last 30 Days</button>
                                        <div className="border-t dark:border-gray-700 my-1"></div>
                                        <div className="p-2 space-y-2">
                                            <label className="text-xs font-semibold">Custom</label>
                                            <input type="date" value={customRange.from} onChange={e => setCustomRange(p => ({ ...p, from: e.target.value }))} className="w-full border rounded-md text-xs p-1 dark:bg-gray-700 dark:border-gray-600" />
                                            <input type="date" value={customRange.to} onChange={e => setCustomRange(p => ({ ...p, to: e.target.value }))} className="w-full border rounded-md text-xs p-1 dark:bg-gray-700 dark:border-gray-600" />
                                            <button onClick={handleCustomRangeApply} className="w-full bg-blue-600 text-white text-xs py-1.5 rounded">Apply</button>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
                        <button onClick={() => handleAnalysisChange('revenue')} className={`px-2 py-1 text-xs font-semibold rounded ${analysis === 'revenue' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>Revenue</button>
                        <button onClick={() => handleAnalysisChange('funnel')} className={`px-2 py-1 text-xs font-semibold rounded ${analysis === 'funnel' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}>Funnel</button>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
                        <button disabled={isChartTypeDisabled('bar')} onClick={() => setChartType('bar')} className={`p-1.5 rounded ${chartType === 'bar' && !isChartTypeDisabled('bar') ? 'bg-white dark:bg-gray-800 shadow-sm' : 'disabled:opacity-30'}`}><Icon name="barChart3" size={16} /></button>
                        <button disabled={isChartTypeDisabled('line')} onClick={() => setChartType('line')} className={`p-1.5 rounded ${chartType === 'line' && !isChartTypeDisabled('line') ? 'bg-white dark:bg-gray-800 shadow-sm' : 'disabled:opacity-30'}`}><Icon name="lineChart" size={16} /></button>
                        <button disabled={isChartTypeDisabled('pie')} onClick={() => setChartType('pie')} className={`p-1.5 rounded ${chartType === 'pie' && !isChartTypeDisabled('pie') ? 'bg-white dark:bg-gray-800 shadow-sm' : 'disabled:opacity-30'}`}><Icon name="pieChart" size={16} /></button>
                    </div>
                </div>
            </div>
            <div className="mt-6 min-h-[250px] flex items-center justify-center">
                {isLoading ? <Loader2 className="animate-spin text-blue-500" /> : (
                    <>
                        {analysis === 'revenue' && chartType === 'bar' && <BarChart data={chartData} isCurrency />}
                        {analysis === 'revenue' && chartType === 'line' && <LineChart data={chartData} isCurrency />}
                        {analysis === 'funnel' && chartType === 'pie' && <PieChart data={chartData} />}
                        {analysis === 'funnel' && chartType === 'bar' && <BarChart data={chartData} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsChart;