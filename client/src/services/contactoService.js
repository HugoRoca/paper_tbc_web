import api from './api'

export const contactoService = {
  // Listar contactos con paginación y filtros
  list: async (params = {}) => {
    const response = await api.get('/contactos', { params })
    return response.data
  },

  // Obtener contactos por caso índice
  getByCasoIndice: async (casoIndiceId) => {
    const response = await api.get(`/contactos/caso-indice/${casoIndiceId}`)
    return response.data
  },

  // Obtener contacto por ID
  getById: async (id) => {
    const response = await api.get(`/contactos/${id}`)
    return response.data
  },

  // Crear nuevo contacto
  create: async (data) => {
    const response = await api.post('/contactos', data)
    return response.data
  },

  // Actualizar contacto
  update: async (id, data) => {
    const response = await api.put(`/contactos/${id}`, data)
    return response.data
  },

  // Eliminar contacto
  delete: async (id) => {
    const response = await api.delete(`/contactos/${id}`)
    return response.data
  },
}
