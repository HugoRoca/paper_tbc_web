import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          try {
            const response = await authService.getMe()
            if (response && response.success) {
              setUser(response.data.user || response.data)
              setIsAuthenticated(true)
            } else {
              authService.logout()
              setUser(null)
              setIsAuthenticated(false)
            }
          } catch (error) {
            // Si hay error (token inválido, expirado, etc.), limpiar autenticación
            console.error('Error verificando autenticación:', error)
            authService.logout()
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error en checkAuth:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      if (response && response.success) {
        const { token, user: userData } = response.data
        authService.setAuth(token, userData)
        setUser(userData)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response?.message || 'Error al iniciar sesión' 
        }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    setUser(userData)
    const token = authService.getToken()
    if (token) {
      authService.setAuth(token, userData)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user || !user.id) {
        return { success: false, error: 'Usuario no encontrado' }
      }
      const response = await authService.changePassword(
        user.id,
        currentPassword,
        newPassword
      )
      if (response && response.success) {
        return { success: true }
      } else {
        return {
          success: false,
          error: response?.message || 'Error al cambiar contraseña',
        }
      }
    } catch (error) {
      console.error('Error en changePassword:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cambiar contraseña',
      }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
