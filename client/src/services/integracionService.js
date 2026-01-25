import api from './api'

export const integracionService = {
  consultarSIGTB: async (data) => {
    const response = await api.post('/integraciones/sigtb/consultar', data)
    return response.data
  },

  consultarNETLAB: async (data) => {
    const response = await api.post('/integraciones/netlab/consultar', data)
    return response.data
  },
}
