import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reaccionAdversaService } from '../services/reaccionAdversaService'
import { tptIndicacionService } from '../services/tptIndicacionService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const ReaccionAdversaEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: reaccionData, isLoading, error } = useQuery({
    queryKey: ['reaccion-adversa', id],
    queryFn: () => reaccionAdversaService.getById(id),
  })

  const [formData, setFormData] = useState({
    tpt_indicacion_id: '',
    fecha_reaccion: '',
    tipo_reaccion: '',
    severidad: '',
    sintomas: '',
    accion_tomada: '',
    medicamento_sospechoso: '',
    resultado: '',
    establecimiento_id: '',
    observaciones: '',
  })

  useEffect(() => {
    if (reaccionData?.data) {
      const reaccion = reaccionData.data
      setFormData({
        tpt_indicacion_id: reaccion.tpt_indicacion_id?.toString() || '',
        fecha_reaccion: reaccion.fecha_reaccion || '',
        tipo_reaccion: reaccion.tipo_reaccion || '',
        severidad: reaccion.severidad || '',
        sintomas: reaccion.sintomas || '',
        accion_tomada: reaccion.accion_tomada || '',
        medicamento_sospechoso: reaccion.medicamento_sospechoso || '',
        resultado: reaccion.resultado || '',
        establecimiento_id: reaccion.establecimiento_id?.toString() || '',
        observaciones: reaccion.observaciones || '',
      })
    }
  }, [reaccionData])

  const { data: indicacionesData } = useQuery({
    queryKey: ['tpt-indicaciones', 'all'],
    queryFn: () => tptIndicacionService.list({ limit: 1000, page: 1 }),
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => reaccionAdversaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reaccion-adversa', id] })
      queryClient.invalidateQueries({ queryKey: ['reacciones-adversas'] })
      queryClient.invalidateQueries({
        queryKey: ['reacciones-adversas', 'tpt-indicacion', formData.tpt_indicacion_id],
      })
      toast.success('Reacción actualizada correctamente')
      navigate(`/reacciones-adversas/${id}`)
    },
    onError: (updateError) => {
      toast.error(updateError.response?.data?.message || 'Error al actualizar la reacción')
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
    if (!formData.tpt_indicacion_id) newErrors.tpt_indicacion_id = 'La indicación es requerida'
    if (!formData.fecha_reaccion) newErrors.fecha_reaccion = 'La fecha de reacción es requerida'
    if (!formData.tipo_reaccion.trim()) newErrors.tipo_reaccion = 'El tipo de reacción es requerido'
    if (!formData.severidad) newErrors.severidad = 'La severidad es requerida'
    if (!formData.sintomas.trim()) newErrors.sintomas = 'Los síntomas son requeridos'
    if (!formData.establecimiento_id) {
      newErrors.establecimiento_id = 'El establecimiento es requerido'
    }

    if (formData.fecha_reaccion) {
      const fechaReaccion = parseLocalDate(formData.fecha_reaccion)
      if (!fechaReaccion) newErrors.fecha_reaccion = 'La fecha de reacción es inválida'
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
      fecha_reaccion: formData.fecha_reaccion,
      tipo_reaccion: formData.tipo_reaccion.trim(),
      severidad: formData.severidad,
      sintomas: formData.sintomas.trim(),
      establecimiento_id: parseInt(formData.establecimiento_id, 10),
      resultado: formData.resultado,
    }

    if (formData.accion_tomada.trim()) dataToSend.accion_tomada = formData.accion_tomada.trim()
    if (formData.medicamento_sospechoso.trim()) {
      dataToSend.medicamento_sospechoso = formData.medicamento_sospechoso.trim()
    }
    if (formData.observaciones.trim()) dataToSend.observaciones = formData.observaciones.trim()

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

    updateMutation.mutate(dataToSend)
  }

  const indicaciones = indicacionesData?.data || []
  const indicacionOptions = indicaciones.map((indicacion) => ({
    value: indicacion.id,
    label: `#${indicacion.id} - ${indicacion.contacto?.nombres || ''} ${
      indicacion.contacto?.apellidos || ''
    }`,
  }))

  const severidades = ['Leve', 'Moderada', 'Severa', 'Grave']
  const resultados = ['En seguimiento', 'Resuelto', 'Pendiente']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reacción adversa...</p>
        </div>
      </div>
    )
  }

  if (error || !reaccionData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Reacción adversa no encontrada'}
          </p>
          <Link
            to="/reacciones-adversas"
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
            to={`/reacciones-adversas/${id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Reacción Adversa</h2>
            <p className="text-gray-600 mt-1">Actualizar información del evento adverso</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Reacción</h3>
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
                  Fecha de Reacción <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_reaccion"
                  value={formData.fecha_reaccion}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_reaccion ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_reaccion && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_reaccion}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Reacción <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tipo_reaccion"
                  value={formData.tipo_reaccion}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tipo_reaccion ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.tipo_reaccion && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo_reaccion}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severidad <span className="text-red-500">*</span>
                </label>
                <select
                  name="severidad"
                  value={formData.severidad}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.severidad ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar severidad</option>
                  {severidades.map((severidad) => (
                    <option key={severidad} value={severidad}>
                      {severidad}
                    </option>
                  ))}
                </select>
                {errors.severidad && (
                  <p className="mt-1 text-sm text-red-600">{errors.severidad}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Síntomas <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="sintomas"
                  rows="3"
                  value={formData.sintomas}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.sintomas ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.sintomas && <p className="mt-1 text-sm text-red-600">{errors.sintomas}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Acción Tomada</label>
                <textarea
                  name="accion_tomada"
                  rows="3"
                  value={formData.accion_tomada}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicamento Sospechoso
                </label>
                <input
                  type="text"
                  name="medicamento_sospechoso"
                  value={formData.medicamento_sospechoso}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
                <select
                  name="resultado"
                  value={formData.resultado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar resultado</option>
                  {resultados.map((resultado) => (
                    <option key={resultado} value={resultado}>
                      {resultado}
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
              to={`/reacciones-adversas/${id}`}
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

export default ReaccionAdversaEditar
