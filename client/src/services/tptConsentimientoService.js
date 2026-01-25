import api from './api'

export const tptConsentimientoService = {
  getById: async (id) => {
    const response = await api.get(`/tpt-consentimientos/${id}`)
    return response.data
  },

  getByTptIndicacion: async (tptIndicacionId) => {
    const response = await api.get(`/tpt-consentimientos/tpt-indicacion/${tptIndicacionId}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/tpt-consentimientos', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/tpt-consentimientos/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/tpt-consentimientos/${id}`)
    return response.data
  },
}
