import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { esquemaTptService } from '../services/esquemaTptService'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Pill,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const EsquemaTptDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const roleName = user?.role?.nombre || user?.rol?.nombre || user?.rol_nombre
  const isAdmin = roleName === 'Administrador'

  const { data, isLoading, error } = useQuery({
    queryKey: ['esquema-tpt', id],
    queryFn: () => esquemaTptService.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => esquemaTptService.delete(id),
    onSuccess: () => {
      toast.success('Esquema TPT eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['esquemas-tpt'] })
      navigate('/esquemas-tpt')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar el esquema')
    },
  })

  const esquema = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este esquema TPT?')) {
      deleteMutation.mutate()
    }
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

  if (error || !esquema) {
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
          <Link
            to="/esquemas-tpt"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Esquema TPT</h2>
            <p className="text-gray-600 mt-1">Código: {esquema.codigo}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link
              to={`/esquemas-tpt/${id}/editar`}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-600" />
          Información del Esquema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Código</h3>
            <p className="text-lg font-semibold text-gray-900">{esquema.codigo}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Nombre</h3>
            <p className="text-lg font-semibold text-gray-900">{esquema.nombre}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Duración</h3>
            <p className="text-lg font-semibold text-gray-900">{esquema.duracion_meses} meses</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                esquema.activo
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {esquema.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          {esquema.descripcion && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Descripción</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{esquema.descripcion}</p>
            </div>
          )}

          {esquema.medicamentos && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Medicamentos y Dosis</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{esquema.medicamentos}</p>
            </div>
          )}

          {esquema.created_at && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de registro</h3>
              <p className="text-gray-900">{formatDateLocal(esquema.created_at)}</p>
            </div>
          )}

          {esquema.updated_at && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Última actualización</h3>
              <p className="text-gray-900">{formatDateLocal(esquema.updated_at)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EsquemaTptDetalle
