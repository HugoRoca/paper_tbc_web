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
}
