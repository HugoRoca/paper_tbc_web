import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactoService } from '../services/contactoService'
import { examenContactoService } from '../services/examenContactoService'
import { controlContactoService } from '../services/controlContactoService'
import { tptIndicacionService } from '../services/tptIndicacionService'
import { visitaDomiciliariaService } from '../services/visitaDomiciliariaService'
import { derivacionTransferenciaService } from '../services/derivacionTransferenciaService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  FileText,
  Stethoscope,
  ClipboardCheck,
  Pill,
  Home,
  ArrowRightLeft,
  Building,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal, parseLocalDate } from '../utils/date'

const ContactoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: contactoData, isLoading, error } = useQuery({
    queryKey: ['contacto', id],
    queryFn: () => contactoService.getById(id),
  })

  const { data: examenesData, isLoading: examenesLoading } = useQuery({
    queryKey: ['examenes-contacto', 'contacto', id],
    queryFn: () => examenContactoService.getByContacto(id),
    enabled: !!id,
  })

  const { data: controlesData, isLoading: controlesLoading } = useQuery({
    queryKey: ['controles-contacto', 'contacto', id],
    queryFn: () => controlContactoService.getByContacto(id),
    enabled: !!id,
  })

  const { data: tptData, isLoading: tptLoading } = useQuery({
    queryKey: ['tpt-indicaciones', 'contacto', id],
    queryFn: () => tptIndicacionService.getByContacto(id),
    enabled: !!id,
  })

  const { data: visitasData, isLoading: visitasLoading } = useQuery({
    queryKey: ['visitas-domiciliarias', 'contacto', id],
    queryFn: () => visitaDomiciliariaService.getByContacto(id),
    enabled: !!id,
  })

  const { data: derivacionesData, isLoading: derivacionesLoading } = useQuery({
    queryKey: ['derivaciones-transferencias', 'contacto', id],
    queryFn: () => derivacionTransferenciaService.getByContacto(id),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => contactoService.delete(id),
    onSuccess: () => {
      toast.success('Contacto eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['contactos'] })
      navigate('/contactos')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar el contacto')
    },
  })

  const contacto = contactoData?.data
  const examenes = examenesData?.data || []
  const controles = controlesData?.data || []
  const tptIndicaciones = tptData?.data || []
  const visitas = visitasData?.data || []
  const derivaciones = derivacionesData?.data || []

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '-'
    const nacimiento = parseLocalDate(fechaNacimiento)
    if (!nacimiento) return '-'
    const hoy = new Date()
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar el contacto de ${contacto?.nombres} ${contacto?.apellidos}?`
      )
    ) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contacto...</p>
        </div>
      </div>
    )
  }

  if (error || !contacto) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Contacto no encontrado'}
          </p>
          <Link
            to="/contactos"
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/contactos" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {contacto.nombres} {contacto.apellidos}
            </h2>
            <p className="text-gray-600 mt-1">DNI: {contacto.dni || '-'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/contactos/${id}/editar`}
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

      {/* Información del contacto */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Información del Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
            <p className="text-gray-900 mt-1">
              {contacto.fecha_nacimiento
                ? `${formatDateLocal(contacto.fecha_nacimiento)} (${calcularEdad(
                    contacto.fecha_nacimiento
                  )} años)`
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Sexo</label>
            <p className="text-gray-900 mt-1">{contacto.sexo || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo de Contacto</label>
            <p className="mt-1">
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                {contacto.tipo_contacto}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Parentesco</label>
            <p className="text-gray-900 mt-1">{contacto.parentesco || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Teléfono</label>
            <p className="text-gray-900 mt-1">{contacto.telefono || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
            <p className="text-gray-900 mt-1">
              {contacto.fecha_registro ? formatDateLocal(contacto.fecha_registro) : '-'}
            </p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Dirección</label>
            <p className="text-gray-900 mt-1">{contacto.direccion || '-'}</p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Establecimiento</label>
            <p className="text-gray-900 mt-1 flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              {contacto.establecimiento?.nombre || '-'}
            </p>
          </div>
          {contacto.observaciones && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-500">Observaciones</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{contacto.observaciones}</p>
            </div>
          )}
        </div>
      </div>

      {/* Relación con Caso Índice */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Caso Índice Relacionado
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900 font-medium">
              {contacto.casoIndice
                ? `${contacto.casoIndice.paciente_nombres} ${contacto.casoIndice.paciente_apellidos}`
                : 'No asignado'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Código: {contacto.casoIndice?.codigo_caso || '-'}
            </p>
          </div>
          {contacto.casoIndice?.id && (
            <Link
              to={`/casos-indice/${contacto.casoIndice.id}`}
              state={{ from: `/contactos/${id}` }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver Caso
            </Link>
          )}
        </div>
      </div>

      {/* Exámenes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Exámenes ({examenes.length})
          </h3>
          <Link
            to={`/examenes-contacto/nuevo?contacto_id=${id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Agregar Examen
          </Link>
        </div>
        {examenesLoading ? (
          <p className="text-sm text-gray-500">Cargando exámenes...</p>
        ) : examenes.length === 0 ? (
          <p className="text-sm text-gray-500">No hay exámenes registrados</p>
        ) : (
          <div className="space-y-2">
            {examenes.map((examen) => (
              <Link
                key={examen.id}
                to={`/examenes-contacto/${examen.id}`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {examen.tipo_examen} - {formatDateLocal(examen.fecha_examen)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {examen.establecimiento?.nombre || 'Sin establecimiento'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {examen.resultado_codificado || 'Ver detalle'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            Controles ({controles.length})
          </h3>
          <Link
            to={`/controles-contacto/nuevo?contacto_id=${id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Agregar Control
          </Link>
        </div>
        {controlesLoading ? (
          <p className="text-sm text-gray-500">Cargando controles...</p>
        ) : controles.length === 0 ? (
          <p className="text-sm text-gray-500">No hay controles registrados</p>
        ) : (
          <div className="space-y-2">
            {controles.map((control) => (
              <Link
                key={control.id}
                to={`/controles-contacto/${control.id}`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Control #{control.numero_control} - {control.tipo_control}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Programado: {formatDateLocal(control.fecha_programada)} · Estado: {control.estado}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {control.fecha_realizada ? formatDateLocal(control.fecha_realizada) : 'Pendiente'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Indicaciones TPT */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            Indicaciones TPT ({tptIndicaciones.length})
          </h3>
          <Link
            to={`/tpt-indicaciones/nuevo?contacto_id=${id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Agregar Indicación
          </Link>
        </div>
        {tptLoading ? (
          <p className="text-sm text-gray-500">Cargando indicaciones...</p>
        ) : tptIndicaciones.length === 0 ? (
          <p className="text-sm text-gray-500">No hay indicaciones TPT</p>
        ) : (
          <div className="space-y-2">
            {tptIndicaciones.map((indicacion) => (
              <Link
                key={indicacion.id}
                to={`/tpt-indicaciones/${indicacion.id}`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {indicacion.esquemaTpt?.nombre || 'Esquema TPT'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Indicada: {formatDateLocal(indicacion.fecha_indicacion)} · Estado: {indicacion.estado}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {indicacion.fecha_inicio ? formatDateLocal(indicacion.fecha_inicio) : 'Sin inicio'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Visitas domiciliarias */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            Visitas Domiciliarias ({visitas.length})
          </h3>
          <Link
            to={`/visitas-domiciliarias/nuevo?contacto_id=${id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Agregar Visita
          </Link>
        </div>
        {visitasLoading ? (
          <p className="text-sm text-gray-500">Cargando visitas...</p>
        ) : visitas.length === 0 ? (
          <p className="text-sm text-gray-500">No hay visitas registradas</p>
        ) : (
          <div className="space-y-2">
            {visitas.map((visita) => (
              <Link
                key={visita.id}
                to={`/visitas-domiciliarias/${visita.id}`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {visita.tipo_visita} - {formatDateLocal(visita.fecha_visita)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Resultado: {visita.resultado_visita} · {visita.establecimiento?.nombre || '-'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{visita.hora_visita || ''}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Derivaciones/Transferencias */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            Derivaciones/Transferencias ({derivaciones.length})
          </h3>
          <Link
            to={`/derivaciones-transferencias/nuevo?contacto_id=${id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Agregar
          </Link>
        </div>
        {derivacionesLoading ? (
          <p className="text-sm text-gray-500">Cargando derivaciones...</p>
        ) : derivaciones.length === 0 ? (
          <p className="text-sm text-gray-500">No hay derivaciones registradas</p>
        ) : (
          <div className="space-y-2">
            {derivaciones.map((derivacion) => (
              <Link
                key={derivacion.id}
                to={`/derivaciones-transferencias/${derivacion.id}`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {derivacion.tipo} · {formatDateLocal(derivacion.fecha_solicitud)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {derivacion.establecimientoOrigen?.nombre || '-'} →{' '}
                      {derivacion.establecimientoDestino?.nombre || '-'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{derivacion.estado}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactoDetalle
