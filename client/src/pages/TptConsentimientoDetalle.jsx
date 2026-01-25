import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tptConsentimientoService } from '../services/tptConsentimientoService'
import { tptIndicacionService } from '../services/tptIndicacionService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  User,
  AlertCircle,
  Save,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal, parseLocalDate, toInputDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const TptConsentimientoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})

  const { data, isLoading, error } = useQuery({
    queryKey: ['tpt-consentimiento', id],
    queryFn: () => tptConsentimientoService.getById(id),
  })

  const { data: indicacionesData } = useQuery({
    queryKey: ['tpt-indicaciones', 'all'],
    queryFn: () => tptIndicacionService.list({ limit: 1000, page: 1 }),
  })

  const [formData, setFormData] = useState({
    tpt_indicacion_id: '',
    fecha_consentimiento: '',
    consentimiento_firmado: false,
    ruta_archivo_consentimiento: '',
    observaciones: '',
  })

  const consentimiento = data?.data

  // Inicializar formData cuando se carga el consentimiento
  useEffect(() => {
    if (consentimiento && !isEditing) {
      setFormData({
        tpt_indicacion_id: consentimiento.tpt_indicacion_id?.toString() || '',
        fecha_consentimiento: consentimiento.fecha_consentimiento || '',
        consentimiento_firmado: consentimiento.consentimiento_firmado || false,
        ruta_archivo_consentimiento: consentimiento.ruta_archivo_consentimiento || '',
        observaciones: consentimiento.observaciones || '',
      })
    }
  }, [consentimiento, isEditing])

  const updateMutation = useMutation({
    mutationFn: (data) => tptConsentimientoService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tpt-consentimiento', id] })
      queryClient.invalidateQueries({ queryKey: ['tpt-consentimientos'] })
      if (response?.data?.tpt_indicacion_id) {
        queryClient.invalidateQueries({
          queryKey: ['tpt-consentimientos', 'tpt-indicacion', response.data.tpt_indicacion_id],
        })
      }
      toast.success('Consentimiento actualizado correctamente')
      setIsEditing(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el consentimiento')
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => tptConsentimientoService.delete(id),
    onSuccess: () => {
      toast.success('Consentimiento eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['tpt-consentimientos'] })
      navigate('/tpt-indicaciones')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar el consentimiento')
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

    updateMutation.mutate(dataToSend)
  }

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este consentimiento?')) {
      deleteMutation.mutate()
    }
  }

  const indicacionesOptions =
    indicacionesData?.data?.map((ind) => ({
      value: ind.id.toString(),
      label: `Indicación #${ind.id} - Contacto: ${ind.contacto?.nombres || ''} ${ind.contacto?.apellidos || ''}`,
    })) || []

  const today = toInputDate(new Date())

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando consentimiento...</p>
        </div>
      </div>
    )
  }

  if (error || !consentimiento) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Consentimiento no encontrado'}
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
            to="/tpt-indicaciones"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Consentimiento TPT' : 'Detalle de Consentimiento TPT'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditing
                ? 'Modificar información del consentimiento'
                : `Fecha: ${formatDateLocal(consentimiento.fecha_consentimiento)}`}
            </p>
          </div>
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEditing(true)
                setFormData({
                  tpt_indicacion_id: consentimiento.tpt_indicacion_id?.toString() || '',
                  fecha_consentimiento: consentimiento.fecha_consentimiento || '',
                  consentimiento_firmado: consentimiento.consentimiento_firmado || false,
                  ruta_archivo_consentimiento: consentimiento.ruta_archivo_consentimiento || '',
                  observaciones: consentimiento.observaciones || '',
                })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
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
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setErrors({})
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Indicación TPT</h3>
                <p className="text-lg font-semibold text-gray-900">
                  Indicación #{consentimiento.tpt_indicacion_id}
                </p>
                {consentimiento.tpt_indicacion && (
                  <Link
                    to={`/tpt-indicaciones/${consentimiento.tpt_indicacion_id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                  >
                    Ver indicación →
                  </Link>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Consentimiento</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDateLocal(consentimiento.fecha_consentimiento)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    consentimiento.consentimiento_firmado
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {consentimiento.consentimiento_firmado ? 'Firmado' : 'No firmado'}
                </span>
              </div>

              {consentimiento.ruta_archivo_consentimiento && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Archivo</h3>
                  <p className="text-sm text-gray-900 break-all">
                    {consentimiento.ruta_archivo_consentimiento}
                  </p>
                </div>
              )}

              {consentimiento.observaciones && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Observaciones</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{consentimiento.observaciones}</p>
                </div>
              )}

              {consentimiento.usuario_registro && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Registrado por</h3>
                  <p className="text-gray-900">
                    {consentimiento.usuario_registro.nombres} {consentimiento.usuario_registro.apellidos}
                  </p>
                </div>
              )}

              {consentimiento.created_at && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de registro</h3>
                  <p className="text-gray-900">{formatDateLocal(consentimiento.created_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TptConsentimientoDetalle
