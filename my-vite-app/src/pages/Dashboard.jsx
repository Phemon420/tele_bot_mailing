"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { protectedAPI } from "../../api/api"
import { User, CheckCircle, Clock, AlertCircle } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, tasksResponse] = await Promise.all([
          protectedAPI.get("/profile/"),
          protectedAPI.get("/tasks/"),
        ])

        setProfile(profileResponse.data)
        setTasks(tasksResponse.data.results || tasksResponse.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
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

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    pending: tasks.filter((task) => task.status === "pending").length,
    processing: tasks.filter((task) => task.status === "processing").length,
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <User size={20} />
          <span>Welcome, {user?.username}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <CheckCircle className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">{taskStats.processing}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-600">{taskStats.pending}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Clock className="text-gray-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          {profile && (
            <div className="space-y-3">
              <div>
                <span className="font-medium">Username:</span> {profile.user.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {profile.user.email}
              </div>
              <div>
                <span className="font-medium">Name:</span> {profile.user.first_name} {profile.user.last_name}
              </div>
              <div>
                <span className="font-medium">Telegram:</span> {profile.telegram_username || "Not connected"}
              </div>
              <div>
                <span className="font-medium">Member since:</span>{" "}
                {new Date(profile.user.date_joined).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <span className="text-sm capitalize">{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No tasks yet. Create your first task!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/tasks" className="btn-primary text-center">
            Create New Task
          </a>
          <a href="/profile" className="btn-secondary text-center">
            Update Profile
          </a>
          <div className="text-center">
            <button className="btn-secondary w-full" disabled>
              Connect Telegram Bot
            </button>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
