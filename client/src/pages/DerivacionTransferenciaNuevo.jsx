import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { derivacionTransferenciaService } from '../services/derivacionTransferenciaService'
import { contactoService } from '../services/contactoService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import SearchableSelect from '../components/SearchableSelect'
import { toInputDate } from '../utils/date'

const DerivacionTransferenciaNuevo = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    tipo: 'Derivación',
    contacto_id: '',
    establecimiento_origen_id: '',
    establecimiento_destino_id: '',
    motivo: '',
    observaciones: '',
    fecha_solicitud: '',
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
    mutationFn: (data) => derivacionTransferenciaService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['derivaciones-transferencias'] })
      toast.success('Derivación creada correctamente')
      navigate(`/derivaciones-transferencias/${response.data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear la derivación')
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
    }

    if (formData.observaciones.trim()) dataToSend.observaciones = formData.observaciones.trim()

    createMutation.mutate(dataToSend)
  }

  const contactos = contactosData?.data || []
  const contactoOptions = contactos.map((contacto) => ({
    value: contacto.id,
    label: `${contacto.nombres} ${contacto.apellidos}${contacto.dni ? ` - ${contacto.dni}` : ''}`,
  }))

  const tipos = ['Derivación', 'Transferencia']
  const today = toInputDate(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/derivaciones-transferencias"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nueva Derivación/Transferencia</h2>
            <p className="text-gray-600 mt-1">Registrar una derivación</p>
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
              to="/derivaciones-transferencias"
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
              Guardar Derivación
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DerivacionTransferenciaNuevo
