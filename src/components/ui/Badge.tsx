import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color: 'green' | 'gray' | 'red' | 'yellow';
}

const Badge: React.FC<BadgeProps> = ({ children, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    gray: 'bg-gray-200 text-gray-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

export default Badge;