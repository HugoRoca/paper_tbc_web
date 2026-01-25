import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { contactoService } from '../services/contactoService'
import { casoIndiceService } from '../services/casoIndiceService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate, toInputDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const ContactoNuevo = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    caso_indice_id: '',
    dni: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    sexo: '',
    tipo_contacto: '',
    parentesco: '',
    direccion: '',
    telefono: '',
    establecimiento_id: '',
    fecha_registro: toInputDate(new Date()),
    observaciones: '',
  })

  useEffect(() => {
    const casoIndiceId = searchParams.get('caso_indice_id')
    if (casoIndiceId) {
      setFormData((prev) => ({ ...prev, caso_indice_id: casoIndiceId }))
    }
  }, [searchParams])

  const { data: casosIndiceData } = useQuery({
    queryKey: ['casos-indice', 'all'],
    queryFn: () => casoIndiceService.list({ limit: 1000, page: 1 }),
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => contactoService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['contactos'] })
      if (response?.data?.caso_indice_id) {
        queryClient.invalidateQueries({
          queryKey: ['contactos', 'caso-indice', response.data.caso_indice_id],
        })
      }
      toast.success('Contacto creado correctamente')
      navigate(`/contactos/${response.data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear el contacto')
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
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

    if (!formData.caso_indice_id) {
      newErrors.caso_indice_id = 'El caso índice es requerido'
    }
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos'
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos'
    }
    if (!formData.tipo_contacto) {
      newErrors.tipo_contacto = 'El tipo de contacto es requerido'
    }
    if (!formData.establecimiento_id) {
      newErrors.establecimiento_id = 'El establecimiento es requerido'
    }

    if (formData.fecha_nacimiento) {
      const fechaNacimiento = parseLocalDate(formData.fecha_nacimiento)
      const hoy = new Date()
      if (fechaNacimiento > hoy) {
        newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura'
      }
    }

    if (formData.fecha_registro) {
      const fechaRegistro = parseLocalDate(formData.fecha_registro)
      const hoy = new Date()
      if (fechaRegistro > hoy) {
        newErrors.fecha_registro = 'La fecha de registro no puede ser futura'
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
      caso_indice_id: parseInt(formData.caso_indice_id, 10),
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      tipo_contacto: formData.tipo_contacto,
      establecimiento_id: parseInt(formData.establecimiento_id, 10),
    }

    if (isNaN(dataToSend.caso_indice_id)) {
      setErrors({ caso_indice_id: 'El caso índice es requerido' })
      toast.error('Selecciona un caso índice válido')
      return
    }

    if (isNaN(dataToSend.establecimiento_id)) {
      setErrors({ establecimiento_id: 'El establecimiento es requerido' })
      toast.error('Selecciona un establecimiento válido')
      return
    }

    const dniTrimmed = formData.dni.trim()
    if (dniTrimmed) dataToSend.dni = dniTrimmed

    if (formData.fecha_nacimiento) dataToSend.fecha_nacimiento = formData.fecha_nacimiento
    if (formData.sexo) dataToSend.sexo = formData.sexo

    const parentescoTrimmed = formData.parentesco.trim()
    if (parentescoTrimmed) dataToSend.parentesco = parentescoTrimmed

    const direccionTrimmed = formData.direccion.trim()
    if (direccionTrimmed) dataToSend.direccion = direccionTrimmed

    const telefonoTrimmed = formData.telefono.trim()
    if (telefonoTrimmed) dataToSend.telefono = telefonoTrimmed

    if (formData.fecha_registro) dataToSend.fecha_registro = formData.fecha_registro

    const observacionesTrimmed = formData.observaciones.trim()
    if (observacionesTrimmed) dataToSend.observaciones = observacionesTrimmed

    createMutation.mutate(dataToSend)
  }

  const tiposContacto = [
    { value: 'Intradomiciliario', label: 'Intradomiciliario' },
    { value: 'Extradomiciliario', label: 'Extradomiciliario' },
  ]
  const sexos = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' },
  ]

  const today = toInputDate(new Date())
  const casosIndice = casosIndiceData?.data || []
  const casoIndiceOptions = casosIndice.map((caso) => ({
    value: caso.id,
    label: `${caso.codigo_caso} - ${caso.paciente_nombres} ${caso.paciente_apellidos}`,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/contactos" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nuevo Contacto</h2>
            <p className="text-gray-600 mt-1">Registrar un nuevo contacto</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Datos principales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caso Índice <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={casoIndiceOptions}
                  value={formData.caso_indice_id}
                  onChange={(value) => handleChange({ target: { name: 'caso_indice_id', value } })}
                  placeholder="Buscar caso índice..."
                  error={!!errors.caso_indice_id}
                />
                {errors.caso_indice_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.caso_indice_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombres ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.nombres && <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.apellidos ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.apellidos && (
                  <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                <input
                  type="date"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar</option>
                  {sexos.map((sexo) => (
                    <option key={sexo.value} value={sexo.value}>
                      {sexo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Contacto <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipo_contacto"
                  value={formData.tipo_contacto}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tipo_contacto ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar</option>
                  {tiposContacto.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.tipo_contacto && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo_contacto}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parentesco</label>
                <input
                  type="text"
                  name="parentesco"
                  value={formData.parentesco}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Datos administrativos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Administrativos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Registro</label>
                <input
                  type="date"
                  name="fecha_registro"
                  value={formData.fecha_registro}
                  onChange={handleChange}
                  max={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_registro ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_registro && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_registro}</p>
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

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to="/contactos"
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
              Guardar Contacto
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ContactoNuevo
