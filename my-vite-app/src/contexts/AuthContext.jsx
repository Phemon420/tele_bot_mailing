"use client"

import { createContext, useContext, useState, useEffect } from "react"
import Cookies from 'js-cookie'
import { authAPI } from "../../api/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(Cookies.get("jwt_token") || null)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   if (token) {
  //     // Set token in API headers
  //     authAPI.defaults.headers.common["Authorization"] = `Token ${token}`
  //     // You could also fetch user profile here
  //   }
  //   setLoading(false)
  // }, [token])


useEffect(() => {
  const jwt = Cookies.get("jwt_token")

  if (jwt) {
    // Set token in API headers as Bearer token
    authAPI.defaults.headers.common["Authorization"] = `Bearer ${jwt}`
    setToken(jwt)
    // Optionally: fetch user profile
  }

  setLoading(false)
}, [])


  // const login = async (credentials) => {
  //   try {
  //     //console.log("Logging in with credentials:", credentials)
  //     const response = await authAPI.post("/login/", credentials)
  //     const { user, token: newToken } = response.data

  //     setUser(user)
  //     setToken(newToken)
  //     localStorage.setItem("token", newToken)
  //     authAPI.defaults.headers.common["Authorization"] = `Token ${newToken}`

  //     return { success: true, user }
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error.response?.data?.error || "Login failed",
  //     }
  //   }
  // }



const login = async (credentials) => {
  try {
    const response = await authAPI.post("/login/", credentials)
    const { user, token: newToken } = response.data

    setUser(user)
    setToken(newToken)

    // Save token in a cookie (expires in 7 days)
    Cookies.set("jwt_token", newToken, {
      expires: 7,         // 7 days
      secure: false,      // Set to true in production (HTTPS only)
      sameSite: 'Lax',    // Helps with CSRF protection
    })

    // Optional: set default auth header for future requests
    authAPI.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

    return { success: true, user }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Login failed",
    }
  }
}


  const register = async (userData) => {
    try {
      const response = await authAPI.post("/register/", userData)
      const { user, token: newToken } = response.data

      setUser(user)
      setToken(newToken)
      // Save token in a cookie (expires in 7 days)
    Cookies.set("jwt_token", newToken, {
      expires: 7,         // 7 days
      secure: false,      // Set to true in production (HTTPS only)
      sameSite: 'Lax',    // Helps with CSRF protection
    })
    
      authAPI.defaults.headers.common["Authorization"] = `Token ${newToken}`

      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || "Registration failed",
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    Cookies.remove("jwt_token")
    delete authAPI.defaults.headers.common["Authorization"]
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
