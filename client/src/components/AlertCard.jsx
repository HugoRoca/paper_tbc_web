import { AlertTriangle, User, Users, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const AlertCard = ({ alerta }) => {
  const severidadColors = {
    baja: 'bg-blue-100 text-blue-800 border-blue-200',
    media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    alta: 'bg-red-100 text-red-800 border-red-200',
    critica: 'bg-red-200 text-red-900 border-red-300',
  }

  const tipoLabels = {
    control_pendiente: 'Control Pendiente',
    tpt_atrasado: 'TPT Atrasado',
    derivacion_pendiente: 'Derivación Pendiente',
    contacto_sin_examen: 'Contacto Sin Examen',
  }

  const getSeveridadColor = (severidad) => {
    return severidadColors[severidad?.toLowerCase()] || severidadColors.media
  }

  const getTipoLabel = (tipo) => {
    return tipoLabels[tipo] || tipo
  }

  const getLink = () => {
    if (alerta.contacto_id) {
      return `/contactos/${alerta.contacto_id}`
    }
    if (alerta.caso_indice_id) {
      return `/casos-indice/${alerta.caso_indice_id}`
    }
    return '/alertas'
  }

  return (
    <Link
      to={getLink()}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-gray-900">{getTipoLabel(alerta.tipo_alerta)}</h4>
            <span
              className={`px-2 py-1 text-xs font-medium rounded border ${getSeveridadColor(
                alerta.severidad
              )}`}
            >
              {alerta.severidad || 'Media'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{alerta.descripcion}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {alerta.contacto_id && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Contacto #{alerta.contacto_id}</span>
              </div>
            )}
            {alerta.caso_indice_id && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Caso #{alerta.caso_indice_id}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(alerta.fecha_generacion).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AlertCard
