

"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// FIX: Use alias path for consistency.
import Icon, { IconName } from '@/components/ui/Icon';

interface KpiCardProps {
  title: string;
  value: number;
  icon: IconName;
  isCurrency?: boolean;
}

// Custom hook for animating numbers
const useCountUp = (end: number, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round(duration / (1000 / 60));
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = end * progress; // Simple linear easing

      if (frame >= totalFrames) {
        clearInterval(counter);
        setCount(end);
      } else {
        setCount(currentCount);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [end, duration]);

  return count;
};


const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, isCurrency = false }) => {
  const animatedValue = useCountUp(value);

  const formatValue = (val: number) => {
    if (isCurrency) {
      return `₹${Math.floor(val).toLocaleString('en-IN')}`;
    }
    return Math.floor(val).toLocaleString('en-IN');
  };

  return (
    <motion.div
      className="bg-white dark:bg-[var(--card-background)] p-5 rounded-xl shadow-sm border border-gray-100/50 dark:border-[var(--card-border)] hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4"
    // FIX: Removed `whileHover` and `transition` props due to TypeScript error. This may affect animations.
    >
      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
        <Icon name={icon} size={24} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</h3>
        <p className="mt-1 text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          {formatValue(animatedValue)}
        </p>
      </div>
    </motion.div>
  );
};

export default KpiCard;