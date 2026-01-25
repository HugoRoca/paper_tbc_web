import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { integracionLogService } from '../services/integracionLogService'
import { ArrowLeft, AlertCircle, Plug, User, Globe, Database } from 'lucide-react'

const IntegracionLogDetalle = () => {
  const { id } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['integraciones-log', id],
    queryFn: () => integracionLogService.getById(id),
  })

  const log = data?.data

  const formatDateTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleString('es-PE')
  }

  const renderJson = (value) => {
    if (!value) return '-'
    return (
      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando log...</p>
        </div>
      </div>
    )
  }

  if (error || !log) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Registro no encontrado'}
          </p>
          <Link
            to="/integraciones-log"
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
      <div className="flex items-center gap-4">
        <Link to="/integraciones-log" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detalle de Integración</h2>
          <p className="text-gray-600 mt-1">Log #{log.id}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plug className="w-5 h-5 text-blue-600" />
          Información de la Integración
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Sistema</label>
            <p className="text-gray-900 mt-1">{log.sistema_externo}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Operación</label>
            <p className="text-gray-900 mt-1">{log.tipo_operacion}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <p className="text-gray-900 mt-1">{log.estado}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Endpoint</label>
            <p className="text-gray-900 mt-1 break-all">{log.endpoint || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Código Respuesta</label>
            <p className="text-gray-900 mt-1">{log.codigo_respuesta || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha</label>
            <p className="text-gray-900 mt-1">{formatDateTime(log.created_at)}</p>
          </div>
          {log.mensaje_error && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Mensaje de Error</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{log.mensaje_error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Usuario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nombre</label>
            <p className="text-gray-900 mt-1">
              {log.usuario ? `${log.usuario.nombres} ${log.usuario.apellidos}` : 'Sistema'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900 mt-1">{log.usuario?.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Usuario ID</label>
            <p className="text-gray-900 mt-1">{log.usuario?.id || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Metadatos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Sistema Externo</label>
            <p className="text-gray-900 mt-1">{log.sistema_externo}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo Operación</label>
            <p className="text-gray-900 mt-1">{log.tipo_operacion}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Datos enviados / recibidos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Datos Enviados</label>
            {renderJson(log.datos_enviados)}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Datos Recibidos</label>
            {renderJson(log.datos_recibidos)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegracionLogDetalle
