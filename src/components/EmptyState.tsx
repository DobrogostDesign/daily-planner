import React from 'react';
import { Check } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="rounded-lg border-dashed border-2 border-gray-200 px-4 py-2">
      <div className="flex items-center gap-2">
        <div className='relative flex items-center justify-center peer w-5 h-5 border-2 border-gray-200 border-dashed rounded-md'>
          <Check 
          className="absolute w-4 h-4 text-gray-300" 
          strokeWidth={2}
        /> </div>
        <h3 className="text-sm flex-1 text-gray-500">Nothing scheduled for today</h3>
        <p className="text-xs text-right w-1/3 text-gray-400 italic">“A journey of a thousand miles begin with a single step.” — Laozi</p>
      </div>
    </div>
  );
};

export default EmptyState; 