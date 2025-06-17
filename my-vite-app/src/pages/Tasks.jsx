"use client"

import { useState, useEffect } from "react"
import { protectedAPI } from "../../api/api"
import toast from "react-hot-toast"
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await protectedAPI.get("/tasks/")
      setTasks(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingTask) {
        await protectedAPI.put(`/tasks/${editingTask.id}/`, formData)
        toast.success("Task updated successfully!")
      } else {
        await protectedAPI.post("/tasks/", formData)
        toast.success("Task created successfully!")
      }

      setFormData({ title: "", description: "" })
      setShowForm(false)
      setEditingTask(null)
      fetchTasks()
    } catch (error) {
      console.error("Error saving task:", error)
      toast.error("Failed to save task")
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
    })
    setShowForm(true)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await protectedAPI.delete(`/tasks/${taskId}/`)
        toast.success("Task deleted successfully!")
        fetchTasks()
      } catch (error) {
        console.error("Error deleting task:", error)
        toast.error("Failed to delete task")
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={20} />
      case "processing":
        return <Clock className="text-yellow-500" size={20} />
      case "failed":
        return <AlertCircle className="text-red-500" size={20} />
      default:
        return <Clock className="text-gray-500" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingTask(null)
            setFormData({ title: "", description: "" })
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">{editingTask ? "Edit Task" : "Create New Task"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingTask ? "Update Task" : "Create Task"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingTask(null)
                  setFormData({ title: "", description: "" })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {getStatusIcon(task.status)}
                  <button onClick={() => handleEdit(task)} className="p-2 text-gray-400 hover:text-primary-600">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <CheckCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-4">Create your first task to get started!</p>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingTask(null)
                setFormData({ title: "", description: "" })
              }}
              className="btn-primary"
            >
              Create Task
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tasks
