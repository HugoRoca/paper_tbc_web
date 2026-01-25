import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertaService } from '../services/alertaService'
import { contactoService } from '../services/contactoService'
import { casoIndiceService } from '../services/casoIndiceService'
import { ArrowLeft, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import SearchableSelect from '../components/SearchableSelect'
import { toInputDate } from '../utils/date'

const AlertaNuevo = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    tipo_alerta: '',
    severidad: 'Media',
    estado: 'Activa',
    contacto_id: '',
    caso_indice_id: '',
    mensaje: '',
    fecha_alerta: '',
    observaciones: '',
    tpt_indicacion_id: '',
    control_contacto_id: '',
    visita_domiciliaria_id: '',
  })

  useEffect(() => {
    const contactoId = searchParams.get('contacto_id')
    const casoIndiceId = searchParams.get('caso_indice_id')
    setFormData((prev) => ({
      ...prev,
      contacto_id: contactoId || prev.contacto_id,
      caso_indice_id: casoIndiceId || prev.caso_indice_id,
    }))
  }, [searchParams])

  const { data: contactosData } = useQuery({
    queryKey: ['contactos', 'all'],
    queryFn: () => contactoService.list({ limit: 1000, page: 1 }),
  })

  const { data: casosData } = useQuery({
    queryKey: ['casos-indice', 'all'],
    queryFn: () => casoIndiceService.list({ limit: 1000, page: 1 }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => alertaService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] })
      toast.success('Alerta creada correctamente')
      navigate(`/alertas/${response.data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear la alerta')
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

    if (!formData.tipo_alerta) newErrors.tipo_alerta = 'El tipo de alerta es requerido'
    if (!formData.fecha_alerta) newErrors.fecha_alerta = 'La fecha de alerta es requerida'
    if (!formData.mensaje.trim()) newErrors.mensaje = 'El mensaje es requerido'

    if (!formData.contacto_id && !formData.caso_indice_id) {
      newErrors.contacto_id = 'Seleccione contacto o caso índice'
      newErrors.caso_indice_id = 'Seleccione contacto o caso índice'
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
      tipo_alerta: formData.tipo_alerta,
      severidad: formData.severidad,
      estado: formData.estado,
      mensaje: formData.mensaje.trim(),
      fecha_alerta: formData.fecha_alerta,
    }

    if (formData.contacto_id) dataToSend.contacto_id = parseInt(formData.contacto_id, 10)
    if (formData.caso_indice_id) dataToSend.caso_indice_id = parseInt(formData.caso_indice_id, 10)
    if (formData.tpt_indicacion_id) dataToSend.tpt_indicacion_id = parseInt(formData.tpt_indicacion_id, 10)
    if (formData.control_contacto_id) dataToSend.control_contacto_id = parseInt(formData.control_contacto_id, 10)
    if (formData.visita_domiciliaria_id) {
      dataToSend.visita_domiciliaria_id = parseInt(formData.visita_domiciliaria_id, 10)
    }
    if (formData.observaciones.trim()) dataToSend.observaciones = formData.observaciones.trim()

    createMutation.mutate(dataToSend)
  }

  const contactos = contactosData?.data || []
  const contactoOptions = contactos.map((contacto) => ({
    value: contacto.id,
    label: `${contacto.nombres} ${contacto.apellidos}${contacto.dni ? ` - ${contacto.dni}` : ''}`,
  }))

  const casos = casosData?.data || []
  const casoOptions = casos.map((caso) => ({
    value: caso.id,
    label: `${caso.codigo_caso} - ${caso.paciente_nombres} ${caso.paciente_apellidos}`,
  }))

  const tipos = [
    'Control no realizado',
    'TPT no iniciada',
    'TPT abandonada',
    'Visita no realizada',
    'Otro',
  ]
  const severidades = ['Baja', 'Media', 'Alta', 'Crítica']
  const estados = ['Activa', 'En revisión', 'Resuelta', 'Descartada']
  const today = toInputDate(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/alertas" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nueva Alerta</h2>
            <p className="text-gray-600 mt-1">Registrar alerta en el sistema</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Alerta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Alerta <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipo_alerta"
                  value={formData.tipo_alerta}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tipo_alerta ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipo_alerta && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo_alerta}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {severidades.map((severidad) => (
                    <option key={severidad} value={severidad}>
                      {severidad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Alerta <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_alerta"
                  value={formData.fecha_alerta}
                  onChange={handleChange}
                  max={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_alerta ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_alerta && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_alerta}</p>
                )}
              </div>

              <div className="md:col-span-2">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caso Índice <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={casoOptions}
                  value={formData.caso_indice_id}
                  onChange={(value) => handleChange({ target: { name: 'caso_indice_id', value } })}
                  placeholder="Buscar caso índice..."
                  error={!!errors.caso_indice_id}
                />
                {errors.caso_indice_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.caso_indice_id}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Selecciona contacto o caso índice (uno de los dos).
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="mensaje"
                  rows="3"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.mensaje ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.mensaje && <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>}
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

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Relaciones opcionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TPT Indicación (ID)</label>
                <input
                  type="number"
                  name="tpt_indicacion_id"
                  value={formData.tpt_indicacion_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Control Contacto (ID)</label>
                <input
                  type="number"
                  name="control_contacto_id"
                  value={formData.control_contacto_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visita Domiciliaria (ID)
                </label>
                <input
                  type="number"
                  name="visita_domiciliaria_id"
                  value={formData.visita_domiciliaria_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to="/alertas"
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
              Guardar Alerta
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AlertaNuevo
