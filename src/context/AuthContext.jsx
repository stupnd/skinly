import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock JWT authentication service
// In production, replace this with real API calls to Firebase/Supabase
const authService = {
  signIn: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock validation - accept any email/password for demo
    if (email && password) {
      // Generate mock JWT token (in production, this comes from server)
      const token = btoa(JSON.stringify({ 
        email, 
        userId: Date.now().toString(),
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      }))
      
      const user = {
        email,
        id: Date.now().toString(),
        name: email.split('@')[0],
      }
      
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { token, user }
    }
    throw new Error('Invalid credentials')
  },
  
  signUp: async (email, password, name) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (email && password) {
      // Generate mock JWT token
      const token = btoa(JSON.stringify({ 
        email, 
        userId: Date.now().toString(),
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000
      }))
      
      const user = {
        email,
        id: Date.now().toString(),
        name: name || email.split('@')[0],
      }
      
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { token, user }
    }
    throw new Error('Registration failed')
  },
  
  signOut: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    // Note: Keep skinAnalysis and vanityProducts in localStorage
    // They can be retrieved when user logs back in (if implementing cloud sync)
  },
  
  getCurrentUser: () => {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) return null
    
    try {
      // Check if token is expired (simple check, in production use proper JWT verification)
      const tokenData = JSON.parse(atob(token))
      if (tokenData.exp && tokenData.exp < Date.now()) {
        authService.signOut()
        return null
      }
      
      return JSON.parse(userStr)
    } catch (error) {
      authService.signOut()
      return null
    }
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in on mount
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    try {
      const { user: authUser } = await authService.signIn(email, password)
      setUser(authUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email, password, name) => {
    try {
      const { user: authUser } = await authService.signUp(email, password, name)
      setUser(authUser)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signOut = () => {
    authService.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
