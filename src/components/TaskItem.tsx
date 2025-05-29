import React from 'react';
import type { Task } from '../types/Task';
import { Check } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-white mb-2 rounded-lg shadow-[0_0_5px_rgba(3,7,18,0.05)] group">
      <div className="relative flex items-center justify-center mt-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="peer w-[20px] h-[20px] border border-gray-300 rounded-[6px] accent-[#030712] appearance-none checked:bg-[#030712] checked:border-[#030712] focus:ring-0 focus:ring-offset-0 cursor-pointer"
        />
        <Check 
          className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" 
          strokeWidth={3}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`mt-0.5 text-sm ${task.completed ? 'text-gray-300' : 'text-gray-500'}`}>
            {task.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

export default TaskItem; 