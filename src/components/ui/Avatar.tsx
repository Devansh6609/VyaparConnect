import React from 'react';

interface AvatarProps {
  initials: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ initials, className = '' }) => {
  return (
    <div className={`flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 text-gray-600 font-bold ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;
