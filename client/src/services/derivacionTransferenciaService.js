import api from './api'

export const derivacionTransferenciaService = {
  list: async (params = {}) => {
    const response = await api.get('/derivaciones-transferencias', { params })
    return response.data
  },

  getByContacto: async (contactoId) => {
    const response = await api.get(`/derivaciones-transferencias/contacto/${contactoId}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/derivaciones-transferencias/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/derivaciones-transferencias', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/derivaciones-transferencias/${id}`, data)
    return response.data
  },

  aceptar: async (id, data) => {
    const response = await api.put(`/derivaciones-transferencias/${id}/aceptar`, data)
    return response.data
  },

  rechazar: async (id, data) => {
    const response = await api.put(`/derivaciones-transferencias/${id}/rechazar`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/derivaciones-transferencias/${id}`)
    return response.data
  },
}
