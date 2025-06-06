import React from 'react';
import type { Task } from '../types/Task';
import { Check, X, Trash2, Clock as ClockIcon } from 'lucide-react';
import { format, isPast, startOfToday, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !task.completed;

  const formatDueDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    
    if (isToday(date)) {
      return 'Today';
    }
    if (isTomorrow(date)) {
      return 'Tomorrow';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'MMM d');
  };

  return (
    <div className="flex justify-center items-start gap-2 p-4 bg-white rounded-lg shadow-[0_0_5px_rgba(3,7,18,0.05)] group">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="peer w-5 h-5 border border-gray-300 rounded-md accent-gray-950 appearance-none checked:bg-gray-950 checked:border-gray-950 focus:ring-0 focus:ring-offset-0 cursor-pointer"
        />
        <Check 
          className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100" 
          strokeWidth={2}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`mt-0.5 text-xs ${task.completed ? 'line-through text-gray-300' : 'text-gray-500'}`}>
            {task.description}
          </p>
        )}
        {task.dueDate && (
          <div className={`mt-2 inline-flex items-center px-2 py-1 rounded text-xs
            ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
            <img src="/calendar.webp" alt="Calendar" className="w-3 h-3 mr-1" />
            {formatDueDate(task.dueDate)}
          </div>
        )}
      </div>
      <button 
        className="peer w-5 h-5 relative flex items-center justify-center"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        <X 
          className="absolute w-4 h-4 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity" 
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default TaskItem; 