import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { roleService } from '../services/roleService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const RolEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: rolData, isLoading, error } = useQuery({
    queryKey: ['rol', id],
    queryFn: () => roleService.getById(id),
  })

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  })

  useEffect(() => {
    if (rolData?.data) {
      const rol = rolData.data
      setFormData({
        nombre: rol.nombre || '',
        descripcion: rol.descripcion || '',
        activo: !!rol.activo,
      })
    }
  }, [rolData])

  const updateMutation = useMutation({
    mutationFn: (data) => roleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rol', id] })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Rol actualizado correctamente')
      navigate('/roles')
    },
    onError: (updateError) => {
      toast.error(updateError.response?.data?.message || 'Error al actualizar el rol')
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
      nombre: formData.nombre.trim(),
      activo: formData.activo,
    }

    if (formData.descripcion.trim()) dataToSend.descripcion = formData.descripcion.trim()
    else dataToSend.descripcion = null

    updateMutation.mutate(dataToSend)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando rol...</p>
        </div>
      </div>
    )
  }

  if (error || !rolData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Rol no encontrado'}
          </p>
          <Link
            to="/roles"
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
          <Link to="/roles" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Rol</h2>
            <p className="text-gray-600 mt-1">Actualizar información del rol</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              to="/roles"
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

export default RolEditar
