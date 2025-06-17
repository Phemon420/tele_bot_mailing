"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { protectedAPI } from "../../api/api"
import toast from "react-hot-toast"
import { User, Mail, Calendar, MessageCircle } from "lucide-react"

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    telegram_username: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await protectedAPI.get("/profile/")
        setProfile(response.data)
        setFormData({
          telegram_username: response.data.telegram_username || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const response = await protectedAPI.put("/profile/", formData)
      setProfile(response.data)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setUpdating(false)
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

      {/* User Information */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <User className="mr-2" size={24} />
          User Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-medium">{profile?.user.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{profile?.user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">
                {profile?.user.first_name} {profile?.user.last_name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium">{new Date(profile?.user.date_joined).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Integration */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <MessageCircle className="mr-2" size={24} />
          Telegram Integration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="telegram_username" className="block text-sm font-medium text-gray-700 mb-1">
              Telegram Username
            </label>
            <input
              type="text"
              id="telegram_username"
              name="telegram_username"
              value={formData.telegram_username}
              onChange={handleChange}
              placeholder="@your_telegram_username"
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-1">Enter your Telegram username to connect with our bot</p>
          </div>

          <button type="submit" disabled={updating} className="btn-primary disabled:opacity-50">
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Telegram Bot Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Connect with our Telegram Bot</h2>

        <div className="space-y-3 text-blue-700">
          <p>To connect with our Telegram bot, follow these steps:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Search for our bot on Telegram: <code className="bg-blue-100 px-2 py-1 rounded">@YourBotName</code>
            </li>
            <li>
              Send the <code className="bg-blue-100 px-2 py-1 rounded">/start</code> command
            </li>
            <li>Update your Telegram username in the form above</li>
            <li>
              Use <code className="bg-blue-100 px-2 py-1 rounded">/profile</code> to view your bot profile
            </li>
          </ol>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="font-medium">Available Bot Commands:</p>
            <ul className="mt-2 space-y-1">
              <li>
                <code>/start</code> - Register with the bot
              </li>
              <li>
                <code>/profile</code> - View your profile
              </li>
              <li>
                <code>/help</code> - Get help and information
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
