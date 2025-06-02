import { useState, useEffect, useRef } from 'react'
import type { Task } from './types/Task'
import TaskItem from './components/TaskItem'
import EmptyState from './components/EmptyState'
import './App.css'
import { CornerDownLeft } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ScheduledJune from './pages/ScheduledJune';
import ShoppingList from './pages/ShoppingList';

const TASK_ANIMATION_DURATION = 300;

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initial render
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [isError, setIsError] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [selectedIdx, setSelectedIdx] = useState(0); // default to Plans for today
  const [scheduledTasks, setScheduledTasks] = useState<any[]>([]); // Replace any with your type if you have one
  const [shoppingList, setShoppingList] = useState<any[]>([]); // Replace any with your type if you have one
  const [removingTaskId, setRemovingTaskId] = useState<string | null>(null);
  const [lastAddedTaskId, setLastAddedTaskId] = useState<string | null>(null);

  const navItems = [
    { icon: '/calendar.png', label: 'Plans for today', count: tasks.length },
    { icon: '/schedule.png', label: 'Scheduled', count: scheduledTasks.length },
    { icon: '/shoping.png', label: 'Shopping list', count: shoppingList.length },
  ];

  // Check for new day and clean up completed tasks
  useEffect(() => {
    const lastCheckedDate = localStorage.getItem('lastCheckedDate')
    const today = new Date().toDateString()

    if (lastCheckedDate !== today) {
      // It's a new day, remove completed tasks
      setTasks(prevTasks => prevTasks.filter(task => !task.completed))
      localStorage.setItem('lastCheckedDate', today)
    }
  }, []) // Run only on component mount

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) {
      setIsError(true)
      // Reset error state after animation completes
      setTimeout(() => setIsError(false), 300)
      // Remove and re-add shake class to retrigger animation
      if (titleInputRef.current) {
        titleInputRef.current.classList.remove('shake')
        // Force reflow
        void titleInputRef.current.offsetWidth
        titleInputRef.current.classList.add('shake')
      }
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    setNewTaskDescription('')
    setIsError(false)
    setLastAddedTaskId(newTask.id)
    setTimeout(() => setLastAddedTaskId(null), TASK_ANIMATION_DURATION)
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const handleDeleteTask = (id: string) => {
    setRemovingTaskId(id);
    setTimeout(() => {
      setTasks(tasks => tasks.filter(task => task.id !== id));
      setRemovingTaskId(null);
    }, TASK_ANIMATION_DURATION);
  };

  const formatDate = () => {
    const date = new Date()
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar selectedIdx={selectedIdx} onSelect={setSelectedIdx} navItems={navItems} />
      <main className="flex-1 py-8 px-4 flex justify-center">
        <div className="max-w-2xl w-full">
          {selectedIdx === 0 ? (
            <>
              <header className="mb-12">
                <h1 className="text-2xl font-normal text-2xl">
                  Your plans for <span className="italic">today</span>
                </h1>
                <p className="text-3xl font-medium">{formatDate()}</p>
              </header>
              <div className="mb-6">
                <div className="space-y-1">
                  {tasks.length === 0 ? (
                    <EmptyState />
                  ) : (
                    tasks.map(task => (
                      <div
                        key={task.id}
                        className={
                          removingTaskId === task.id
                            ? 'animate-fade-out-right pointer-events-none'
                            : lastAddedTaskId === task.id
                              ? 'opacity-0 translate-x-12 animate-fade-in-right'
                              : 'opacity-100 translate-x-0 transition-all duration-300 ease-in-out'
                        }
                      >
                        <TaskItem
                          task={task}
                          onToggle={toggleTask}
                          onDelete={handleDeleteTask}
                        />
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={addTask} className="mt-8">
                  <div className="flex gap-4 item-start">
                    <div className="flex flex-col gap-4 flex-1">
                      <input
                        ref={titleInputRef}
                        type="text"
                        placeholder="Write you task here"
                        value={newTaskTitle}
                        onChange={(e) => {
                          setNewTaskTitle(e.target.value)
                          setIsError(false)
                        }}
                        className={`font-normal outline-none bg-transparent placeholder-gray-400 ${
                          isError ? 'placeholder-red-500' : ''
                        }`}
                      />
                     <input
                      type="text"
                      placeholder="Description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="text-sm font-normal flex-1 outline-none placeholder-gray-400 bg-transparent"
                    />
                    </div>
                    <div className="flex flex-col flex-none h-full mt-auto">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-gray-950 text-white py-2 px-4 rounded-lg hover:opacity-85 transition-opacity whitespace-nowrap">
                      <span className='text-sm font-medium'>Add task</span>
                      <span className="flex items-center text-gray-400 gap-1 bg-gray-900 border border-gray-700 rounded-md px-1 h-5">
                       <CornerDownLeft className="w-4 h-4" />
                        <span className="text-xs">return</span>
                      </span>
                    </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : selectedIdx === 1 ? (
            <ScheduledJune />
          ) : (
            <ShoppingList />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
