import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tptConsentimientoService } from '../services/tptConsentimientoService'
import { tptIndicacionService } from '../services/tptIndicacionService'
import { ArrowLeft, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate, toInputDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const TptConsentimientoNuevo = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    tpt_indicacion_id: '',
    fecha_consentimiento: '',
    consentimiento_firmado: false,
    ruta_archivo_consentimiento: '',
    observaciones: '',
  })

  useEffect(() => {
    const tptIndicacionId = searchParams.get('tpt_indicacion_id')
    if (tptIndicacionId) {
      setFormData((prev) => ({ ...prev, tpt_indicacion_id: tptIndicacionId }))
    }
  }, [searchParams])

  const { data: indicacionesData } = useQuery({
    queryKey: ['tpt-indicaciones', 'all'],
    queryFn: () => tptIndicacionService.list({ limit: 1000, page: 1 }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => tptConsentimientoService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tpt-consentimientos'] })
      if (response?.data?.tpt_indicacion_id) {
        queryClient.invalidateQueries({
          queryKey: ['tpt-consentimientos', 'tpt-indicacion', response.data.tpt_indicacion_id],
        })
      }
      toast.success('Consentimiento creado correctamente')
      navigate(`/tpt-consentimientos/${response.data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear el consentimiento')
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    },
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.tpt_indicacion_id) {
      newErrors.tpt_indicacion_id = 'La indicación TPT es requerida'
    }
    if (!formData.fecha_consentimiento) {
      newErrors.fecha_consentimiento = 'La fecha de consentimiento es requerida'
    }

    if (formData.fecha_consentimiento) {
      const fechaConsentimiento = parseLocalDate(formData.fecha_consentimiento)
      const hoy = new Date()
      if (fechaConsentimiento > hoy) {
        newErrors.fecha_consentimiento = 'La fecha de consentimiento no puede ser futura'
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

    const dataToSend = {
      tpt_indicacion_id: parseInt(formData.tpt_indicacion_id),
      fecha_consentimiento: formData.fecha_consentimiento,
      consentimiento_firmado: formData.consentimiento_firmado,
      observaciones: formData.observaciones || null,
    }

    if (formData.ruta_archivo_consentimiento) {
      dataToSend.ruta_archivo_consentimiento = formData.ruta_archivo_consentimiento.trim()
    }

    createMutation.mutate(dataToSend)
  }

  const indicacionesOptions =
    indicacionesData?.data?.map((ind) => ({
      value: ind.id.toString(),
      label: `Indicación #${ind.id} - Contacto: ${ind.contacto?.nombres || ''} ${ind.contacto?.apellidos || ''}`,
    })) || []

  const today = toInputDate(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/tpt-indicaciones" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crear Consentimiento TPT</h2>
          <p className="text-gray-600 mt-1">Registrar consentimiento informado</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indicación TPT <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={indicacionesOptions}
                value={formData.tpt_indicacion_id}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, tpt_indicacion_id: value }))
                  if (errors.tpt_indicacion_id) {
                    setErrors((prev) => ({ ...prev, tpt_indicacion_id: null }))
                  }
                }}
                placeholder="Seleccione una indicación TPT"
                disabled={!!searchParams.get('tpt_indicacion_id')}
              />
              {errors.tpt_indicacion_id && (
                <p className="mt-1 text-sm text-red-600">{errors.tpt_indicacion_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Consentimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_consentimiento"
                value={formData.fecha_consentimiento}
                onChange={handleChange}
                max={today}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fecha_consentimiento ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fecha_consentimiento && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_consentimiento}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="consentimiento_firmado"
                  checked={formData.consentimiento_firmado}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Consentimiento firmado</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta del archivo de consentimiento (opcional)
              </label>
              <input
                type="text"
                name="ruta_archivo_consentimiento"
                value={formData.ruta_archivo_consentimiento}
                onChange={handleChange}
                placeholder="Ej: /uploads/consentimientos/consentimiento_123.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observaciones adicionales sobre el consentimiento..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to="/tpt-indicaciones"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {createMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TptConsentimientoNuevo
