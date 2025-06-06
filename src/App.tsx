import './App.css';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ScheduledJune from './pages/ScheduledJune';
import ShoppingList from './pages/ShoppingList';
import Completed from './pages/Completed';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const {
    tasks,
    completedTasks,
    streak,
    overdueTasks,
    todayTasks,
    addTask,
    toggleTask,
    deleteTask,
    deleteCompletedTask,
  } = useTasks();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [scheduledTasks] = useState<any[]>([]);
  const [shoppingList] = useState<any[]>([]);

  const navItems = [
    { icon: '/calendar.webp', label: 'Plans for today', count: tasks.length },
    { icon: '/schedule.webp', label: 'Scheduled', count: scheduledTasks.length },
    { icon: '/completed.webp', label: 'Completed', count: completedTasks.length },
    { icon: '/shoping.webp', label: 'Shopping list', count: shoppingList.length },
  ];

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDeleteCompletedTask = (id: string) => {
    const taskToDelete = completedTasks.find(t => t.id === id);
    if (taskToDelete) {
      deleteCompletedTask(id);
      toast("Task deleted", {
        description: taskToDelete.title,
        action: {
          label: "Undo",
          onClick: () => {
            // Undo functionality would go here
          }
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar selectedIdx={selectedIdx} onSelect={setSelectedIdx} navItems={navItems} />
      <main className="flex-1 py-8 px-4 flex justify-center">
        <div className="max-w-2xl w-full">
          {selectedIdx === 0 ? (
            <>
              <header className="mb-12">
                <h1 className="text-2xl font-normal">
                  Your plans for <span className="italic">today</span>
                </h1>
                <p className="text-3xl font-medium">{formatDate()}</p>
              </header>

              <TaskList
                tasks={todayTasks}
                overdueTasks={overdueTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />

              <TaskForm onSubmit={addTask} />
            </>
          ) : selectedIdx === 1 ? (
            <ScheduledJune />
          ) : selectedIdx === 2 ? (
            <Completed
              tasks={completedTasks}
              onDelete={handleDeleteCompletedTask}
              onToggle={toggleTask}
              streak={streak}
              taskCount={completedTasks.length}
            />
          ) : (
            <ShoppingList />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
