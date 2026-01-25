import api from './api'

export const examenContactoService = {
  list: async (params = {}) => {
    const response = await api.get('/examenes-contacto', { params })
    return response.data
  },

  getByContacto: async (contactoId) => {
    const response = await api.get(`/examenes-contacto/contacto/${contactoId}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/examenes-contacto/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/examenes-contacto', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/examenes-contacto/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/examenes-contacto/${id}`)
    return response.data
  },
}
