import api from './api'

export const visitaDomiciliariaService = {
  // Listar visitas domiciliarias
  list: async (params = {}) => {
    const response = await api.get('/visitas-domiciliarias', { params })
    return response.data
  },

  // Obtener visitas por caso índice
  getByCasoIndice: async (casoIndiceId) => {
    const response = await api.get(`/visitas-domiciliarias/caso-indice/${casoIndiceId}`)
    return response.data
  },

  // Obtener visitas por contacto
  getByContacto: async (contactoId) => {
    const response = await api.get(`/visitas-domiciliarias/contacto/${contactoId}`)
    return response.data
  },

  // Obtener visita por ID
  getById: async (id) => {
    const response = await api.get(`/visitas-domiciliarias/${id}`)
    return response.data
  },

  // Crear nueva visita
  create: async (data) => {
    const response = await api.post('/visitas-domiciliarias', data)
    return response.data
  },

  // Actualizar visita
  update: async (id, data) => {
    const response = await api.put(`/visitas-domiciliarias/${id}`, data)
    return response.data
  },

  // Eliminar visita
  delete: async (id) => {
    const response = await api.delete(`/visitas-domiciliarias/${id}`)
    return response.data
  },
}
