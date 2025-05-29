import React from 'react';
import EmptyStateIcons from './EmptyStateIcons';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-[0_0_5px_rgba(3,7,18,0.05)] relative overflow-hidden">
      <div className="py-16 pl-12">
        <h3 className="text-base font-medium text-gray-900">Your day is empty</h3>
        <p className="text-sm text-gray-500 mt-1">Add your first task for today</p>
      </div>
      <EmptyStateIcons />
    </div>
  );
};

export default EmptyState; 