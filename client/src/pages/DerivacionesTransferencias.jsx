import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { derivacionTransferenciaService } from '../services/derivacionTransferenciaService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const DerivacionesTransferencias = () => {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    contacto_id: '',
    tipo: '',
    estado: '',
    establecimiento_origen_id: '',
    establecimiento_destino_id: '',
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['derivaciones-transferencias', page, limit, filters],
    queryFn: () => {
      const params = {
        page,
        limit,
        ...filters,
      }

      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })

      return derivacionTransferenciaService.list(params)
    },
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => derivacionTransferenciaService.delete(id),
    onSuccess: () => {
      toast.success('Derivación eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['derivaciones-transferencias'] })
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar la derivación')
    },
  })

  const acceptMutation = useMutation({
    mutationFn: (id) => derivacionTransferenciaService.aceptar(id, {}),
    onSuccess: () => {
      toast.success('Derivación aceptada correctamente')
      queryClient.invalidateQueries({ queryKey: ['derivaciones-transferencias'] })
    },
    onError: (acceptError) => {
      toast.error(acceptError.response?.data?.message || 'Error al aceptar la derivación')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, motivo }) => derivacionTransferenciaService.rechazar(id, { motivo }),
    onSuccess: () => {
      toast.success('Derivación rechazada correctamente')
      queryClient.invalidateQueries({ queryKey: ['derivaciones-transferencias'] })
    },
    onError: (rejectError) => {
      toast.error(rejectError.response?.data?.message || 'Error al rechazar la derivación')
    },
  })

  const derivaciones = data?.data || []
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 }

  const filteredDerivaciones = useMemo(() => {
    if (!searchTerm) return derivaciones
    const term = searchTerm.toLowerCase()
    return derivaciones.filter((derivacion) => {
      const contacto = derivacion.contacto
      const contactoName = `${contacto?.nombres || ''} ${contacto?.apellidos || ''}`.toLowerCase()
      const contactoDni = (contacto?.dni || '').toLowerCase()
      const origen = (derivacion.establecimientoOrigen?.nombre || '').toLowerCase()
      const destino = (derivacion.establecimientoDestino?.nombre || '').toLowerCase()
      const tipo = (derivacion.tipo || '').toLowerCase()
      return (
        contactoName.includes(term) ||
        contactoDni.includes(term) ||
        origen.includes(term) ||
        destino.includes(term) ||
        tipo.includes(term)
      )
    })
  }, [derivaciones, searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      contacto_id: '',
      tipo: '',
      estado: '',
      establecimiento_origen_id: '',
      establecimiento_destino_id: '',
    })
    setSearchTerm('')
    setPage(1)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta derivación?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleAccept = (id) => {
    if (window.confirm('¿Aceptar esta derivación?')) {
      acceptMutation.mutate(id)
    }
  }

  const handleReject = (id) => {
    const motivo = window.prompt('Ingrese el motivo de rechazo')
    if (!motivo) return
    rejectMutation.mutate({ id, motivo })
  }

  const tipos = ['Derivación', 'Transferencia']
  const estados = ['Pendiente', 'Aceptada', 'Rechazada', 'Completada']

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Aceptada':
        return 'bg-green-100 text-green-800'
      case 'Rechazada':
        return 'bg-red-100 text-red-800'
      case 'Completada':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando derivaciones...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">Error al cargar derivaciones: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Derivaciones/Transferencias</h2>
          <p className="text-gray-600 mt-1">Gestión de referencias entre establecimientos</p>
        </div>
        <Link
          to="/derivaciones-transferencias/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Derivación
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por contacto, DNI o establecimiento..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </form>

        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contacto (ID)</label>
                <input
                  type="number"
                  value={filters.contacto_id}
                  onChange={(e) => handleFilterChange('contacto_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={filters.tipo}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {tipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Establecimiento Origen
                </label>
                <select
                  value={filters.establecimiento_origen_id}
                  onChange={(e) => handleFilterChange('establecimiento_origen_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {establecimientosData?.data?.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Establecimiento Destino
                </label>
                <select
                  value={filters.establecimiento_destino_id}
                  onChange={(e) => handleFilterChange('establecimiento_destino_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {establecimientosData?.data?.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end md:col-span-5">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Total: {pagination.total} derivación{pagination.total !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        {filteredDerivaciones.length === 0 ? (
          <div className="text-center py-8">
            <ArrowRightLeft className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No se encontraron derivaciones</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDerivaciones.map((derivacion) => (
                  <tr key={derivacion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {derivacion.contacto
                          ? `${derivacion.contacto.nombres} ${derivacion.contacto.apellidos}`
                          : '-'}
                      </div>
                      <div className="text-xs text-gray-500">{derivacion.contacto?.dni || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{derivacion.tipo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoClass(
                          derivacion.estado,
                        )}`}
                      >
                        {derivacion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {derivacion.establecimientoOrigen?.nombre || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {derivacion.establecimientoDestino?.nombre || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {formatDateLocal(derivacion.fecha_solicitud)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/derivaciones-transferencias/${derivacion.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/derivaciones-transferencias/${derivacion.id}/editar`}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {derivacion.estado === 'Pendiente' && (
                          <>
                            <button
                              onClick={() => handleAccept(derivacion.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Aceptar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(derivacion.id)}
                              className="text-orange-600 hover:text-orange-900 p-1"
                              title="Rechazar"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(derivacion.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Página {pagination.page} de {pagination.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DerivacionesTransferencias
