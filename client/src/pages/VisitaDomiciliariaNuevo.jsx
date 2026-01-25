import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { visitaDomiciliariaService } from '../services/visitaDomiciliariaService'
import { contactoService } from '../services/contactoService'
import { casoIndiceService } from '../services/casoIndiceService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate, toInputDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const VisitaDomiciliariaNuevo = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    contacto_id: '',
    caso_indice_id: '',
    tipo_visita: '',
    fecha_visita: '',
    fecha_programada: '',
    hora_visita: '',
    direccion_visita: '',
    resultado_visita: 'Realizada',
    motivo_no_realizada: '',
    establecimiento_id: '',
    observaciones: '',
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

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => visitaDomiciliariaService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['visitas-domiciliarias'] })
      if (response?.data?.contacto_id) {
        queryClient.invalidateQueries({
          queryKey: ['visitas-domiciliarias', 'contacto', response.data.contacto_id],
        })
      }
      if (response?.data?.caso_indice_id) {
        queryClient.invalidateQueries({
          queryKey: ['visitas-domiciliarias', 'caso-indice', response.data.caso_indice_id],
        })
      }
      toast.success('Visita creada correctamente')
      navigate(`/visitas-domiciliarias/${response.data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear la visita')
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

    if (!formData.contacto_id && !formData.caso_indice_id) {
      newErrors.contacto_id = 'Debe seleccionar contacto o caso índice'
      newErrors.caso_indice_id = 'Debe seleccionar contacto o caso índice'
    }

    if (!formData.tipo_visita) newErrors.tipo_visita = 'El tipo de visita es requerido'
    if (!formData.fecha_visita) newErrors.fecha_visita = 'La fecha de visita es requerida'
    if (!formData.direccion_visita.trim()) {
      newErrors.direccion_visita = 'La dirección de visita es requerida'
    }
    if (!formData.establecimiento_id) {
      newErrors.establecimiento_id = 'El establecimiento es requerido'
    }

    if (formData.fecha_visita) {
      const fechaVisita = parseLocalDate(formData.fecha_visita)
      const hoy = new Date()
      if (fechaVisita > hoy) {
        newErrors.fecha_visita = 'La fecha de visita no puede ser futura'
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
      tipo_visita: formData.tipo_visita,
      fecha_visita: formData.fecha_visita,
      direccion_visita: formData.direccion_visita.trim(),
      resultado_visita: formData.resultado_visita,
      establecimiento_id: parseInt(formData.establecimiento_id, 10),
    }

    if (formData.contacto_id) dataToSend.contacto_id = parseInt(formData.contacto_id, 10)
    if (formData.caso_indice_id) dataToSend.caso_indice_id = parseInt(formData.caso_indice_id, 10)
    if (formData.fecha_programada) dataToSend.fecha_programada = formData.fecha_programada
    if (formData.hora_visita) dataToSend.hora_visita = formData.hora_visita
    if (formData.motivo_no_realizada.trim()) {
      dataToSend.motivo_no_realizada = formData.motivo_no_realizada.trim()
    }
    if (formData.observaciones.trim()) dataToSend.observaciones = formData.observaciones.trim()

    if (isNaN(dataToSend.establecimiento_id)) {
      setErrors({ establecimiento_id: 'El establecimiento es requerido' })
      toast.error('Selecciona un establecimiento válido')
      return
    }

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

  const tiposVisita = ['Primer contacto', 'Seguimiento']
  const resultadosVisita = ['Realizada', 'No realizada', 'Reagendada']
  const today = toInputDate(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/visitas-domiciliarias"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nueva Visita Domiciliaria</h2>
            <p className="text-gray-600 mt-1">Registrar visita domiciliaria</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Visita</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacto
                </label>
                <SearchableSelect
                  options={contactoOptions}
                  value={formData.contacto_id}
                  onChange={(value) => handleChange({ target: { name: 'contacto_id', value } })}
                  placeholder="Buscar contacto..."
                  error={!!errors.contacto_id}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caso Índice
                </label>
                <SearchableSelect
                  options={casoOptions}
                  value={formData.caso_indice_id}
                  onChange={(value) => handleChange({ target: { name: 'caso_indice_id', value } })}
                  placeholder="Buscar caso índice..."
                  error={!!errors.caso_indice_id}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Visita <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipo_visita"
                  value={formData.tipo_visita}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tipo_visita ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposVisita.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipo_visita && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo_visita}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Visita <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_visita"
                  value={formData.fecha_visita}
                  onChange={handleChange}
                  max={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_visita ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_visita && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_visita}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Programada</label>
                <input
                  type="date"
                  name="fecha_programada"
                  value={formData.fecha_programada}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Visita</label>
                <input
                  type="time"
                  name="hora_visita"
                  value={formData.hora_visita}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultado <span className="text-red-500">*</span>
                </label>
                <select
                  name="resultado_visita"
                  value={formData.resultado_visita}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {resultadosVisita.map((resultado) => (
                    <option key={resultado} value={resultado}>
                      {resultado}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Visita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="direccion_visita"
                  value={formData.direccion_visita}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.direccion_visita ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.direccion_visita && (
                  <p className="mt-1 text-sm text-red-600">{errors.direccion_visita}</p>
                )}
              </div>

              {formData.resultado_visita === 'No realizada' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo No Realizada
                  </label>
                  <textarea
                    name="motivo_no_realizada"
                    rows="3"
                    value={formData.motivo_no_realizada}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

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
              to="/visitas-domiciliarias"
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
              Guardar Visita
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default VisitaDomiciliariaNuevo
