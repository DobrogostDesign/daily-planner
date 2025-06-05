import React from 'react';
import TaskItem from '../components/TaskItem';
import type { Task } from '../types/Task';

interface CompletedProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  streak: number;
  taskCount: number;
}

interface TasksByDate {
  [date: string]: Task[];
}

const getStreakMessage = (streak: number) => {
  if (streak === 0) return '';
  if (streak > 10) return `${streak}-day(s) PLACEHOLDER`;
  
  const messages = [
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
    `${streak}-day(s) PLACEHOLDER`,
  ];
  
  return messages[streak - 1];
};

const formatDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'TODAY';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'YESTERDAY';
  } else {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      weekday: 'short'
    }).toUpperCase();
  }
};

const Completed: React.FC<CompletedProps> = ({ tasks, onToggle, onDelete, streak, taskCount }) => {
  // Group tasks by date
  const tasksByDate = tasks.reduce((acc: TasksByDate, task) => {
    const date = task.completedAt 
      ? new Date(task.completedAt).toDateString()
      : new Date(parseInt(task.id)).toDateString(); // fallback for older tasks
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(tasksByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium mb-4">Successfully Completed {taskCount} tasks</h1>
      {streak > 0 && (
        <p className="text-gray-600 mb-8">{getStreakMessage(streak)}</p>
      )}
      <div className="space-y-8">
        {sortedDates.map(date => (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-gray-400">
                {formatDate(new Date(date))}
              </h2>
              <div className="h-[1px] flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">
                {tasksByDate[date].length} {tasksByDate[date].length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <div className="space-y-2">
              {tasksByDate[date].map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Completed; 