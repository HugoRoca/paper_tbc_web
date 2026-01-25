import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reaccionAdversaService } from '../services/reaccionAdversaService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertTriangle,
  Building,
  User,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const ReaccionAdversaDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['reaccion-adversa', id],
    queryFn: () => reaccionAdversaService.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => reaccionAdversaService.delete(id),
    onSuccess: () => {
      toast.success('Reacción adversa eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['reacciones-adversas'] })
      navigate('/reacciones-adversas')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar la reacción')
    },
  })

  const reaccion = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta reacción adversa?')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reacción adversa...</p>
        </div>
      </div>
    )
  }

  if (error || !reaccion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Reacción adversa no encontrada'}
          </p>
          <Link
            to="/reacciones-adversas"
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
            to="/reacciones-adversas"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Reacción Adversa</h2>
            <p className="text-gray-600 mt-1">Severidad: {reaccion.severidad}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/reacciones-adversas/${id}/editar`}
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
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          Información de la Reacción
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Reacción</label>
            <p className="text-gray-900 mt-1">{formatDateLocal(reaccion.fecha_reaccion)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo de Reacción</label>
            <p className="text-gray-900 mt-1">{reaccion.tipo_reaccion}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Severidad</label>
            <p className="mt-1">
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                {reaccion.severidad}
              </span>
            </p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Síntomas</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{reaccion.sintomas}</p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Acción Tomada</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{reaccion.accion_tomada || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Medicamento Sospechoso</label>
            <p className="text-gray-900 mt-1">{reaccion.medicamento_sospechoso || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Resultado</label>
            <p className="text-gray-900 mt-1">{reaccion.resultado}</p>
          </div>
          {reaccion.observaciones && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Observaciones</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{reaccion.observaciones}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Indicación TPT
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900 font-medium">
              ID: {reaccion.tptIndicacion?.id || reaccion.tpt_indicacion_id}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Estado: {reaccion.tptIndicacion?.estado || '-'}
            </p>
          </div>
          {(reaccion.tptIndicacion?.id || reaccion.tpt_indicacion_id) && (
            <Link
              to={`/tpt-indicaciones/${reaccion.tptIndicacion?.id || reaccion.tpt_indicacion_id}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver Indicación
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Establecimiento y Registro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Establecimiento</label>
            <p className="text-gray-900 mt-1">{reaccion.establecimiento?.nombre || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Registrado por</label>
            <p className="text-gray-900 mt-1">
              {reaccion.usuarioRegistro
                ? `${reaccion.usuarioRegistro.nombres} ${reaccion.usuarioRegistro.apellidos}`
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de registro</label>
            <p className="text-gray-900 mt-1">
              {reaccion.created_at ? formatDateLocal(reaccion.created_at) : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReaccionAdversaDetalle
