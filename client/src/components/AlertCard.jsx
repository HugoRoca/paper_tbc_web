import { AlertTriangle, User, Users, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDateLocal } from '../utils/date'
import Badge from './Badge'

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

  const severidadVariant = {
    baja: 'primary',
    media: 'warning',
    alta: 'danger',
    critica: 'danger',
  }[alerta.severidad?.toLowerCase()] || 'warning'

  return (
    <Link
      to={getLink()}
      className="block bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-red-300 group"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${
          alerta.severidad === 'critica' || alerta.severidad === 'alta'
            ? 'bg-red-100'
            : alerta.severidad === 'media'
            ? 'bg-yellow-100'
            : 'bg-blue-100'
        }`}>
          <AlertTriangle className={`w-6 h-6 ${
            alerta.severidad === 'critica' || alerta.severidad === 'alta'
              ? 'text-red-600'
              : alerta.severidad === 'media'
              ? 'text-yellow-600'
              : 'text-blue-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
              {getTipoLabel(alerta.tipo_alerta)}
            </h4>
            <Badge variant={severidadVariant}>
              {alerta.severidad || 'Media'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {alerta.descripcion}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            {alerta.contacto_id && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">Contacto #{alerta.contacto_id}</span>
              </div>
            )}
            {alerta.caso_indice_id && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">Caso #{alerta.caso_indice_id}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{formatDateLocal(alerta.fecha_generacion)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AlertCard
