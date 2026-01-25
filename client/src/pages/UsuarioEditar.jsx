import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { roleService } from '../services/roleService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const UsuarioEditar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})

  const { data: usuarioData, isLoading, error } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => userService.getById(id),
  })

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    dni: '',
    rol_id: '',
    establecimiento_id: '',
    activo: true,
  })

  useEffect(() => {
    if (usuarioData?.data) {
      const user = usuarioData.data
      setFormData({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        dni: user.dni || '',
        rol_id: user.rol_id?.toString() || user.rol?.id?.toString() || '',
        establecimiento_id: user.establecimiento_id?.toString() || '',
        activo: !!user.activo,
      })
    }
  }, [usuarioData])

  const { data: rolesData } = useQuery({
    queryKey: ['roles', 'all'],
    queryFn: () => roleService.list({ page: 1, limit: 100 }),
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ page: 1, limit: 1000 }),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuario', id] })
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Usuario actualizado correctamente')
      navigate(`/usuarios/${id}`)
    },
    onError: (updateError) => {
      toast.error(updateError.response?.data?.message || 'Error al actualizar el usuario')
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

    if (!formData.nombres.trim()) newErrors.nombres = 'Los nombres son requeridos'
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son requeridos'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    if (!formData.rol_id) newErrors.rol_id = 'El rol es requerido'

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
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      email: formData.email.trim(),
      rol_id: parseInt(formData.rol_id, 10),
      activo: formData.activo,
    }

    if (formData.dni.trim()) dataToSend.dni = formData.dni.trim()
    else dataToSend.dni = null

    if (formData.establecimiento_id) {
      dataToSend.establecimiento_id = parseInt(formData.establecimiento_id, 10)
    } else {
      dataToSend.establecimiento_id = null
    }

    updateMutation.mutate(dataToSend)
  }

  const roles = rolesData?.data || []
  const establecimientos = establecimientosData?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    )
  }

  if (error || !usuarioData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Usuario no encontrado'}
          </p>
          <Link
            to="/usuarios"
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
          <Link to={`/usuarios/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Usuario</h2>
            <p className="text-gray-600 mt-1">Actualizar información del usuario</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                name="rol_id"
                value={formData.rol_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.rol_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              {errors.rol_id && <p className="mt-1 text-sm text-red-600">{errors.rol_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Establecimiento
              </label>
              <select
                name="establecimiento_id"
                value={formData.establecimiento_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar establecimiento</option>
                {establecimientos.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.nombre}
                  </option>
                ))}
              </select>
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
              to={`/usuarios/${id}`}
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

export default UsuarioEditar
