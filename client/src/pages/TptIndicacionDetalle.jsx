import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tptIndicacionService } from '../services/tptIndicacionService'
import { tptConsentimientoService } from '../services/tptConsentimientoService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Pill,
  User,
  Building,
  AlertCircle,
  FileText,
  Plus,
  Play,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const TptIndicacionDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['tpt-indicacion', id],
    queryFn: () => tptIndicacionService.getById(id),
  })

  const { data: consentimientoData } = useQuery({
    queryKey: ['tpt-consentimiento', 'tpt-indicacion', id],
    queryFn: () => tptConsentimientoService.getByTptIndicacion(id),
    enabled: !!id,
    retry: false,
  })

  const deleteMutation = useMutation({
    mutationFn: () => tptIndicacionService.delete(id),
    onSuccess: () => {
      toast.success('Indicación eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['tpt-indicaciones'] })
      navigate('/tpt-indicaciones')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar la indicación')
    },
  })

  const indicacion = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta indicación?')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando indicación...</p>
        </div>
      </div>
    )
  }

  if (error || !indicacion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Indicación no encontrada'}
          </p>
          <Link
            to="/tpt-indicaciones"
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
            to="/tpt-indicaciones"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Indicación TPT</h2>
            <p className="text-gray-600 mt-1">Estado: {indicacion.estado}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {indicacion.estado === 'Indicado' && (
            <Link
              to={`/tpt-indicaciones/${id}/iniciar`}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Iniciar TPT
            </Link>
          )}
          <Link
            to={`/tpt-indicaciones/${id}/editar`}
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
          <Pill className="w-5 h-5 text-blue-600" />
          Información de la Indicación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Esquema TPT</label>
            <p className="text-gray-900 mt-1">
              {indicacion.esquemaTpt?.nombre || 'Esquema'}
            </p>
            <p className="text-xs text-gray-500">{indicacion.esquemaTpt?.codigo || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Indicación</label>
            <p className="text-gray-900 mt-1">{formatDateLocal(indicacion.fecha_indicacion)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Inicio</label>
            <p className="text-gray-900 mt-1">
              {indicacion.fecha_inicio ? formatDateLocal(indicacion.fecha_inicio) : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha Fin Prevista</label>
            <p className="text-gray-900 mt-1">
              {indicacion.fecha_fin_prevista ? formatDateLocal(indicacion.fecha_fin_prevista) : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <p className="mt-1">
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                {indicacion.estado}
              </span>
            </p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Motivo de Indicación</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">
              {indicacion.motivo_indicacion || '-'}
            </p>
          </div>
          {indicacion.observaciones && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Observaciones</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{indicacion.observaciones}</p>
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
              {indicacion.contacto?.nombres} {indicacion.contacto?.apellidos}
            </p>
            <p className="text-sm text-gray-500 mt-1">DNI: {indicacion.contacto?.dni || '-'}</p>
          </div>
          {indicacion.contacto?.id && (
            <Link
              to={`/contactos/${indicacion.contacto.id}`}
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
            <p className="text-gray-900 mt-1">{indicacion.establecimiento?.nombre || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Registrado por</label>
            <p className="text-gray-900 mt-1">
              {indicacion.usuarioIndicacion
                ? `${indicacion.usuarioIndicacion.nombres} ${indicacion.usuarioIndicacion.apellidos}`
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de registro</label>
            <p className="text-gray-900 mt-1">
              {indicacion.created_at ? formatDateLocal(indicacion.created_at) : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Consentimiento Informado
          </h3>
          {consentimientoData?.data ? (
            <Link
              to={`/tpt-consentimientos/${consentimientoData.data.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Ver Consentimiento
            </Link>
          ) : (
            <Link
              to={`/tpt-consentimientos/nuevo?tpt_indicacion_id=${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Consentimiento
            </Link>
          )}
        </div>
        {consentimientoData?.data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Fecha de Consentimiento</label>
              <p className="text-gray-900 mt-1">
                {formatDateLocal(consentimientoData.data.fecha_consentimiento)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                    consentimientoData.data.consentimiento_firmado
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {consentimientoData.data.consentimiento_firmado ? 'Firmado' : 'No firmado'}
                </span>
              </p>
            </div>
            {consentimientoData.data.ruta_archivo_consentimiento && (
              <div>
                <label className="text-sm font-medium text-gray-500">Archivo</label>
                <p className="text-sm text-gray-900 mt-1 break-all">
                  {consentimientoData.data.ruta_archivo_consentimiento}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No se ha registrado un consentimiento informado para esta indicación.</p>
        )}
      </div>
    </div>
  )
}

export default TptIndicacionDetalle
