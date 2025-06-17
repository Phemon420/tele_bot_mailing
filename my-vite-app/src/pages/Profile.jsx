"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { protectedAPI } from "../../api/api"
import toast from "react-hot-toast"
import { User, Mail, Calendar, MessageCircle } from "lucide-react"
import Cookies from "js-cookie"

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    telegram_username: "",
  })


useEffect(() => {
  const userCookie = Cookies.get("jwt_user")

  if (userCookie) {
    const fetchProfile = async () => {
      try {
        const response = await protectedAPI.post("/profile/", {
          email: userCookie, // clean extra quotes just in case
        })
        //console.log("Profile response:", response.data)
        setProfile(response.data.profile)  // adjust based on your API structure
      } catch (err) {
        console.error("Failed to fetch profile by email", err)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  } else {
    setLoading(false)
  }
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
      const response = await protectedAPI.get("/profile/", formData)
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
              <p className="font-medium">{profile.full_name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium">{new Date(profile.date_joined).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Telegram Bot Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Connect with our Telegram Bot</h2>

        <div className="space-y-3 text-blue-700">
          <p>To connect with our Telegram bot, follow these steps:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Search for our bot on Telegram: <code className="bg-blue-100 px-2 py-1 rounded">@lol3466_bot</code>
            </li>
            <li>
              Send the <code className="bg-blue-100 px-2 py-1 rounded">/start</code> command
            </li>
            <li>Update your Telegram username in the form above</li>
          </ol>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="font-medium">Available Bot Commands:</p>
            <ul className="mt-2 space-y-1">
              <li>
                <code>/start</code> - Collects username with the bot
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
