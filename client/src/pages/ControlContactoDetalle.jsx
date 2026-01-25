import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { controlContactoService } from '../services/controlContactoService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  ClipboardCheck,
  Building,
  User,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal, toInputDate } from '../utils/date'

const ControlContactoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['control-contacto', id],
    queryFn: () => controlContactoService.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => controlContactoService.delete(id),
    onSuccess: () => {
      toast.success('Control eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['controles-contacto'] })
      navigate('/controles-contacto')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar el control')
    },
  })

  const marcarRealizadoMutation = useMutation({
    mutationFn: (payload) => controlContactoService.marcarRealizado(id, payload),
    onSuccess: () => {
      toast.success('Control marcado como realizado')
      queryClient.invalidateQueries({ queryKey: ['control-contacto', id] })
      queryClient.invalidateQueries({ queryKey: ['controles-contacto'] })
    },
    onError: (markError) => {
      toast.error(markError.response?.data?.message || 'Error al marcar como realizado')
    },
  })

  const control = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este control?')) {
      deleteMutation.mutate()
    }
  }

  const handleMarkDone = () => {
    if (control?.estado === 'Realizado') return
    const today = toInputDate(new Date())
    marcarRealizadoMutation.mutate({ resultado: control?.resultado || '', fecha_realizada: today })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando control...</p>
        </div>
      </div>
    )
  }

  if (error || !control) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error?.response?.data?.message || 'Control no encontrado'}</p>
          <Link
            to="/controles-contacto"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  const fechaProgramada = formatDateLocal(control.fecha_programada)
  const fechaRealizada = control.fecha_realizada ? formatDateLocal(control.fecha_realizada) : '-'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/controles-contacto"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Control</h2>
            <p className="text-gray-600 mt-1">Control #{control.numero_control}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkDone}
            disabled={control.estado === 'Realizado' || marcarRealizadoMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            Marcar Realizado
          </button>
          <Link
            to={`/controles-contacto/${id}/editar`}
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
          <ClipboardCheck className="w-5 h-5 text-blue-600" />
          Información del Control
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo de Control</label>
            <p className="text-gray-900 mt-1">{control.tipo_control}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <p className="mt-1">
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                {control.estado}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Resultado</label>
            <p className="text-gray-900 mt-1">{control.resultado || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Programada</label>
            <p className="text-gray-900 mt-1">{fechaProgramada}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Realizada</label>
            <p className="text-gray-900 mt-1">{fechaRealizada}</p>
          </div>
          {control.observaciones && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Observaciones</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{control.observaciones}</p>
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
            <p className="text-gray-900 font-medium">
              {control.contacto?.nombres} {control.contacto?.apellidos}
            </p>
            <p className="text-sm text-gray-500 mt-1">DNI: {control.contacto?.dni || '-'}</p>
          </div>
          {control.contacto?.id && (
            <Link
              to={`/contactos/${control.contacto.id}`}
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
          Establecimiento y Registro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Establecimiento</label>
            <p className="text-gray-900 mt-1">{control.establecimiento?.nombre || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Programado por</label>
            <p className="text-gray-900 mt-1">
              {control.usuarioPrograma
                ? `${control.usuarioPrograma.nombres} ${control.usuarioPrograma.apellidos}`
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Realizado por</label>
            <p className="text-gray-900 mt-1">
              {control.usuarioRealiza
                ? `${control.usuarioRealiza.nombres} ${control.usuarioRealiza.apellidos}`
                : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlContactoDetalle
