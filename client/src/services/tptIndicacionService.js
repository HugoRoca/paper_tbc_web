import api from './api'

export const tptIndicacionService = {
  list: async (params = {}) => {
    const response = await api.get('/tpt-indicaciones', { params })
    return response.data
  },

  getByContacto: async (contactoId) => {
    const response = await api.get(`/tpt-indicaciones/contacto/${contactoId}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/tpt-indicaciones/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/tpt-indicaciones', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/tpt-indicaciones/${id}`, data)
    return response.data
  },

  iniciar: async (id, data) => {
    const response = await api.put(`/tpt-indicaciones/${id}/iniciar`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/tpt-indicaciones/${id}`)
    return response.data
  },
}
