import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { examenContactoService } from '../services/examenContactoService'
import { contactoService } from '../services/contactoService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseLocalDate, toInputDate } from '../utils/date'
import SearchableSelect from '../components/SearchableSelect'

const ExamenContactoNuevo = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    contacto_id: '',
    fecha_examen: '',
    tipo_examen: '',
    resultado: '',
    resultado_codificado: '',
    establecimiento_id: '',
    observaciones: '',
  })

  useEffect(() => {
    const contactoId = searchParams.get('contacto_id')
    if (contactoId) {
      setFormData((prev) => ({ ...prev, contacto_id: contactoId }))
    }
  }, [searchParams])

  const { data: contactosData } = useQuery({
    queryKey: ['contactos', 'all'],
    queryFn: () => contactoService.list({ limit: 1000, page: 1 }),
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => examenContactoService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['examenes-contacto'] })
      if (response?.data?.contacto_id) {
        queryClient.invalidateQueries({
          queryKey: ['examenes-contacto', 'contacto', response.data.contacto_id],
        })
      }
      toast.success('Examen creado correctamente')
      navigate(`/examenes-contacto/${response.data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear el examen')
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
    if (!formData.contacto_id) newErrors.contacto_id = 'El contacto es requerido'
    if (!formData.fecha_examen) newErrors.fecha_examen = 'La fecha del examen es requerida'
    if (!formData.tipo_examen) newErrors.tipo_examen = 'El tipo de examen es requerido'
    if (!formData.establecimiento_id) {
      newErrors.establecimiento_id = 'El establecimiento es requerido'
    }

    if (formData.fecha_examen) {
      const fechaExamen = parseLocalDate(formData.fecha_examen)
      const hoy = new Date()
      if (fechaExamen > hoy) {
        newErrors.fecha_examen = 'La fecha del examen no puede ser futura'
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
      fecha_examen: formData.fecha_examen,
      tipo_examen: formData.tipo_examen,
      establecimiento_id: parseInt(formData.establecimiento_id, 10),
    }

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

    const resultadoTrimmed = formData.resultado.trim()
    if (resultadoTrimmed) dataToSend.resultado = resultadoTrimmed

    const resultadoCodificadoTrimmed = formData.resultado_codificado.trim()
    if (resultadoCodificadoTrimmed) dataToSend.resultado_codificado = resultadoCodificadoTrimmed

    const observacionesTrimmed = formData.observaciones.trim()
    if (observacionesTrimmed) dataToSend.observaciones = observacionesTrimmed

    createMutation.mutate(dataToSend)
  }

  const tiposExamen = ['Clínico', 'Radiológico', 'Inmunológico', 'Bacteriológico', 'Integral']
  const today = toInputDate(new Date())
  const contactos = contactosData?.data || []
  const contactoOptions = contactos.map((contacto) => ({
    value: contacto.id,
    label: `${contacto.nombres} ${contacto.apellidos}${contacto.dni ? ` - ${contacto.dni}` : ''}`,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/examenes-contacto"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nuevo Examen</h2>
            <p className="text-gray-600 mt-1">Registrar examen de contacto</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Examen</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha del Examen <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_examen"
                  value={formData.fecha_examen}
                  onChange={handleChange}
                  max={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha_examen ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fecha_examen && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_examen}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Examen <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipo_examen"
                  value={formData.tipo_examen}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.tipo_examen ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposExamen.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipo_examen && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo_examen}</p>
                )}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultado Codificado
                </label>
                <input
                  type="text"
                  name="resultado_codificado"
                  value={formData.resultado_codificado}
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
              to="/examenes-contacto"
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
              Guardar Examen
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ExamenContactoNuevo
