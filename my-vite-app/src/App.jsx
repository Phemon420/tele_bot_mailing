import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import Features from "./pages/tasks_completed"
import TelegramUsersTable from "./pages/user_list"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unprotect" element={<Features />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/telegram_user_list"
              element={
                <ProtectedRoute>
                  <TelegramUsersTable />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
