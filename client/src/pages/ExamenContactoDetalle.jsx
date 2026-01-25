import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { examenContactoService } from '../services/examenContactoService'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Stethoscope,
  FileText,
  Building,
  User,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const ExamenContactoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['examen-contacto', id],
    queryFn: () => examenContactoService.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => examenContactoService.delete(id),
    onSuccess: () => {
      toast.success('Examen eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['examenes-contacto'] })
      navigate('/examenes-contacto')
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar el examen')
    },
  })

  const examen = data?.data

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este examen?')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando examen...</p>
        </div>
      </div>
    )
  }

  if (error || !examen) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error?.response?.data?.message || 'Examen no encontrado'}</p>
          <Link
            to="/examenes-contacto"
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
            to="/examenes-contacto"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Examen</h2>
            <p className="text-gray-600 mt-1">Tipo: {examen.tipo_examen}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/examenes-contacto/${id}/editar`}
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
          <Stethoscope className="w-5 h-5 text-blue-600" />
          Información del Examen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha del Examen</label>
            <p className="text-gray-900 mt-1">{formatDateLocal(examen.fecha_examen)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo</label>
            <p className="mt-1">
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                {examen.tipo_examen}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Resultado Codificado</label>
            <p className="text-gray-900 mt-1">{examen.resultado_codificado || '-'}</p>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-500">Resultado</label>
            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{examen.resultado || '-'}</p>
          </div>
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
              {examen.contacto?.nombres} {examen.contacto?.apellidos}
            </p>
            <p className="text-sm text-gray-500 mt-1">DNI: {examen.contacto?.dni || '-'}</p>
          </div>
          {examen.contacto?.id && (
            <Link
              to={`/contactos/${examen.contacto.id}`}
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
            <p className="text-gray-900 mt-1">{examen.establecimiento?.nombre || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Registrado por</label>
            <p className="text-gray-900 mt-1">
              {examen.usuarioRegistro
                ? `${examen.usuarioRegistro.nombres} ${examen.usuarioRegistro.apellidos}`
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de registro</label>
            <p className="text-gray-900 mt-1">
              {examen.created_at ? formatDateLocal(examen.created_at) : '-'}
            </p>
          </div>
        </div>
      </div>

      {examen.observaciones && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Observaciones
          </h3>
          <p className="text-gray-900 whitespace-pre-wrap">{examen.observaciones}</p>
        </div>
      )}
    </div>
  )
}

export default ExamenContactoDetalle
