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

  useEffect(() => {
    const jwt = Cookies.get("jwt_token");
    const storedUser = Cookies.get("jwt_user");

  if (jwt) {
    authAPI.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    setToken(jwt);
  }

  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      setUser(null); // fallback if corrupted
    }
  }

  window.ReactUser = user;
  setLoading(false);
}, []);


const login = async (credentials) => {
  try {
    const response = await authAPI.post("/login/", credentials)
    const { user, token: newToken } = response.data
    
    //console.log("Login response:", response)

    setUser(user)
    setToken(newToken)

    // Save token in a cookie (expires in 7 days)
    Cookies.set("jwt_token", newToken, {
      expires: 7,         // 7 days
      secure: false,      // Set to true in production (HTTPS only)
      sameSite: 'Lax',    // Helps with CSRF protection
    })
    Cookies.set("jwt_user", JSON.stringify(user), {
  expires: 7,
  secure: false,
  sameSite: "Lax",
    });

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
    Cookies.remove("jwt_user")
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
