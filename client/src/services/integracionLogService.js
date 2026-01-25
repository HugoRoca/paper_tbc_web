import api from './api'

export const integracionLogService = {
  list: async (params = {}) => {
    const response = await api.get('/integraciones-log', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/integraciones-log/${id}`)
    return response.data
  },
}
