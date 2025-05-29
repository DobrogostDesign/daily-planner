import { useState, useEffect, useRef } from 'react'
import type { Task } from './types/Task'
import TaskItem from './components/TaskItem'
import EmptyState from './components/EmptyState'
import './App.css'

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
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Write you task here"
              value={newTaskTitle}
              onChange={(e) => {
                setNewTaskTitle(e.target.value)
                setIsError(false)
              }}
              className={`w-full px-0 py-2 outline-none bg-transparent placeholder-gray-400 ${
                isError ? 'placeholder-red-500' : ''
              }`}
            />
            <div className="flex gap-4 items-center mt-2">
              <input
                type="text"
                placeholder="Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="flex-1 px-0 py-2 outline-none placeholder-gray-400 bg-transparent"
              />
              <button
                type="submit"
                className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
              >
                Add task <span className="ml-1">↵</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
