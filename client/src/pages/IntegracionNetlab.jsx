import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { integracionService } from '../services/integracionService'
import { ArrowLeft, X, Search, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { toInputDate } from '../utils/date'

const IntegracionNetlab = () => {
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const [formData, setFormData] = useState({
    codigo_muestra: '',
    dni: '',
    fecha_desde: '',
    fecha_hasta: '',
  })

  const mutation = useMutation({
    mutationFn: (data) => integracionService.consultarNETLAB(data),
    onSuccess: (response) => {
      setResult(response.data)
      queryClient.invalidateQueries({ queryKey: ['integraciones-log'] })
      toast.success(response.message || 'Consulta realizada correctamente')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al consultar NETLAB')
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.codigo_muestra && !formData.dni) {
      newErrors.codigo_muestra = 'Ingrese código de muestra o DNI'
      newErrors.dni = 'Ingrese código de muestra o DNI'
    }
    if (formData.fecha_desde && formData.fecha_hasta) {
      if (formData.fecha_desde > formData.fecha_hasta) {
        newErrors.fecha_hasta = 'La fecha hasta debe ser mayor o igual'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Por favor, corrige los errores en el formulario')
      return
    }

    const dataToSend = {}
    if (formData.codigo_muestra) dataToSend.codigo_muestra = formData.codigo_muestra.trim()
    if (formData.dni) dataToSend.dni = formData.dni.trim()
    if (formData.fecha_desde) dataToSend.fecha_desde = formData.fecha_desde
    if (formData.fecha_hasta) dataToSend.fecha_hasta = formData.fecha_hasta

    mutation.mutate(dataToSend)
  }

  const renderJson = (value) => {
    if (!value) return '-'
    return (
      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  const today = toInputDate(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/integraciones-log" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultar NETLAB</h2>
          <p className="text-gray-600 mt-1">Búsqueda en sistema externo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código de Muestra</label>
              <input
                type="text"
                name="codigo_muestra"
                value={formData.codigo_muestra}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.codigo_muestra ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.codigo_muestra && (
                <p className="mt-1 text-sm text-red-600">{errors.codigo_muestra}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dni ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dni && <p className="mt-1 text-sm text-red-600">{errors.dni}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha desde</label>
              <input
                type="date"
                name="fecha_desde"
                value={formData.fecha_desde}
                onChange={handleChange}
                max={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha hasta</label>
              <input
                type="date"
                name="fecha_hasta"
                value={formData.fecha_hasta}
                onChange={handleChange}
                max={today}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fecha_hasta ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fecha_hasta && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_hasta}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to="/integraciones-log"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              Consultar
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Resultado
          </h3>
          {renderJson(result)}
        </div>
      )}
    </div>
  )
}

export default IntegracionNetlab
