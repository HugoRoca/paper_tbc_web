import api from './api'

export const auditoriaService = {
  list: async (params = {}) => {
    const response = await api.get('/auditoria', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/auditoria/${id}`)
    return response.data
  },
}
