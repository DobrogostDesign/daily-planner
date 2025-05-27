import { useState } from 'react'
import type { Task } from './types/Task'
import TaskItem from './components/TaskItem'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    setNewTaskDescription('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Get current date in the required format
  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-2xl font-normal mb-1 text-[24px]">
            Your plans for <span className="italic">today</span>
          </h1>
          <p className="text-[32px] font-medium mt-[4px]">{dateString}</p>
        </header>

        <div className="mb-6">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}

          <form onSubmit={addTask} className="mt-8">
            <input
              type="text"
              placeholder="Write you task here"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-0 py-2 outline-none placeholder-gray-400"
            />
            <div className="flex gap-4 items-center mt-2">
              <input
                type="text"
                placeholder="Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="flex-1 px-0 py-2 outline-none placeholder-gray-400"
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
