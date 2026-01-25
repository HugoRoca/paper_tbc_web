import api from './api'

export const tptSeguimientoService = {
  list: async (params = {}) => {
    const response = await api.get('/tpt-seguimiento', { params })
    return response.data
  },

  getByTptIndicacion: async (tptIndicacionId) => {
    const response = await api.get(`/tpt-seguimiento/tpt-indicacion/${tptIndicacionId}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/tpt-seguimiento/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/tpt-seguimiento', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/tpt-seguimiento/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/tpt-seguimiento/${id}`)
    return response.data
  },
}
