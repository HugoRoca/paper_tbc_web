import api from './api'

export const userService = {
  list: async (params = {}) => {
    const response = await api.get('/usuarios', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/usuarios', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`)
    return response.data
  },

  changePassword: async (id, data) => {
    const response = await api.put(`/usuarios/${id}/cambiar-password`, data)
    return response.data
  },
}
