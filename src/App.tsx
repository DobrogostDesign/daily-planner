import { useState, useEffect, useRef } from 'react'
import type { Task } from './types/Task'
import TaskItem from './components/TaskItem'
import EmptyState from './components/EmptyState'
import './App.css'
import { CornerDownLeft } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ScheduledJune from './pages/ScheduledJune';
import ShoppingList from './pages/ShoppingList';
import Completed from './pages/Completed';
import { Toaster, toast } from 'sonner';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  
  const [completedTasks, setCompletedTasks] = useState<Task[]>(() => {
    const savedCompletedTasks = localStorage.getItem('completedTasks')
    return savedCompletedTasks ? JSON.parse(savedCompletedTasks) : []
  })
  
  const [streak, setStreak] = useState<number>(() => {
    const savedStreak = localStorage.getItem('streak')
    return savedStreak ? parseInt(savedStreak) : 0
  })

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [isError, setIsError] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [scheduledTasks, setScheduledTasks] = useState<any[]>([])
  const [shoppingList, setShoppingList] = useState<any[]>([])

  const navItems = [
    { icon: '/calendar.webp', label: 'Plans for today', count: tasks.length },
    { icon: '/schedule.webp', label: 'Scheduled', count: scheduledTasks.length },
    { icon: '/completed.webp', label: 'Completed', count: completedTasks.length },
    { icon: '/shoping.webp', label: 'Shopping list', count: shoppingList.length },
  ];

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks))
  }, [completedTasks])

  useEffect(() => {
    localStorage.setItem('streak', streak.toString())
  }, [streak])

  useEffect(() => {
    const lastCheckedDate = localStorage.getItem('lastCheckedDate')
    const today = new Date().toDateString()

    if (lastCheckedDate !== today) {
      const tasksToMove = tasks.filter(task => task.completed)
      if (tasksToMove.length > 0) {
        setCompletedTasks(prev => [...prev, ...tasksToMove])
        setTasks(prev => prev.filter(task => !task.completed))
        
        if (tasksToMove.length > 0) {
          setStreak(prev => prev + 1)
        } else {
          setStreak(0)
        }
      }
      
      localStorage.setItem('lastCheckedDate', today)
    }
  }, [])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) {
      setIsError(true)
      setTimeout(() => setIsError(false), 300)
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
  }

  const toggleTask = (id: string) => {
    const taskToToggle = tasks.find(t => t.id === id)
    if (taskToToggle) {
      if (!taskToToggle.completed) {
        const completedTask = { 
          ...taskToToggle, 
          completed: true,
          completedAt: new Date().toISOString()
        };
        setTasks(prevTasks => prevTasks.filter(t => t.id !== id))
        setCompletedTasks(prev => [...prev, completedTask])
        
        toast("Completed", {
          description: taskToToggle.title,
          action: {
            label: "Undo",
            onClick: () => {
              setCompletedTasks(prev => prev.filter(t => t.id !== id))
              setTasks(prev => [...prev, { ...taskToToggle, completed: false, completedAt: undefined }])
            }
          }
        })
      }
    } else {
      const completedTaskToToggle = completedTasks.find(t => t.id === id)
      if (completedTaskToToggle) {
        setCompletedTasks(prev => prev.filter(t => t.id !== id))
        setTasks(prev => [...prev, { ...completedTaskToToggle, completed: false, completedAt: undefined }])
      }
    }
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  };

  const handleDeleteCompletedTask = (id: string) => {
    setCompletedTasks(tasks => tasks.filter(task => task.id !== id));
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
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={handleDeleteTask}
                      />
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
                      className="flex items-center gap-2 bg-gray-950 text-white py-2 px-4 rounded-lg hover:opacity-85 whitespace-nowrap">
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
          ) : selectedIdx === 2 ? (
            <Completed
              tasks={completedTasks}
              onToggle={toggleTask}
              onDelete={handleDeleteCompletedTask}
              streak={streak}
              taskCount={completedTasks.length}
            />
          ) : (
            <ShoppingList />
          )}
        </div>
      </main>
      <Toaster position="bottom-center" />
    </div>
  )
}

export default App
