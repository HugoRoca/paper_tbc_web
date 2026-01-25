import api from './api'

export const controlContactoService = {
  list: async (params = {}) => {
    const response = await api.get('/controles-contacto', { params })
    return response.data
  },

  getByContacto: async (contactoId) => {
    const response = await api.get(`/controles-contacto/contacto/${contactoId}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/controles-contacto/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/controles-contacto', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/controles-contacto/${id}`, data)
    return response.data
  },

  marcarRealizado: async (id, data) => {
    const response = await api.put(`/controles-contacto/${id}/realizar`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/controles-contacto/${id}`)
    return response.data
  },
}
