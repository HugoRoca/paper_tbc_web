import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { ArrowLeft, Edit, Trash2, AlertCircle, User, Mail, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const UsuarioDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => userService.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => userService.delete(id),
    onSuccess: () => {
      toast.success('Usuario desactivado correctamente')
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      navigate('/usuarios')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al desactivar el usuario')
    },
  })

  const usuario = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Desactivar este usuario?')) {
      deleteMutation.mutate()
    }
  }

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

  if (error || !usuario) {
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
          <Link to="/usuarios" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Usuario</h2>
            <p className="text-gray-600 mt-1">
              {usuario.nombres} {usuario.apellidos}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/usuarios/${id}/editar`}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
          {usuario.activo && (
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Desactivar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Información Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nombres</label>
            <p className="text-gray-900 mt-1">{usuario.nombres}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Apellidos</label>
            <p className="text-gray-900 mt-1">{usuario.apellidos}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">DNI</label>
            <p className="text-gray-900 mt-1">{usuario.dni || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900 mt-1">{usuario.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Establecimiento</label>
            <p className="text-gray-900 mt-1">
              {usuario.establecimiento?.nombre || usuario.establecimiento_id || '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <span
              className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                usuario.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {usuario.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Rol
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Rol</label>
            <p className="text-gray-900 mt-1">{usuario.rol?.nombre || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Descripción</label>
            <p className="text-gray-900 mt-1">{usuario.rol?.descripcion || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsuarioDetalle
