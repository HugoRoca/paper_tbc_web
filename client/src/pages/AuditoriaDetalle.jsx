import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { auditoriaService } from '../services/auditoriaService'
import { ArrowLeft, AlertCircle, FileText, User, Globe, Database } from 'lucide-react'

const AuditoriaDetalle = () => {
  const { id } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['auditoria', id],
    queryFn: () => auditoriaService.getById(id),
  })

  const registro = data?.data

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
          <p className="text-gray-600">Cargando auditoría...</p>
        </div>
      </div>
    )
  }

  if (error || !registro) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Registro no encontrado'}
          </p>
          <Link
            to="/auditoria"
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
        <Link to="/auditoria" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detalle de Auditoría</h2>
          <p className="text-gray-600 mt-1">Registro #{registro.id}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Información de la Acción
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Acción</label>
            <p className="text-gray-900 mt-1">{registro.accion}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tabla afectada</label>
            <p className="text-gray-900 mt-1">{registro.tabla_afectada}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Registro ID</label>
            <p className="text-gray-900 mt-1">{registro.registro_id || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de acción</label>
            <p className="text-gray-900 mt-1">{formatDateTime(registro.fecha_accion)}</p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Observaciones</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">
              {registro.observaciones || '-'}
            </p>
          </div>
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
              {registro.usuario
                ? `${registro.usuario.nombres} ${registro.usuario.apellidos}`
                : 'Sistema'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900 mt-1">{registro.usuario?.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Usuario ID</label>
            <p className="text-gray-900 mt-1">{registro.usuario?.id || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Contexto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">IP</label>
            <p className="text-gray-900 mt-1">{registro.ip_address || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">User Agent</label>
            <p className="text-gray-900 mt-1">{registro.user_agent || '-'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Datos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Datos Anteriores</label>
            {renderJson(registro.datos_anteriores)}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Datos Nuevos</label>
            {renderJson(registro.datos_nuevos)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuditoriaDetalle
