import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { visitaDomiciliariaService } from '../services/visitaDomiciliariaService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Home,
  MapPin,
  Building,
  AlertCircle,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const VisitaDomiciliariaDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['visita-domiciliaria', id],
    queryFn: () => visitaDomiciliariaService.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => visitaDomiciliariaService.delete(id),
    onSuccess: () => {
      toast.success('Visita eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['visitas-domiciliarias'] })
      navigate('/visitas-domiciliarias')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar la visita')
    },
  })

  const visita = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta visita?')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando visita...</p>
        </div>
      </div>
    )
  }

  if (error || !visita) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Visita no encontrada'}
          </p>
          <Link
            to="/visitas-domiciliarias"
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
            to="/visitas-domiciliarias"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Visita Domiciliaria</h2>
            <p className="text-gray-600 mt-1">Tipo: {visita.tipo_visita}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/visitas-domiciliarias/${id}/editar`}
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
          <Home className="w-5 h-5 text-blue-600" />
          Información de la Visita
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Visita</label>
            <p className="text-gray-900 mt-1">{formatDateLocal(visita.fecha_visita)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Programada</label>
            <p className="text-gray-900 mt-1">
              {visita.fecha_programada ? formatDateLocal(visita.fecha_programada) : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Hora de Visita</label>
            <p className="text-gray-900 mt-1">{visita.hora_visita || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo de Visita</label>
            <p className="text-gray-900 mt-1">{visita.tipo_visita}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Resultado</label>
            <p className="text-gray-900 mt-1">{visita.resultado_visita}</p>
          </div>
          {visita.motivo_no_realizada && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Motivo No Realizada</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{visita.motivo_no_realizada}</p>
            </div>
          )}
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Dirección de Visita</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{visita.direccion_visita}</p>
          </div>
          {visita.observaciones && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Observaciones</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{visita.observaciones}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Contacto / Caso Índice
        </h3>
        <div className="flex items-center justify-between">
          <div>
            {visita.contacto ? (
              <>
                <p className="text-gray-900 font-medium">
                  {visita.contacto.nombres} {visita.contacto.apellidos}
                </p>
                <p className="text-sm text-gray-500 mt-1">DNI: {visita.contacto.dni || '-'}</p>
              </>
            ) : visita.casoIndice ? (
              <>
                <p className="text-gray-900 font-medium">
                  {visita.casoIndice.paciente_nombres} {visita.casoIndice.paciente_apellidos}
                </p>
                <p className="text-sm text-gray-500 mt-1">Código: {visita.casoIndice.codigo_caso}</p>
              </>
            ) : (
              <p className="text-gray-500">No asociado</p>
            )}
          </div>
          {visita.contacto?.id && (
            <Link
              to={`/contactos/${visita.contacto.id}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver Contacto
            </Link>
          )}
          {visita.casoIndice?.id && (
            <Link
              to={`/casos-indice/${visita.casoIndice.id}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver Caso
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
            <p className="text-gray-900 mt-1">{visita.establecimiento?.nombre || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Registrado por</label>
            <p className="text-gray-900 mt-1">
              {visita.usuarioVisita
                ? `${visita.usuarioVisita.nombres} ${visita.usuarioVisita.apellidos}`
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de registro</label>
            <p className="text-gray-900 mt-1">
              {visita.created_at ? formatDateLocal(visita.created_at) : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisitaDomiciliariaDetalle
