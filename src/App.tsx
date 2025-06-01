import { useState, useEffect, useRef } from 'react'
import type { Task } from './types/Task'
import TaskItem from './components/TaskItem'
import EmptyState from './components/EmptyState'
import './App.css'
import { CornerDownLeft } from 'lucide-react';

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
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

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
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-2xl font-normal mb-1 text-[24px]">
            Your plans for <span className="italic">today</span>
          </h1>
          <p className="text-[32px] font-medium mt-[4px]">{formatDate()}</p>
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
                  onDelete={deleteTask}
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
      </div>
    </div>
  )
}

export default App
