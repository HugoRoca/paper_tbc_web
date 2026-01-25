import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { derivacionTransferenciaService } from '../services/derivacionTransferenciaService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  ArrowRightLeft,
  Building,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const DerivacionTransferenciaDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['derivacion-transferencia', id],
    queryFn: () => derivacionTransferenciaService.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => derivacionTransferenciaService.delete(id),
    onSuccess: () => {
      toast.success('Derivación eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['derivaciones-transferencias'] })
      navigate('/derivaciones-transferencias')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar la derivación')
    },
  })

  const acceptMutation = useMutation({
    mutationFn: () => derivacionTransferenciaService.aceptar(id, {}),
    onSuccess: () => {
      toast.success('Derivación aceptada correctamente')
      queryClient.invalidateQueries({ queryKey: ['derivacion-transferencia', id] })
      queryClient.invalidateQueries({ queryKey: ['derivaciones-transferencias'] })
    },
    onError: (acceptError) => {
      toast.error(acceptError.response?.data?.message || 'Error al aceptar la derivación')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (motivo) => derivacionTransferenciaService.rechazar(id, { motivo }),
    onSuccess: () => {
      toast.success('Derivación rechazada correctamente')
      queryClient.invalidateQueries({ queryKey: ['derivacion-transferencia', id] })
      queryClient.invalidateQueries({ queryKey: ['derivaciones-transferencias'] })
    },
    onError: (rejectError) => {
      toast.error(rejectError.response?.data?.message || 'Error al rechazar la derivación')
    },
  })

  const derivacion = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta derivación?')) {
      deleteMutation.mutate()
    }
  }

  const handleAccept = () => {
    if (window.confirm('¿Aceptar esta derivación?')) {
      acceptMutation.mutate()
    }
  }

  const handleReject = () => {
    const motivo = window.prompt('Ingrese el motivo de rechazo')
    if (!motivo) return
    rejectMutation.mutate(motivo)
  }

  const estadoBadgeClass = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Aceptada':
        return 'bg-green-100 text-green-800'
      case 'Rechazada':
        return 'bg-red-100 text-red-800'
      case 'Completada':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando derivación...</p>
        </div>
      </div>
    )
  }

  if (error || !derivacion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Derivación no encontrada'}
          </p>
          <Link
            to="/derivaciones-transferencias"
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
            to="/derivaciones-transferencias"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Derivación</h2>
            <p className="text-gray-600 mt-1">Tipo: {derivacion.tipo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {derivacion.estado === 'Pendiente' && (
            <>
              <button
                onClick={handleAccept}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Aceptar
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Rechazar
              </button>
            </>
          )}
          <Link
            to={`/derivaciones-transferencias/${id}/editar`}
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
          <ArrowRightLeft className="w-5 h-5 text-blue-600" />
          Información de la Derivación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo</label>
            <p className="text-gray-900 mt-1">{derivacion.tipo}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <span
              className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${estadoBadgeClass(
                derivacion.estado,
              )}`}
            >
              {derivacion.estado}
            </span>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Solicitud</label>
            <p className="text-gray-900 mt-1">{formatDateLocal(derivacion.fecha_solicitud)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Aceptación</label>
            <p className="text-gray-900 mt-1">
              {derivacion.fecha_aceptacion ? formatDateLocal(derivacion.fecha_aceptacion) : '-'}
            </p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Motivo</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{derivacion.motivo}</p>
          </div>
          {derivacion.observaciones && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Observaciones</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{derivacion.observaciones}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Contacto Asociado
        </h3>
        <div className="flex items-center justify-between">
          <div>
            {derivacion.contacto ? (
              <>
                <p className="text-gray-900 font-medium">
                  {derivacion.contacto.nombres} {derivacion.contacto.apellidos}
                </p>
                <p className="text-sm text-gray-500 mt-1">DNI: {derivacion.contacto.dni || '-'}</p>
              </>
            ) : (
              <p className="text-gray-500">No asociado</p>
            )}
          </div>
          {derivacion.contacto?.id && (
            <Link
              to={`/contactos/${derivacion.contacto.id}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver Contacto
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Establecimientos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Origen</label>
            <p className="text-gray-900 mt-1">{derivacion.establecimientoOrigen?.nombre || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Destino</label>
            <p className="text-gray-900 mt-1">
              {derivacion.establecimientoDestino?.nombre || '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Usuarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Solicitado por</label>
            <p className="text-gray-900 mt-1">
              {derivacion.usuarioSolicita
                ? `${derivacion.usuarioSolicita.nombres} ${derivacion.usuarioSolicita.apellidos}`
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Aceptado por</label>
            <p className="text-gray-900 mt-1">
              {derivacion.usuarioAcepta
                ? `${derivacion.usuarioAcepta.nombres} ${derivacion.usuarioAcepta.apellidos}`
                : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DerivacionTransferenciaDetalle
