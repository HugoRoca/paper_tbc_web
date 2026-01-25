import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertaService } from '../services/alertaService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Bell,
  AlertCircle,
  CheckCircle,
  User,
  ClipboardList,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const AlertaDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['alerta', id],
    queryFn: () => alertaService.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => alertaService.delete(id),
    onSuccess: () => {
      toast.success('Alerta eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['alertas'] })
      navigate('/alertas')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar la alerta')
    },
  })

  const resolverMutation = useMutation({
    mutationFn: (observaciones) => alertaService.resolver(id, { observaciones }),
    onSuccess: () => {
      toast.success('Alerta resuelta correctamente')
      queryClient.invalidateQueries({ queryKey: ['alerta', id] })
      queryClient.invalidateQueries({ queryKey: ['alertas'] })
    },
    onError: (resolverError) => {
      toast.error(resolverError.response?.data?.message || 'Error al resolver la alerta')
    },
  })

  const alerta = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta alerta?')) {
      deleteMutation.mutate()
    }
  }

  const handleResolve = () => {
    const observaciones = window.prompt('Observaciones de resolución (opcional)')
    resolverMutation.mutate(observaciones || '')
  }

  const estadoBadgeClass = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'bg-red-100 text-red-800'
      case 'En revisión':
        return 'bg-yellow-100 text-yellow-800'
      case 'Resuelta':
        return 'bg-green-100 text-green-800'
      case 'Descartada':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const severidadBadgeClass = (severidad) => {
    switch (severidad) {
      case 'Crítica':
        return 'bg-red-100 text-red-800'
      case 'Alta':
        return 'bg-orange-100 text-orange-800'
      case 'Media':
        return 'bg-yellow-100 text-yellow-800'
      case 'Baja':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando alerta...</p>
        </div>
      </div>
    )
  }

  if (error || !alerta) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Alerta no encontrada'}
          </p>
          <Link
            to="/alertas"
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
          <Link to="/alertas" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Alerta</h2>
            <p className="text-gray-600 mt-1">Tipo: {alerta.tipo_alerta}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {alerta.estado !== 'Resuelta' && (
            <button
              onClick={handleResolve}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Resolver
            </button>
          )}
          <Link
            to={`/alertas/${id}/editar`}
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
          <Bell className="w-5 h-5 text-blue-600" />
          Información de la Alerta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo</label>
            <p className="text-gray-900 mt-1">{alerta.tipo_alerta}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <span
              className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${estadoBadgeClass(
                alerta.estado,
              )}`}
            >
              {alerta.estado}
            </span>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Severidad</label>
            <span
              className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${severidadBadgeClass(
                alerta.severidad,
              )}`}
            >
              {alerta.severidad}
            </span>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Alerta</label>
            <p className="text-gray-900 mt-1">{formatDateLocal(alerta.fecha_alerta)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Resolución</label>
            <p className="text-gray-900 mt-1">
              {alerta.fecha_resolucion ? formatDateLocal(alerta.fecha_resolucion) : '-'}
            </p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Mensaje</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{alerta.mensaje}</p>
          </div>
          {alerta.observaciones && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Observaciones</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{alerta.observaciones}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Relación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Contacto</label>
            {alerta.contacto ? (
              <Link
                to={`/contactos/${alerta.contacto.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block"
              >
                {alerta.contacto.nombres} {alerta.contacto.apellidos}
              </Link>
            ) : (
              <p className="text-gray-900 mt-1">-</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Caso Índice</label>
            {alerta.casoIndice ? (
              <Link
                to={`/casos-indice/${alerta.casoIndice.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block"
              >
                {alerta.casoIndice.codigo_caso}
              </Link>
            ) : (
              <p className="text-gray-900 mt-1">-</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Usuario Resuelve</label>
            <p className="text-gray-900 mt-1">
              {alerta.usuarioResuelve
                ? `${alerta.usuarioResuelve.nombres} ${alerta.usuarioResuelve.apellidos}`
                : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          Relaciones adicionales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">TPT Indicación</label>
            <p className="text-gray-900 mt-1">{alerta.tptIndicacion?.id || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Control Contacto</label>
            <p className="text-gray-900 mt-1">{alerta.controlContacto?.id || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Visita Domiciliaria</label>
            <p className="text-gray-900 mt-1">{alerta.visitaDomiciliaria?.id || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertaDetalle
