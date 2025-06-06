export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string; // ISO date string when task was completed
  dueDate?: string;
} 