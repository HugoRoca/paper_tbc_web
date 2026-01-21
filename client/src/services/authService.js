import api from './api'

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  // Obtener información del usuario autenticado
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Cambiar contraseña
  changePassword: async (userId, currentPassword, newPassword) => {
    const response = await api.put(`/usuarios/${userId}/cambiar-password`, {
      currentPassword: currentPassword,
      newPassword: newPassword,
    })
    return response.data
  },

  // Logout (solo limpiar localStorage)
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Verificar si hay token guardado
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('token')
  },

  // Guardar token y usuario
  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  // Obtener usuario guardado
  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}
