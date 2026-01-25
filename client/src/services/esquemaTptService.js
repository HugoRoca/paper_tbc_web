import api from './api'

export const esquemaTptService = {
  list: async (params = {}) => {
    const response = await api.get('/esquemas-tpt', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/esquemas-tpt/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/esquemas-tpt', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/esquemas-tpt/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/esquemas-tpt/${id}`)
    return response.data
  },
}
