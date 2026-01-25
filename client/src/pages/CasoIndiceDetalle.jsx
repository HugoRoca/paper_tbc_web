import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { casoIndiceService } from '../services/casoIndiceService'
import { contactoService } from '../services/contactoService'
import { visitaDomiciliariaService } from '../services/visitaDomiciliariaService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Home,
  Calendar,
  FileText,
  User,
  MapPin,
  Phone,
  Building,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal, parseLocalDate } from '../utils/date'

const CasoIndiceDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  // Consultar caso índice
  const { data: casoData, isLoading: casoLoading, error: casoError } = useQuery({
    queryKey: ['caso-indice', id],
    queryFn: () => casoIndiceService.getById(id),
  })

  // Consultar contactos asociados
  const { data: contactosData, isLoading: contactosLoading } = useQuery({
    queryKey: ['contactos', 'caso-indice', id],
    queryFn: () => contactoService.getByCasoIndice(id),
    enabled: !!id,
  })

  // Consultar visitas domiciliarias
  const { data: visitasData, isLoading: visitasLoading } = useQuery({
    queryKey: ['visitas-domiciliarias', 'caso-indice', id],
    queryFn: () => visitaDomiciliariaService.getByCasoIndice(id),
    enabled: !!id,
  })

  // Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: () => casoIndiceService.delete(id),
    onSuccess: () => {
      toast.success('Caso índice eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['casos-indice'] })
      navigate('/casos-indice')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el caso índice')
    },
  })

  const caso = casoData?.data
  const contactos = contactosData?.data || []
  const visitas = visitasData?.data || []

  // Confirmar eliminación
  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar el caso índice de ${caso?.paciente_nombres} ${caso?.paciente_apellidos}?`
      )
    ) {
      deleteMutation.mutate()
    }
  }

  if (casoLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando caso índice...</p>
        </div>
      </div>
    )
  }

  const backLink = location.state?.from || '/casos-indice'

  if (casoError || !caso) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {casoError?.response?.data?.message || 'Caso índice no encontrado'}
          </p>
          <Link
            to={backLink}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  // Calcular edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '-'
    const hoy = new Date()
    const nacimiento = parseLocalDate(fechaNacimiento)
    if (!nacimiento) return '-'
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={backLink} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {caso.paciente_nombres} {caso.paciente_apellidos}
            </h2>
            <p className="text-gray-600 mt-1">Código: {caso.codigo_caso}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/casos-indice/${id}/editar`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Paciente */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Información del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombres</label>
                <p className="text-gray-900 mt-1">{caso.paciente_nombres}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Apellidos</label>
                <p className="text-gray-900 mt-1">{caso.paciente_apellidos}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">DNI</label>
                <p className="text-gray-900 mt-1">{caso.paciente_dni || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                <p className="text-gray-900 mt-1">
                  {caso.fecha_nacimiento
                    ? `${formatDateLocal(caso.fecha_nacimiento)} (${calcularEdad(caso.fecha_nacimiento)} años)`
                    : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Sexo</label>
                <p className="text-gray-900 mt-1">{caso.sexo || '-'}</p>
              </div>
            </div>
          </div>

          {/* Datos Clínicos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Datos Clínicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo de TB</label>
                <p className="mt-1">
                  <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                    {caso.tipo_tb}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Diagnóstico</label>
                <p className="text-gray-900 mt-1">
                  {caso.fecha_diagnostico ? formatDateLocal(caso.fecha_diagnostico) : '-'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Establecimiento de Salud</label>
                <p className="text-gray-900 mt-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  {caso.establecimiento?.nombre || '-'}
                </p>
              </div>
              {caso.observaciones && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Observaciones</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{caso.observaciones}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contactos Asociados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Contactos Asociados ({contactos.length})
              </h3>
              <Link
                to={`/contactos/nuevo?caso_indice_id=${id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Agregar Contacto
              </Link>
            </div>
            {contactosLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Cargando contactos...</p>
              </div>
            ) : contactos.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay contactos asociados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactos.map((contacto) => (
                  <Link
                    key={contacto.id}
                    to={`/contactos/${contacto.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {contacto.nombres} {contacto.apellidos}
                          </h4>
                          <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                            {contacto.tipo_contacto}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {contacto.dni && <span>DNI: {contacto.dni}</span>}
                          {contacto.parentesco && <span>Parentesco: {contacto.parentesco}</span>}
                          {contacto.telefono && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {contacto.telefono}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Visitas Domiciliarias */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Visitas Domiciliarias ({visitas.length})
              </h3>
              <Link
                to={`/visitas-domiciliarias/nuevo?caso_indice_id=${id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Agregar Visita
              </Link>
            </div>
            {visitasLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Cargando visitas...</p>
              </div>
            ) : visitas.length === 0 ? (
              <div className="text-center py-8">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay visitas domiciliarias registradas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visitas.map((visita) => (
                  <Link
                    key={visita.id}
                    to={`/visitas-domiciliarias/${visita.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {visita.fecha_visita ? formatDateLocal(visita.fecha_visita) : '-'}
                          </span>
                        </div>
                        {visita.observaciones && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {visita.observaciones}
                          </p>
                        )}
                        {visita.establecimiento && (
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {visita.establecimiento.nombre}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna lateral - Información adicional */}
        <div className="space-y-6">
          {/* Información de Registro */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Registro</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Registrado por</label>
                <p className="text-gray-900 mt-1">
                  {caso.usuario_registro?.nombres} {caso.usuario_registro?.apellidos}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                <p className="text-gray-900 mt-1">
                  {caso.created_at ? formatDateLocal(caso.created_at) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      caso.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {caso.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Contactos</span>
                <span className="text-lg font-semibold text-gray-900">{contactos.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Visitas Realizadas</span>
                <span className="text-lg font-semibold text-gray-900">{visitas.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CasoIndiceDetalle
