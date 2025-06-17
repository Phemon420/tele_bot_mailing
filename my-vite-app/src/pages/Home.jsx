"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// import { useAuth } from "../contexts/AuthContext"
import { publicAPI } from "../../api/api"
import { Server, Shield, Zap, MessageCircle } from "lucide-react"

const Home = () => {
  // const { isAuthenticated } = useAuth()
  const [publicInfo, setPublicInfo] = useState(null)

  useEffect(() => {
    const fetchPublicInfo = async () => {
      try {
        const response = await publicAPI.get("/public/")
        setPublicInfo(response.data)
      } catch (error) {
        console.error("Error fetching public info:", error)
      }
    }

    fetchPublicInfo()
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Django Internship Assignment</h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive full-stack application demonstrating Django REST Framework, Celery, Telegram Bot integration,
          and modern React frontend.
        </p>

          <div className="space-x-4">
            <Link to="/dashboard" className="btn-primary border-black border-2 border-spacing-2" >
              Go To Protected Route
            </Link>
            <Link to="/unprotect" className="btn-secondary">
              Go to Unprotected Route
            </Link>
          </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
        <div className="card text-center">
          <Server className="mx-auto mb-4 text-primary-600" size={48} />
          <h3 className="text-lg font-semibold mb-2">Django REST API</h3>
          <p className="text-gray-600">Robust backend with public and protected endpoints</p>
        </div>

        <div className="card text-center">
          <Shield className="mx-auto mb-4 text-primary-600" size={48} />
          <h3 className="text-lg font-semibold mb-2">Authentication</h3>
          <p className="text-gray-600">Token-based authentication with user management</p>
        </div>

        <div className="card text-center">
          <Zap className="mx-auto mb-4 text-primary-600" size={48} />
          <h3 className="text-lg font-semibold mb-2">Celery Tasks</h3>
          <p className="text-gray-600">Background task processing with Redis</p>
        </div>

        <div className="card text-center">
          <MessageCircle className="mx-auto mb-4 text-primary-600" size={48} />
          <h3 className="text-lg font-semibold mb-2">Telegram Bot</h3>
          <p className="text-gray-600">Integrated bot for user interaction</p>
        </div>
      </div>

      {/* API Info Section */}
      {publicInfo && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">API Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Version</h3>
              <p className="text-gray-600">{publicInfo.version}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Message</h3>
              <p className="text-gray-600">{publicInfo.message}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Available Endpoints</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {Object.entries(publicInfo.endpoints).map(([name, endpoint]) => (
                <div key={name} className="flex justify-between py-1">
                  <span className="font-medium">{name}:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Technology Stack */}
      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Backend</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Django 4.2</li>
              <li>• Django REST Framework</li>
              <li>• Celery with Redis</li>
              <li>• Telegram Bot API</li>
              <li>• Token Authentication</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Frontend</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• React 18</li>
              <li>• Vite</li>
              <li>• React Router</li>
              <li>• Tailwind CSS</li>
              <li>• Axios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
