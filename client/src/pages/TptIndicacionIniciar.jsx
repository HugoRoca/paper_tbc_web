import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tptIndicacionService } from '../services/tptIndicacionService'
import { tptConsentimientoService } from '../services/tptConsentimientoService'
import { ArrowLeft, Save, X, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate, toInputDate } from '../utils/date'

const TptIndicacionIniciar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: indicacionData, isLoading, error } = useQuery({
    queryKey: ['tpt-indicacion', id],
    queryFn: () => tptIndicacionService.getById(id),
  })

  const { data: consentimientoData } = useQuery({
    queryKey: ['tpt-consentimiento', 'tpt-indicacion', id],
    queryFn: () => tptConsentimientoService.getByTptIndicacion(id),
    enabled: !!id,
    retry: false,
  })

  const [formData, setFormData] = useState({
    fecha_inicio: '',
    confirmar_consentimiento: false,
    observaciones: '',
  })

  const iniciarMutation = useMutation({
    mutationFn: (data) => tptIndicacionService.iniciar(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tpt-indicacion', id] })
      queryClient.invalidateQueries({ queryKey: ['tpt-indicaciones'] })
      if (response?.data?.contacto_id) {
        queryClient.invalidateQueries({
          queryKey: ['tpt-indicaciones', 'contacto', response.data.contacto_id],
        })
      }
      toast.success('TPT iniciado correctamente')
      navigate(`/tpt-indicaciones/${id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al iniciar el TPT')
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
    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida'
    } else {
      const fechaInicio = parseLocalDate(formData.fecha_inicio)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      if (fechaInicio > hoy) {
        newErrors.fecha_inicio = 'La fecha de inicio no puede ser futura'
      }
    }

    if (!formData.confirmar_consentimiento) {
      newErrors.confirmar_consentimiento = 'Debe confirmar que el consentimiento informado está firmado'
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
      fecha_inicio: formData.fecha_inicio,
    }

    if (formData.observaciones.trim()) {
      dataToSend.observaciones = formData.observaciones.trim()
    }

    iniciarMutation.mutate(dataToSend)
  }

  const indicacion = indicacionData?.data
  const consentimiento = consentimientoData?.data
  const tieneConsentimiento = !!consentimiento
  const consentimientoFirmado = consentimiento?.consentimiento_firmado || false

  const today = toInputDate(new Date())

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

  if (error || !indicacion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Indicación TPT no encontrada'}
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

  if (indicacion.estado !== 'Indicado') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-yellow-800 font-medium mb-2">TPT ya iniciado o completado</p>
          <p className="text-yellow-700 text-sm mb-4">
            El estado actual de esta indicación es: <strong>{indicacion.estado}</strong>
          </p>
          <Link
            to={`/tpt-indicaciones/${id}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al detalle
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={`/tpt-indicaciones/${id}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Iniciar TPT</h2>
          <p className="text-gray-600 mt-1">Iniciar tratamiento preventivo para la indicación</p>
        </div>
      </div>

      {/* Información de la indicación */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Información de la Indicación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Contacto:</span>{' '}
            <span className="text-blue-900">
              {indicacion.contacto?.nombres} {indicacion.contacto?.apellidos}
            </span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Esquema:</span>{' '}
            <span className="text-blue-900">{indicacion.esquemaTpt?.nombre || '-'}</span>
          </div>
        </div>
      </div>

      {/* Estado del consentimiento */}
      {tieneConsentimiento ? (
        <div
          className={`border rounded-lg p-4 ${
            consentimientoFirmado
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {consentimientoFirmado ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            )}
            <div>
              <h3
                className={`text-sm font-semibold mb-1 ${
                  consentimientoFirmado ? 'text-green-900' : 'text-yellow-900'
                }`}
              >
                Consentimiento Informado
              </h3>
              <p
                className={`text-sm ${
                  consentimientoFirmado ? 'text-green-700' : 'text-yellow-700'
                }`}
              >
                {consentimientoFirmado
                  ? 'El consentimiento informado está firmado y registrado.'
                  : 'El consentimiento informado no está firmado. Por favor, asegúrese de obtener el consentimiento antes de iniciar el TPT.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                Consentimiento Informado Requerido
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                No se ha registrado un consentimiento informado para esta indicación.
              </p>
              <Link
                to={`/tpt-consentimientos/nuevo?tpt_indicacion_id=${id}`}
                className="text-sm text-yellow-800 hover:text-yellow-900 font-medium underline"
              >
                Crear consentimiento informado →
              </Link>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                max={today}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fecha_inicio ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fecha_inicio && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_inicio}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="confirmar_consentimiento"
                  checked={formData.confirmar_consentimiento}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Confirmo que el consentimiento informado está firmado{' '}
                    <span className="text-red-500">*</span>
                  </span>
                  {errors.confirmar_consentimiento && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmar_consentimiento}
                    </p>
                  )}
                </div>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observaciones adicionales sobre el inicio del TPT..."
              />
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
              disabled={iniciarMutation.isPending || (!tieneConsentimiento || !consentimientoFirmado)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {iniciarMutation.isPending ? 'Iniciando...' : 'Iniciar TPT'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TptIndicacionIniciar
