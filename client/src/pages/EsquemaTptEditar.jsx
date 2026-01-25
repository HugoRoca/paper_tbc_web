import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { esquemaTptService } from '../services/esquemaTptService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const EsquemaTptEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: esquemaData, isLoading, error } = useQuery({
    queryKey: ['esquema-tpt', id],
    queryFn: () => esquemaTptService.getById(id),
  })

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    duracion_meses: '',
    medicamentos: '',
    activo: true,
  })

  useEffect(() => {
    if (esquemaData?.data) {
      const esquema = esquemaData.data
      setFormData({
        codigo: esquema.codigo || '',
        nombre: esquema.nombre || '',
        descripcion: esquema.descripcion || '',
        duracion_meses: esquema.duracion_meses?.toString() || '',
        medicamentos: esquema.medicamentos || '',
        activo: !!esquema.activo,
      })
    }
  }, [esquemaData])

  const updateMutation = useMutation({
    mutationFn: (data) => esquemaTptService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esquema-tpt', id] })
      queryClient.invalidateQueries({ queryKey: ['esquemas-tpt'] })
      toast.success('Esquema TPT actualizado correctamente')
      navigate(`/esquemas-tpt/${id}`)
    },
    onError: (updateError) => {
      toast.error(updateError.response?.data?.message || 'Error al actualizar el esquema TPT')
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
    if (!formData.duracion_meses) {
      newErrors.duracion_meses = 'La duración es requerida'
    } else {
      const duracion = parseInt(formData.duracion_meses)
      if (isNaN(duracion) || duracion <= 0) {
        newErrors.duracion_meses = 'La duración debe ser un número positivo'
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
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      duracion_meses: parseInt(formData.duracion_meses),
      activo: formData.activo,
    }

    if (formData.descripcion.trim()) dataToSend.descripcion = formData.descripcion.trim()
    else dataToSend.descripcion = null

    if (formData.medicamentos.trim()) dataToSend.medicamentos = formData.medicamentos.trim()
    else dataToSend.medicamentos = null

    updateMutation.mutate(dataToSend)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando esquema TPT...</p>
        </div>
      </div>
    )
  }

  if (error || !esquemaData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Esquema TPT no encontrado'}
          </p>
          <Link
            to="/esquemas-tpt"
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
          <Link to={`/esquemas-tpt/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Esquema TPT</h2>
            <p className="text-gray-600 mt-1">Actualizar información del esquema</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (meses) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duracion_meses"
                value={formData.duracion_meses}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.duracion_meses ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.duracion_meses && (
                <p className="mt-1 text-sm text-red-600">{errors.duracion_meses}</p>
              )}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                name="descripcion"
                rows="3"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicamentos y Dosis
              </label>
              <textarea
                name="medicamentos"
                rows="4"
                value={formData.medicamentos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Especificar medicamentos, dosis y frecuencia de administración
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to={`/esquemas-tpt/${id}`}
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

export default EsquemaTptEditar
