import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch (_) {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token)
        const userData = { email, name: email.split('@')[0] }
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return { success: true }
      }
      return { success: false, error: res.data.error || 'Login failed' }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.detail || 'Connection to server failed'
      return { success: false, error: errMsg }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      if (res.data.message) return { success: true }
      return { success: false, error: 'Registration failed' }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.detail || 'Connection to server failed'
      return { success: false, error: errMsg }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
