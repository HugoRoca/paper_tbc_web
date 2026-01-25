import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { derivacionTransferenciaService } from '../services/derivacionTransferenciaService'
import { contactoService } from '../services/contactoService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import SearchableSelect from '../components/SearchableSelect'
import { toInputDate } from '../utils/date'

const DerivacionTransferenciaEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: derivacionData, isLoading, error } = useQuery({
    queryKey: ['derivacion-transferencia', id],
    queryFn: () => derivacionTransferenciaService.getById(id),
  })

  const [formData, setFormData] = useState({
    tipo: '',
    contacto_id: '',
    establecimiento_origen_id: '',
    establecimiento_destino_id: '',
    motivo: '',
    observaciones: '',
    fecha_solicitud: '',
    estado: '',
    fecha_aceptacion: '',
  })

  useEffect(() => {
    if (derivacionData?.data) {
      const derivacion = derivacionData.data
      setFormData({
        tipo: derivacion.tipo || '',
        contacto_id: derivacion.contacto_id?.toString() || '',
        establecimiento_origen_id: derivacion.establecimiento_origen_id?.toString() || '',
        establecimiento_destino_id: derivacion.establecimiento_destino_id?.toString() || '',
        motivo: derivacion.motivo || '',
        observaciones: derivacion.observaciones || '',
        fecha_solicitud: derivacion.fecha_solicitud || '',
        estado: derivacion.estado || '',
        fecha_aceptacion: derivacion.fecha_aceptacion || '',
      })
    }
  }, [derivacionData])

  const { data: contactosData } = useQuery({
    queryKey: ['contactos', 'all'],
    queryFn: () => contactoService.list({ limit: 1000, page: 1 }),
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => derivacionTransferenciaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['derivacion-transferencia', id] })
      queryClient.invalidateQueries({ queryKey: ['derivaciones-transferencias'] })
      toast.success('Derivación actualizada correctamente')
      navigate(`/derivaciones-transferencias/${id}`)
    },
    onError: (updateError) => {
      toast.error(updateError.response?.data?.message || 'Error al actualizar la derivación')
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
    if (!formData.tipo) newErrors.tipo = 'El tipo es requerido'
    if (!formData.establecimiento_origen_id) {
      newErrors.establecimiento_origen_id = 'El establecimiento de origen es requerido'
    }
    if (!formData.establecimiento_destino_id) {
      newErrors.establecimiento_destino_id = 'El establecimiento de destino es requerido'
    }
    if (!formData.motivo.trim()) newErrors.motivo = 'El motivo es requerido'
    if (!formData.fecha_solicitud) newErrors.fecha_solicitud = 'La fecha es requerida'

    if (
      formData.establecimiento_origen_id &&
      formData.establecimiento_destino_id &&
      formData.establecimiento_origen_id === formData.establecimiento_destino_id
    ) {
      newErrors.establecimiento_destino_id = 'El establecimiento destino debe ser diferente'
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
      tipo: formData.tipo,
      contacto_id: parseInt(formData.contacto_id, 10),
      establecimiento_origen_id: parseInt(formData.establecimiento_origen_id, 10),
      establecimiento_destino_id: parseInt(formData.establecimiento_destino_id, 10),
      motivo: formData.motivo.trim(),
      fecha_solicitud: formData.fecha_solicitud,
      estado: formData.estado,
    }

    if (formData.observaciones.trim()) dataToSend.observaciones = formData.observaciones.trim()
    else dataToSend.observaciones = null

    if (formData.fecha_aceptacion) dataToSend.fecha_aceptacion = formData.fecha_aceptacion
    else dataToSend.fecha_aceptacion = null

    updateMutation.mutate(dataToSend)
  }

  const contactos = contactosData?.data || []
  const contactoOptions = contactos.map((contacto) => ({
    value: contacto.id,
    label: `${contacto.nombres} ${contacto.apellidos}${contacto.dni ? ` - ${contacto.dni}` : ''}`,
  }))

  const tipos = ['Derivación', 'Transferencia']
  const estados = ['Pendiente', 'Aceptada', 'Rechazada', 'Completada']
  const today = toInputDate(new Date())

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando derivación...</p>
        </div>
      </div>
    )
  }

  if (error || !derivacionData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Derivación no encontrada'}
          </p>
          <Link
            to="/derivaciones-transferencias"
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
            to={`/derivaciones-transferencias/${id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Derivación/Transferencia</h2>
            <p className="text-gray-600 mt-1">Actualizar información</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Derivación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tipo ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>}
              </div>

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
                  Establecimiento Origen <span className="text-red-500">*</span>
                </label>
                <select
                  name="establecimiento_origen_id"
                  value={formData.establecimiento_origen_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.establecimiento_origen_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar establecimiento</option>
                  {establecimientosData?.data?.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre}
                    </option>
                  ))}
                </select>
                {errors.establecimiento_origen_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.establecimiento_origen_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Establecimiento Destino <span className="text-red-500">*</span>
                </label>
                <select
                  name="establecimiento_destino_id"
                  value={formData.establecimiento_destino_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.establecimiento_destino_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar establecimiento</option>
                  {establecimientosData?.data?.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre}
                    </option>
                  ))}
                </select>
                {errors.establecimiento_destino_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.establecimiento_destino_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Solicitud <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_solicitud"
                  value={formData.fecha_solicitud}
                  onChange={handleChange}
                  max={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_solicitud ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_solicitud && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_solicitud}</p>
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

              {(formData.estado === 'Aceptada' || formData.estado === 'Rechazada') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Aceptación/Rechazo
                  </label>
                  <input
                    type="date"
                    name="fecha_aceptacion"
                    value={formData.fecha_aceptacion || ''}
                    onChange={handleChange}
                    max={today}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="motivo"
                  rows="3"
                  value={formData.motivo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.motivo ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.motivo && <p className="mt-1 text-sm text-red-600">{errors.motivo}</p>}
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
              to={`/derivaciones-transferencias/${id}`}
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

export default DerivacionTransferenciaEditar
