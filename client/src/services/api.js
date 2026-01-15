import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        // Token inválido o expirado
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Solo redirigir si no estamos en la página de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        }
      } else if (status === 403) {
        toast.error('No tienes permisos para realizar esta acción.')
      } else if (status >= 500) {
        toast.error('Error del servidor. Por favor, intenta más tarde.')
      } else {
        const message = data?.message || 'Ha ocurrido un error'
        toast.error(message)
      }
    } else if (error.request) {
      toast.error('No se pudo conectar con el servidor.')
    } else {
      toast.error('Ha ocurrido un error inesperado.')
    }
    
    return Promise.reject(error)
  }
)

export default api
