import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { casoIndiceService } from '../services/casoIndiceService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate, toInputDate } from '../utils/date'

const CasoIndiceEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  // Consultar caso índice existente
  const { data: casoData, isLoading: casoLoading, error: casoError } = useQuery({
    queryKey: ['caso-indice', id],
    queryFn: () => casoIndiceService.getById(id),
  })

  // Estado del formulario
  const [formData, setFormData] = useState({
    paciente_dni: '',
    paciente_nombres: '',
    paciente_apellidos: '',
    fecha_nacimiento: '',
    sexo: '',
    tipo_tb: '',
    fecha_diagnostico: '',
    establecimiento_id: '',
    observaciones: '',
  })

  // Pre-llenar formulario cuando se carguen los datos
  useEffect(() => {
    if (casoData?.data) {
      const caso = casoData.data
      setFormData({
        paciente_dni: caso.paciente_dni || '',
        paciente_nombres: caso.paciente_nombres || '',
        paciente_apellidos: caso.paciente_apellidos || '',
        fecha_nacimiento: caso.fecha_nacimiento || '',
        sexo: caso.sexo || '',
        tipo_tb: caso.tipo_tb || '',
        fecha_diagnostico: caso.fecha_diagnostico || '',
        establecimiento_id: caso.establecimiento_id?.toString() || '',
        observaciones: caso.observaciones || '',
      })
    }
  }, [casoData])

  // Consultar establecimientos
  const { data: establecimientosData, isLoading: establecimientosLoading } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  // Mutación para actualizar
  const updateMutation = useMutation({
    mutationFn: (data) => casoIndiceService.update(id, data),
    onSuccess: (response) => {
      // Invalidar queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['caso-indice', id] })
      queryClient.invalidateQueries({ queryKey: ['casos-indice'] })
      queryClient.invalidateQueries({ queryKey: ['contactos', 'caso-indice', id] })
      queryClient.invalidateQueries({ queryKey: ['visitas-domiciliarias', 'caso-indice', id] })
      
      toast.success('Caso índice actualizado correctamente')
      navigate(`/casos-indice/${id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el caso índice')
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    },
  })

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  // Validar formulario
  const validate = () => {
    const newErrors = {}

    if (!formData.paciente_nombres.trim()) {
      newErrors.paciente_nombres = 'Los nombres son requeridos'
    }

    if (!formData.paciente_apellidos.trim()) {
      newErrors.paciente_apellidos = 'Los apellidos son requeridos'
    }

    if (!formData.tipo_tb) {
      newErrors.tipo_tb = 'El tipo de TB es requerido'
    }

    if (!formData.fecha_diagnostico) {
      newErrors.fecha_diagnostico = 'La fecha de diagnóstico es requerida'
    } else {
      const fechaDiagnostico = parseLocalDate(formData.fecha_diagnostico)
      const hoy = new Date()
      if (fechaDiagnostico > hoy) {
        newErrors.fecha_diagnostico = 'La fecha de diagnóstico no puede ser futura'
      }
    }

    if (!formData.establecimiento_id) {
      newErrors.establecimiento_id = 'El establecimiento es requerido'
    }

    // Validar fecha de nacimiento si se proporciona
    if (formData.fecha_nacimiento) {
      const fechaNacimiento = parseLocalDate(formData.fecha_nacimiento)
      const hoy = new Date()
      if (fechaNacimiento > hoy) {
        newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura'
      }
      // Validar que la fecha de nacimiento sea anterior a la fecha de diagnóstico
      if (formData.fecha_diagnostico) {
        const fechaDiagnostico = parseLocalDate(formData.fecha_diagnostico)
        if (fechaNacimiento > fechaDiagnostico) {
          newErrors.fecha_nacimiento =
            'La fecha de nacimiento debe ser anterior a la fecha de diagnóstico'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Por favor, corrige los errores en el formulario')
      return
    }

    // Preparar datos para enviar (remover campos vacíos opcionales)
    const dataToSend = {
      paciente_nombres: formData.paciente_nombres.trim(),
      paciente_apellidos: formData.paciente_apellidos.trim(),
      tipo_tb: formData.tipo_tb,
      fecha_diagnostico: formData.fecha_diagnostico,
      establecimiento_id: parseInt(formData.establecimiento_id),
    }

    // Agregar campos opcionales solo si tienen valor
    if (formData.paciente_dni.trim()) {
      dataToSend.paciente_dni = formData.paciente_dni.trim()
    } else {
      dataToSend.paciente_dni = null // Permitir limpiar el DNI
    }
    if (formData.fecha_nacimiento) {
      dataToSend.fecha_nacimiento = formData.fecha_nacimiento
    } else {
      dataToSend.fecha_nacimiento = null // Permitir limpiar la fecha
    }
    if (formData.sexo) {
      dataToSend.sexo = formData.sexo
    } else {
      dataToSend.sexo = null // Permitir limpiar el sexo
    }
    if (formData.observaciones.trim()) {
      dataToSend.observaciones = formData.observaciones.trim()
    } else {
      dataToSend.observaciones = null // Permitir limpiar las observaciones
    }

    updateMutation.mutate(dataToSend)
  }

  const tiposTB = ['Pulmonar', 'Extrapulmonar', 'Miliar', 'Meningea']
  const sexos = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' },
  ]

  // Obtener fecha máxima (hoy) para los inputs de fecha
  const today = toInputDate(new Date())

  if (casoLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando caso índice...</p>
        </div>
      </div>
    )
  }

  if (casoError || !casoData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {casoError?.response?.data?.message || 'Caso índice no encontrado'}
          </p>
          <Link
            to="/casos-indice"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  const caso = casoData.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/casos-indice/${id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Caso Índice</h2>
            <p className="text-gray-600 mt-1">
              Código: <span className="font-medium">{caso.codigo_caso}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Sección: Código de Caso (Solo lectura) */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Caso
            </label>
            <input
              type="text"
              value={caso.codigo_caso}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              El código de caso no puede ser modificado
            </p>
          </div>

          {/* Sección: Datos Personales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DNI */}
              <div>
                <label htmlFor="paciente_dni" className="block text-sm font-medium text-gray-700 mb-2">
                  DNI
                </label>
                <input
                  type="text"
                  id="paciente_dni"
                  name="paciente_dni"
                  value={formData.paciente_dni}
                  onChange={handleChange}
                  maxLength={20}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.paciente_dni ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Opcional
                </p>
                {errors.paciente_dni && (
                  <p className="mt-1 text-sm text-red-600">{errors.paciente_dni}</p>
                )}
              </div>

              {/* Nombres */}
              <div>
                <label htmlFor="paciente_nombres" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="paciente_nombres"
                  name="paciente_nombres"
                  value={formData.paciente_nombres}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.paciente_nombres ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.paciente_nombres && (
                  <p className="mt-1 text-sm text-red-600">{errors.paciente_nombres}</p>
                )}
              </div>

              {/* Apellidos */}
              <div>
                <label htmlFor="paciente_apellidos" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="paciente_apellidos"
                  name="paciente_apellidos"
                  value={formData.paciente_apellidos}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.paciente_apellidos ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.paciente_apellidos && (
                  <p className="mt-1 text-sm text-red-600">{errors.paciente_apellidos}</p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento <span className="text-gray-400">(Opcional)</span>
                </label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  max={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_nacimiento ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_nacimiento && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_nacimiento}</p>
                )}
              </div>

              {/* Sexo */}
              <div>
                <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo <span className="text-gray-400">(Opcional)</span>
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.sexo ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar...</option>
                  {sexos.map((sexo) => (
                    <option key={sexo.value} value={sexo.value}>
                      {sexo.label}
                    </option>
                  ))}
                </select>
                {errors.sexo && <p className="mt-1 text-sm text-red-600">{errors.sexo}</p>}
              </div>
            </div>
          </div>

          {/* Sección: Datos Clínicos */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Clínicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de TB */}
              <div>
                <label htmlFor="tipo_tb" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de TB <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipo_tb"
                  name="tipo_tb"
                  value={formData.tipo_tb}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tipo_tb ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo de TB...</option>
                  {tiposTB.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipo_tb && <p className="mt-1 text-sm text-red-600">{errors.tipo_tb}</p>}
              </div>

              {/* Fecha de Diagnóstico */}
              <div>
                <label htmlFor="fecha_diagnostico" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Diagnóstico <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fecha_diagnostico"
                  name="fecha_diagnostico"
                  value={formData.fecha_diagnostico}
                  onChange={handleChange}
                  required
                  max={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_diagnostico ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_diagnostico && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_diagnostico}</p>
                )}
              </div>

              {/* Establecimiento */}
              <div className="md:col-span-2">
                <label
                  htmlFor="establecimiento_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Establecimiento de Salud <span className="text-red-500">*</span>
                </label>
                {establecimientosLoading ? (
                  <div className="px-3 py-2 border border-gray-300 rounded-lg">
                    <p className="text-sm text-gray-500">Cargando establecimientos...</p>
                  </div>
                ) : (
                  <select
                    id="establecimiento_id"
                    name="establecimiento_id"
                    value={formData.establecimiento_id}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.establecimiento_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar establecimiento...</option>
                    {establecimientosData?.data?.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.nombre}
                      </option>
                    ))}
                  </select>
                )}
                {errors.establecimiento_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.establecimiento_id}</p>
                )}
              </div>

              {/* Observaciones */}
              <div className="md:col-span-2">
                <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones <span className="text-gray-400">(Opcional)</span>
                </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.observaciones ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese observaciones adicionales sobre el caso..."
                />
                {errors.observaciones && (
                  <p className="mt-1 text-sm text-red-600">{errors.observaciones}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to={`/casos-indice/${id}`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CasoIndiceEditar
