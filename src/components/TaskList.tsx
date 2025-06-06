import type { Task } from '../types/Task';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  overdueTasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, overdueTasks, onToggle, onDelete }: TaskListProps) {
  return (
    <>
      {overdueTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-red-600 mb-4">
            OVERDUES {overdueTasks.length}
          </h2>
          <div className="space-y-2">
            {overdueTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        {overdueTasks.length > 0 && (
          <h2 className="text-lg font-medium mb-4">
            TODAY
          </h2>
        )}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
} 