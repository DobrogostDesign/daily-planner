import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Task } from '../types/Task';
import { isPast, isToday, parseISO } from 'date-fns';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [completedTasks, setCompletedTasks] = useLocalStorage<Task[]>('completedTasks', []);
  const [streak, setStreak] = useLocalStorage<number>('streak', 0);

  useEffect(() => {
    const lastCheckedDate = localStorage.getItem('lastCheckedDate');
    const today = new Date().toDateString();

    if (lastCheckedDate !== today) {
      const tasksToMove = tasks.filter(task => task.completed);
      if (tasksToMove.length > 0) {
        setCompletedTasks(prev => [...prev, ...tasksToMove]);
        setTasks(prev => prev.filter(task => !task.completed));
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastCheckedDate === yesterdayStr && tasksToMove.length > 0) {
          setStreak(prev => prev + 1);
        } else {
          setStreak(0);
        }
      }
      
      localStorage.setItem('lastCheckedDate', today);
    }
  }, []);

  const { overdueTasks, todayTasks } = tasks.reduce((acc, task) => {
    if (!task.completed && task.dueDate) {
      const dueDate = parseISO(task.dueDate);
      if (isPast(dueDate) && !isToday(dueDate)) {
        acc.overdueTasks.push(task);
      } else {
        acc.todayTasks.push(task);
      }
    } else {
      acc.todayTasks.push(task);
    }
    return acc;
  }, { overdueTasks: [] as Task[], todayTasks: [] as Task[] });

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      completed: false,
      ...task,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (taskToToggle) {
      const updatedTask = {
        ...taskToToggle,
        completed: !taskToToggle.completed,
        completedAt: !taskToToggle.completed ? new Date().toISOString() : undefined
      };
      setTasks(prevTasks => prevTasks.map(t => t.id === id ? updatedTask : t));
    } else {
      const completedTaskToToggle = completedTasks.find(t => t.id === id);
      if (completedTaskToToggle) {
        setCompletedTasks(prev => prev.filter(t => t.id !== id));
        setTasks(prev => [...prev, { ...completedTaskToToggle, completed: false, completedAt: undefined }]);
      }
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  };

  const deleteCompletedTask = (id: string) => {
    setCompletedTasks(tasks => tasks.filter(task => task.id !== id));
  };

  return {
    tasks,
    completedTasks,
    streak,
    overdueTasks,
    todayTasks,
    addTask,
    toggleTask,
    deleteTask,
    deleteCompletedTask,
  };
} 