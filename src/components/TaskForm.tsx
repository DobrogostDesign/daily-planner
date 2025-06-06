import { useState, useRef } from 'react';
import { CornerDownLeft } from 'lucide-react';
import DatePicker from './DatePicker';
import type { Task } from '../types/Task';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setIsError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setIsError(true);
      setTimeout(() => setIsError(false), 300);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
    });

    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="flex flex-col gap-4">
        <input
          ref={titleInputRef}
          type="text"
          placeholder="Write your task here"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsError(false);
          }}
          className={`font-normal outline-none bg-transparent placeholder-gray-400 ${
            isError ? 'placeholder-red-500' : ''
          }`}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm font-normal outline-none placeholder-gray-400 bg-transparent"
        />
        <div className="flex justify-between items-center">
          <DatePicker
            onSelect={setDueDate}
            initialDate={null}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-gray-950 text-white py-2 px-4 rounded-lg hover:opacity-85 whitespace-nowrap"
          >
            <span className="text-sm font-medium">Add task</span>
            <span className="flex items-center text-gray-400 gap-1 bg-gray-900 border border-gray-700 rounded-md px-1 h-5">
              <CornerDownLeft className="w-4 h-4" />
              <span className="text-xs">return</span>
            </span>
          </button>
        </div>
      </div>
    </form>
  );
} 