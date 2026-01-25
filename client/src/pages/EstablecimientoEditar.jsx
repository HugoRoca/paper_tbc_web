import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const EstablecimientoEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: establecimientoData, isLoading, error } = useQuery({
    queryKey: ['establecimiento-salud', id],
    queryFn: () => establecimientoSaludService.getById(id),
  })

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tipo: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    activo: true,
  })

  useEffect(() => {
    if (establecimientoData?.data) {
      const est = establecimientoData.data
      setFormData({
        codigo: est.codigo || '',
        nombre: est.nombre || '',
        tipo: est.tipo || '',
        direccion: est.direccion || '',
        departamento: est.departamento || '',
        provincia: est.provincia || '',
        distrito: est.distrito || '',
        activo: !!est.activo,
      })
    }
  }, [establecimientoData])

  const updateMutation = useMutation({
    mutationFn: (data) => establecimientoSaludService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establecimiento-salud', id] })
      queryClient.invalidateQueries({ queryKey: ['establecimientos-salud'] })
      toast.success('Establecimiento actualizado correctamente')
      navigate('/establecimientos-salud')
    },
    onError: (updateError) => {
      toast.error(updateError.response?.data?.message || 'Error al actualizar el establecimiento')
      if (updateError.response?.data?.errors) {
        setErrors(updateError.response.data.errors)
      }
    },
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setFormData((prev) => ({ ...prev, [name]: newValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido'
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'

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
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      activo: formData.activo,
    }

    if (formData.tipo.trim()) dataToSend.tipo = formData.tipo.trim()
    else dataToSend.tipo = null

    if (formData.direccion.trim()) dataToSend.direccion = formData.direccion.trim()
    else dataToSend.direccion = null

    if (formData.departamento.trim()) dataToSend.departamento = formData.departamento.trim()
    else dataToSend.departamento = null

    if (formData.provincia.trim()) dataToSend.provincia = formData.provincia.trim()
    else dataToSend.provincia = null

    if (formData.distrito.trim()) dataToSend.distrito = formData.distrito.trim()
    else dataToSend.distrito = null

    updateMutation.mutate(dataToSend)
  }

  const tipos = ['Hospital', 'Centro de Salud', 'Posta', 'Clínica', 'Otro']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando establecimiento...</p>
        </div>
      </div>
    )
  }

  if (error || !establecimientoData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Establecimiento no encontrado'}
          </p>
          <Link
            to="/establecimientos-salud"
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
            to="/establecimientos-salud"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Establecimiento</h2>
            <p className="text-gray-600 mt-1">Actualizar información del establecimiento</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.codigo ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distrito</label>
              <input
                type="text"
                name="distrito"
                value={formData.distrito}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">Activo</label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to="/establecimientos-salud"
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

export default EstablecimientoEditar
