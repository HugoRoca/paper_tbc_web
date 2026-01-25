import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tptIndicacionService } from '../services/tptIndicacionService'
import { esquemaTptService } from '../services/esquemaTptService'
import { contactoService } from '../services/contactoService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const TptIndicacionEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: indicacionData, isLoading, error } = useQuery({
    queryKey: ['tpt-indicacion', id],
    queryFn: () => tptIndicacionService.getById(id),
  })

  const [formData, setFormData] = useState({
    contacto_id: '',
    esquema_tpt_id: '',
    fecha_indicacion: '',
    fecha_inicio: '',
    fecha_fin_prevista: '',
    estado: '',
    motivo_indicacion: '',
    establecimiento_id: '',
    observaciones: '',
  })

  useEffect(() => {
    if (indicacionData?.data) {
      const indicacion = indicacionData.data
      setFormData({
        contacto_id: indicacion.contacto_id?.toString() || '',
        esquema_tpt_id: indicacion.esquema_tpt_id?.toString() || '',
        fecha_indicacion: indicacion.fecha_indicacion || '',
        fecha_inicio: indicacion.fecha_inicio || '',
        fecha_fin_prevista: indicacion.fecha_fin_prevista || '',
        estado: indicacion.estado || '',
        motivo_indicacion: indicacion.motivo_indicacion || '',
        establecimiento_id: indicacion.establecimiento_id?.toString() || '',
        observaciones: indicacion.observaciones || '',
      })
    }
  }, [indicacionData])

  const { data: contactosData } = useQuery({
    queryKey: ['contactos', 'all'],
    queryFn: () => contactoService.list({ limit: 1000, page: 1 }),
  })

  const { data: esquemasData } = useQuery({
    queryKey: ['esquemas-tpt', 'all'],
    queryFn: () => esquemaTptService.list({ limit: 1000, page: 1 }),
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => tptIndicacionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tpt-indicacion', id] })
      queryClient.invalidateQueries({ queryKey: ['tpt-indicaciones'] })
      queryClient.invalidateQueries({
        queryKey: ['tpt-indicaciones', 'contacto', formData.contacto_id],
      })
      toast.success('Indicación actualizada correctamente')
      navigate(`/tpt-indicaciones/${id}`)
    },
    onError: (updateError) => {
      toast.error(updateError.response?.data?.message || 'Error al actualizar la indicación')
      if (updateError.response?.data?.errors) {
        setErrors(updateError.response.data.errors)
      }
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
    if (!formData.contacto_id) newErrors.contacto_id = 'El contacto es requerido'
    if (!formData.esquema_tpt_id) newErrors.esquema_tpt_id = 'El esquema TPT es requerido'
    if (!formData.fecha_indicacion) newErrors.fecha_indicacion = 'La fecha de indicación es requerida'
    if (!formData.establecimiento_id) {
      newErrors.establecimiento_id = 'El establecimiento es requerido'
    }

    if (formData.fecha_indicacion) {
      const fechaIndicacion = parseLocalDate(formData.fecha_indicacion)
      if (!fechaIndicacion) newErrors.fecha_indicacion = 'La fecha de indicación es inválida'
    }

    if (formData.fecha_inicio) {
      const fechaInicio = parseLocalDate(formData.fecha_inicio)
      if (!fechaInicio) newErrors.fecha_inicio = 'La fecha de inicio es inválida'
    }

    if (formData.fecha_fin_prevista) {
      const fechaFin = parseLocalDate(formData.fecha_fin_prevista)
      if (!fechaFin) newErrors.fecha_fin_prevista = 'La fecha fin prevista es inválida'
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
      contacto_id: parseInt(formData.contacto_id, 10),
      esquema_tpt_id: parseInt(formData.esquema_tpt_id, 10),
      fecha_indicacion: formData.fecha_indicacion,
      establecimiento_id: parseInt(formData.establecimiento_id, 10),
    }

    if (formData.fecha_inicio) dataToSend.fecha_inicio = formData.fecha_inicio
    else dataToSend.fecha_inicio = null

    if (formData.fecha_fin_prevista) dataToSend.fecha_fin_prevista = formData.fecha_fin_prevista
    else dataToSend.fecha_fin_prevista = null

    if (formData.estado) dataToSend.estado = formData.estado
    if (formData.motivo_indicacion.trim()) {
      dataToSend.motivo_indicacion = formData.motivo_indicacion.trim()
    }
    if (formData.observaciones.trim()) {
      dataToSend.observaciones = formData.observaciones.trim()
    }

    if (isNaN(dataToSend.contacto_id)) {
      setErrors({ contacto_id: 'El contacto es requerido' })
      toast.error('Selecciona un contacto válido')
      return
    }

    if (isNaN(dataToSend.esquema_tpt_id)) {
      setErrors({ esquema_tpt_id: 'El esquema TPT es requerido' })
      toast.error('Selecciona un esquema válido')
      return
    }

    if (isNaN(dataToSend.establecimiento_id)) {
      setErrors({ establecimiento_id: 'El establecimiento es requerido' })
      toast.error('Selecciona un establecimiento válido')
      return
    }

    updateMutation.mutate(dataToSend)
  }

  const contactos = contactosData?.data || []
  const contactoOptions = contactos.map((contacto) => ({
    value: contacto.id,
    label: `${contacto.nombres} ${contacto.apellidos}${contacto.dni ? ` - ${contacto.dni}` : ''}`,
  }))

  const esquemas = esquemasData?.data || []
  const esquemaOptions = esquemas.map((esquema) => ({
    value: esquema.id,
    label: `${esquema.codigo} - ${esquema.nombre}`,
  }))

  const estados = ['Indicado', 'En curso', 'Completado', 'Suspenso', 'Abandonado']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando indicación...</p>
        </div>
      </div>
    )
  }

  if (error || !indicacionData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Indicación no encontrada'}
          </p>
          <Link
            to="/tpt-indicaciones"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/tpt-indicaciones/${id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Indicación TPT</h2>
            <p className="text-gray-600 mt-1">Actualizar información de la indicación</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Indicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacto <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={contactoOptions}
                  value={formData.contacto_id}
                  onChange={(value) => handleChange({ target: { name: 'contacto_id', value } })}
                  placeholder="Buscar contacto..."
                  error={!!errors.contacto_id}
                />
                {errors.contacto_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.contacto_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Esquema TPT <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={esquemaOptions}
                  value={formData.esquema_tpt_id}
                  onChange={(value) => handleChange({ target: { name: 'esquema_tpt_id', value } })}
                  placeholder="Buscar esquema..."
                  error={!!errors.esquema_tpt_id}
                />
                {errors.esquema_tpt_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.esquema_tpt_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Indicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_indicacion"
                  value={formData.fecha_indicacion}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_indicacion ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_indicacion && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_indicacion}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_inicio ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_inicio && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_inicio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin Prevista</label>
                <input
                  type="date"
                  name="fecha_fin_prevista"
                  value={formData.fecha_fin_prevista || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_fin_prevista ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_fin_prevista && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_fin_prevista}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar estado</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de Indicación
                </label>
                <textarea
                  name="motivo_indicacion"
                  rows="3"
                  value={formData.motivo_indicacion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea
                  name="observaciones"
                  rows="3"
                  value={formData.observaciones}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to={`/tpt-indicaciones/${id}`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TptIndicacionEditar
