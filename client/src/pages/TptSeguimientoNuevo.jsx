import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tptSeguimientoService } from '../services/tptSeguimientoService'
import { tptIndicacionService } from '../services/tptIndicacionService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate, toInputDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const TptSeguimientoNuevo = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    tpt_indicacion_id: '',
    fecha_seguimiento: '',
    dosis_administrada: false,
    observaciones_administracion: '',
    efectos_adversos: false,
    establecimiento_id: '',
  })

  useEffect(() => {
    const indicacionId = searchParams.get('tpt_indicacion_id')
    if (indicacionId) {
      setFormData((prev) => ({ ...prev, tpt_indicacion_id: indicacionId }))
    }
  }, [searchParams])

  const { data: indicacionesData } = useQuery({
    queryKey: ['tpt-indicaciones', 'all'],
    queryFn: () => tptIndicacionService.list({ limit: 1000, page: 1 }),
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => tptSeguimientoService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tpt-seguimiento'] })
      if (response?.data?.tpt_indicacion_id) {
        queryClient.invalidateQueries({
          queryKey: ['tpt-seguimiento', 'tpt-indicacion', response.data.tpt_indicacion_id],
        })
      }
      toast.success('Seguimiento creado correctamente')
      navigate(`/tpt-seguimiento/${response.data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear el seguimiento')
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    },
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.tpt_indicacion_id) newErrors.tpt_indicacion_id = 'La indicación es requerida'
    if (!formData.fecha_seguimiento) {
      newErrors.fecha_seguimiento = 'La fecha de seguimiento es requerida'
    }
    if (!formData.establecimiento_id) {
      newErrors.establecimiento_id = 'El establecimiento es requerido'
    }

    if (formData.fecha_seguimiento) {
      const fechaSeguimiento = parseLocalDate(formData.fecha_seguimiento)
      const hoy = new Date()
      if (fechaSeguimiento > hoy) {
        newErrors.fecha_seguimiento = 'La fecha de seguimiento no puede ser futura'
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
      tpt_indicacion_id: parseInt(formData.tpt_indicacion_id, 10),
      fecha_seguimiento: formData.fecha_seguimiento,
      dosis_administrada: !!formData.dosis_administrada,
      efectos_adversos: !!formData.efectos_adversos,
      establecimiento_id: parseInt(formData.establecimiento_id, 10),
    }

    const observacionesTrimmed = formData.observaciones_administracion.trim()
    if (observacionesTrimmed) dataToSend.observaciones_administracion = observacionesTrimmed

    if (isNaN(dataToSend.tpt_indicacion_id)) {
      setErrors({ tpt_indicacion_id: 'La indicación es requerida' })
      toast.error('Selecciona una indicación válida')
      return
    }

    if (isNaN(dataToSend.establecimiento_id)) {
      setErrors({ establecimiento_id: 'El establecimiento es requerido' })
      toast.error('Selecciona un establecimiento válido')
      return
    }

    createMutation.mutate(dataToSend)
  }

  const indicaciones = indicacionesData?.data || []
  const indicacionOptions = indicaciones.map((indicacion) => ({
    value: indicacion.id,
    label: `#${indicacion.id} - ${indicacion.contacto?.nombres || ''} ${
      indicacion.contacto?.apellidos || ''
    }`,
  }))

  const today = toInputDate(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/tpt-seguimiento"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nuevo Seguimiento TPT</h2>
            <p className="text-gray-600 mt-1">Registrar seguimiento de dosis</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Seguimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indicación TPT <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={indicacionOptions}
                  value={formData.tpt_indicacion_id}
                  onChange={(value) => handleChange({ target: { name: 'tpt_indicacion_id', value } })}
                  placeholder="Buscar indicación..."
                  error={!!errors.tpt_indicacion_id}
                />
                {errors.tpt_indicacion_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.tpt_indicacion_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Seguimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_seguimiento"
                  value={formData.fecha_seguimiento}
                  onChange={handleChange}
                  max={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_seguimiento ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_seguimiento && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_seguimiento}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="dosis_administrada"
                  checked={formData.dosis_administrada}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Dosis Administrada</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="efectos_adversos"
                  checked={formData.efectos_adversos}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Efectos Adversos</label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones de Administración
                </label>
                <textarea
                  name="observaciones_administracion"
                  rows="3"
                  value={formData.observaciones_administracion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Establecimiento <span className="text-red-500">*</span>
                </label>
                <select
                  name="establecimiento_id"
                  value={formData.establecimiento_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.establecimiento_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar establecimiento</option>
                  {establecimientosData?.data?.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre}
                    </option>
                  ))}
                </select>
                {errors.establecimiento_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.establecimiento_id}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to="/tpt-seguimiento"
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
              Guardar Seguimiento
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TptSeguimientoNuevo
