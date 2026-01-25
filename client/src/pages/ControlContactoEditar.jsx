import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { controlContactoService } from '../services/controlContactoService'
import { contactoService } from '../services/contactoService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const ControlContactoEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: controlData, isLoading, error } = useQuery({
    queryKey: ['control-contacto', id],
    queryFn: () => controlContactoService.getById(id),
  })

  const [formData, setFormData] = useState({
    contacto_id: '',
    numero_control: '',
    fecha_programada: '',
    fecha_realizada: '',
    tipo_control: '',
    resultado: '',
    estado: '',
    establecimiento_id: '',
    observaciones: '',
  })

  useEffect(() => {
    if (controlData?.data) {
      const control = controlData.data
      setFormData({
        contacto_id: control.contacto_id?.toString() || '',
        numero_control: control.numero_control?.toString() || '',
        fecha_programada: control.fecha_programada || '',
        fecha_realizada: control.fecha_realizada || '',
        tipo_control: control.tipo_control || '',
        resultado: control.resultado || '',
        estado: control.estado || '',
        establecimiento_id: control.establecimiento_id?.toString() || '',
        observaciones: control.observaciones || '',
      })
    }
  }, [controlData])

  const { data: contactosData } = useQuery({
    queryKey: ['contactos', 'all'],
    queryFn: () => contactoService.list({ limit: 1000, page: 1 }),
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => controlContactoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['control-contacto', id] })
      queryClient.invalidateQueries({ queryKey: ['controles-contacto'] })
      queryClient.invalidateQueries({
        queryKey: ['controles-contacto', 'contacto', formData.contacto_id],
      })
      toast.success('Control actualizado correctamente')
      navigate(`/controles-contacto/${id}`)
    },
    onError: (updateError) => {
      toast.error(updateError.response?.data?.message || 'Error al actualizar el control')
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
    if (!formData.fecha_programada) newErrors.fecha_programada = 'La fecha programada es requerida'
    if (!formData.tipo_control) newErrors.tipo_control = 'El tipo de control es requerido'
    if (!formData.establecimiento_id) {
      newErrors.establecimiento_id = 'El establecimiento es requerido'
    }

    if (formData.numero_control && Number(formData.numero_control) <= 0) {
      newErrors.numero_control = 'El número de control debe ser válido'
    }

    if (formData.fecha_programada) {
      const fechaProgramada = parseLocalDate(formData.fecha_programada)
      if (!fechaProgramada) {
        newErrors.fecha_programada = 'La fecha programada es inválida'
      }
    }

    if (formData.fecha_realizada) {
      const fechaRealizada = parseLocalDate(formData.fecha_realizada)
      if (!fechaRealizada) {
        newErrors.fecha_realizada = 'La fecha realizada es inválida'
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
      contacto_id: parseInt(formData.contacto_id, 10),
      fecha_programada: formData.fecha_programada,
      tipo_control: formData.tipo_control,
      establecimiento_id: parseInt(formData.establecimiento_id, 10),
    }

    if (formData.numero_control) {
      dataToSend.numero_control = parseInt(formData.numero_control, 10)
    }

    if (formData.fecha_realizada) {
      dataToSend.fecha_realizada = formData.fecha_realizada
    } else {
      dataToSend.fecha_realizada = null
    }

    if (formData.resultado.trim()) dataToSend.resultado = formData.resultado.trim()
    if (formData.estado) dataToSend.estado = formData.estado
    if (formData.observaciones.trim()) dataToSend.observaciones = formData.observaciones.trim()

    if (isNaN(dataToSend.contacto_id)) {
      setErrors({ contacto_id: 'El contacto es requerido' })
      toast.error('Selecciona un contacto válido')
      return
    }

    if (isNaN(dataToSend.establecimiento_id)) {
      setErrors({ establecimiento_id: 'El establecimiento es requerido' })
      toast.error('Selecciona un establecimiento válido')
      return
    }

    updateMutation.mutate(dataToSend)
  }

  const tiposControl = ['Clínico', 'Radiológico', 'Bacteriológico', 'Integral']
  const estados = ['Programado', 'Realizado', 'No realizado', 'Cancelado']
  const contactos = contactosData?.data || []
  const contactoOptions = contactos.map((contacto) => ({
    value: contacto.id,
    label: `${contacto.nombres} ${contacto.apellidos}${contacto.dni ? ` - ${contacto.dni}` : ''}`,
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando control...</p>
        </div>
      </div>
    )
  }

  if (error || !controlData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Control no encontrado'}
          </p>
          <Link
            to="/controles-contacto"
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
            to={`/controles-contacto/${id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Control</h2>
            <p className="text-gray-600 mt-1">Actualizar información del control</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Control</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de Control</label>
                <input
                  type="number"
                  name="numero_control"
                  value={formData.numero_control}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.numero_control ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.numero_control && (
                  <p className="mt-1 text-sm text-red-600">{errors.numero_control}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Programada <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_programada"
                  value={formData.fecha_programada}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_programada ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_programada && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_programada}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Realizada
                </label>
                <input
                  type="date"
                  name="fecha_realizada"
                  value={formData.fecha_realizada || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_realizada ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_realizada && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_realizada}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Control <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipo_control"
                  value={formData.tipo_control}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tipo_control ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposControl.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipo_control && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo_control}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
                <textarea
                  name="resultado"
                  rows="3"
                  value={formData.resultado}
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
              to={`/controles-contacto/${id}`}
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

export default ControlContactoEditar
