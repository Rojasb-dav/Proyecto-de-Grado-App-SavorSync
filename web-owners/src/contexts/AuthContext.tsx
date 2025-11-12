import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'

// API Configuration
const API_URL = 'http://localhost:5000/api'

interface User {
  id: string
  email: string
  username: string
  fullName: string
  phone?: string
  avatarUrl?: string
  isActive: boolean
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        // Verify token is still valid
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })

        if (response.data.user) {
          setUser(response.data.user)
          setToken(storedToken)
          // Set default axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        platform: 'web_owners',
        deviceInfo: {
          platform: 'web',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      })

      const { user: userData, token: userToken } = response.data

      // Store in localStorage
      localStorage.setItem('auth_token', userToken)
      localStorage.setItem('auth_user', JSON.stringify(userData))

      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`

      setUser(userData)
      setToken(userToken)

      toast.success(`¡Bienvenido, ${userData.fullName}!`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      
      // Clear axios header
      delete axios.defaults.headers.common['Authorization']
      
      setUser(null)
      setToken(null)

      toast.success('Sesión cerrada exitosamente')
    }
  }

  const refreshToken = async () => {
    try {
      if (!token) return

      const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const { token: newToken } = response.data
      localStorage.setItem('auth_token', newToken)
      setToken(newToken)
      
      // Update axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, logout user
      await logout()
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Axios interceptor for handling token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const authContext = useAuth()
        await authContext.refreshToken()
        
        // Retry the original request with new token
        const token = localStorage.getItem('auth_token')
        originalRequest.headers.Authorization = `Bearer ${token}`
        return axios(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        const authContext = useAuth()
        await authContext.logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
