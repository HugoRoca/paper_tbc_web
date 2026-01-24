import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { casoIndiceService } from '../services/casoIndiceService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { parseLocalDate, toInputDate } from '../utils/date'

// Función para generar código aleatorio hexadecimal
const generateRandomCode = () => {
  const randomHex = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('').toUpperCase()
  return `CASO-${randomHex}`
}

const CasoIndiceNuevo = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo_caso: '',
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

  // Generar código automáticamente al cargar el componente
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      codigo_caso: generateRandomCode(),
    }))
  }, [])

  // Consultar establecimientos
  const { data: establecimientosData, isLoading: establecimientosLoading } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  // Mutación para crear
  const createMutation = useMutation({
    mutationFn: (data) => casoIndiceService.create(data),
    onSuccess: (response) => {
      // Invalidar queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['casos-indice'] })
      queryClient.invalidateQueries({ queryKey: ['caso-indice', response.data.id] })
      
      toast.success('Caso índice creado correctamente')
      navigate(`/casos-indice/${response.data.id}`)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Error al crear el caso índice'
      toast.error(errorMessage)
      
      // Manejar errores de validación del backend
      if (error.response?.data?.errors) {
        const validationErrors = {}
        error.response.data.errors.forEach((err) => {
          // Convertir el nombre del campo del backend al nombre del campo del formulario
          const fieldName =           err.field === 'codigo_caso' ? 'codigo_caso' :
                           err.field === 'paciente_nombres' ? 'paciente_nombres' :
                           err.field === 'paciente_apellidos' ? 'paciente_apellidos' :
                           err.field === 'tipo_tb' ? 'tipo_tb' :
                           err.field === 'fecha_diagnostico' ? 'fecha_diagnostico' :
                           err.field === 'establecimiento_id' ? 'establecimiento_id' :
                           err.field === 'paciente_dni' ? 'paciente_dni' :
                           err.field === 'fecha_nacimiento' ? 'fecha_nacimiento' :
                           err.field === 'sexo' ? 'sexo' :
                           err.field === 'observaciones' ? 'observaciones' : err.field
          validationErrors[fieldName] = err.message
        })
        setErrors(validationErrors)
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

    if (!formData.codigo_caso.trim()) {
      newErrors.codigo_caso = 'El código de caso es requerido'
    } else {
      // Validar formato del código (CASO-XXXXXXXX donde X es hexadecimal)
      const codigoPattern = /^CASO-[0-9A-F]{8}$/i
      if (!codigoPattern.test(formData.codigo_caso.trim())) {
        newErrors.codigo_caso = 'El código debe tener el formato CASO-XXXXXXXX (8 caracteres hexadecimales)'
      }
    }

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

    // Validar que el código de caso no esté vacío
    if (!formData.codigo_caso.trim()) {
      setErrors({ codigo_caso: 'El código de caso es requerido' })
      toast.error('Por favor, ingresa un código de caso')
      return
    }

    // Preparar datos para enviar (remover campos vacíos opcionales)
    // Asegurar que las fechas se envíen como strings en formato YYYY-MM-DD sin conversión de zona horaria
    const dataToSend = {
      codigo_caso: formData.codigo_caso.trim(),
      paciente_nombres: formData.paciente_nombres.trim(),
      paciente_apellidos: formData.paciente_apellidos.trim(),
      tipo_tb: formData.tipo_tb,
      fecha_diagnostico: formData.fecha_diagnostico, // Ya viene en formato YYYY-MM-DD del input type="date"
      establecimiento_id: parseInt(formData.establecimiento_id, 10),
    }

    // Validar que establecimiento_id sea un número válido
    if (isNaN(dataToSend.establecimiento_id)) {
      setErrors({ establecimiento_id: 'El establecimiento es requerido' })
      toast.error('Por favor, selecciona un establecimiento válido')
      return
    }

    // Agregar campos opcionales solo si tienen valor
    // NO enviar paciente_dni si está vacío
    const pacienteDniTrimmed = formData.paciente_dni.trim()
    if (pacienteDniTrimmed) {
      dataToSend.paciente_dni = pacienteDniTrimmed
    }
    if (formData.fecha_nacimiento) {
      dataToSend.fecha_nacimiento = formData.fecha_nacimiento
    }
    if (formData.sexo) {
      dataToSend.sexo = formData.sexo
    }
    const observacionesTrimmed = formData.observaciones.trim()
    if (observacionesTrimmed) {
      dataToSend.observaciones = observacionesTrimmed
    }

    createMutation.mutate(dataToSend)
  }

  const tiposTB = ['Pulmonar', 'Extrapulmonar', 'Miliar', 'Meningea']
  const sexos = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' },
  ]

  // Obtener fecha máxima (hoy) para los inputs de fecha
  const today = toInputDate(new Date())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/casos-indice"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nuevo Caso Índice</h2>
            <p className="text-gray-600 mt-1">Registrar un nuevo caso índice de tuberculosis</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Sección: Datos Personales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código de Caso */}
              <div>
                <label htmlFor="codigo_caso" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Caso <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="codigo_caso"
                    name="codigo_caso"
                    value={formData.codigo_caso}
                    onChange={handleChange}
                    placeholder="CASO-XXXXXXXX"
                    required
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.codigo_caso ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        codigo_caso: generateRandomCode(),
                      }))
                      if (errors.codigo_caso) {
                        setErrors((prev) => ({ ...prev, codigo_caso: null }))
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                    title="Generar nuevo código"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Código único para identificar el caso. Puedes editarlo o generar uno nuevo.
                </p>
                {errors.codigo_caso && (
                  <p className="mt-1 text-sm text-red-600">{errors.codigo_caso}</p>
                )}
              </div>

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
              to="/casos-indice"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CasoIndiceNuevo
