import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { visitaDomiciliariaService } from '../services/visitaDomiciliariaService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Home,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const VisitasDomiciliarias = () => {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    contacto_id: '',
    caso_indice_id: '',
    tipo_visita: '',
    resultado_visita: '',
    establecimiento_id: '',
    fecha_visita_desde: '',
    fecha_visita_hasta: '',
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['visitas-domiciliarias', page, limit, filters],
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

      return visitaDomiciliariaService.list(params)
    },
  })

  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => visitaDomiciliariaService.delete(id),
    onSuccess: () => {
      toast.success('Visita eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['visitas-domiciliarias'] })
    },
    onError: (deleteError) => {
      toast.error(deleteError.response?.data?.message || 'Error al eliminar la visita')
    },
  })

  const visitas = data?.data || []
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 }

  const filteredVisitas = useMemo(() => {
    if (!searchTerm) return visitas
    const term = searchTerm.toLowerCase()
    return visitas.filter((visita) => {
      const contacto = visita.contacto
      const caso = visita.casoIndice
      const contactoName = `${contacto?.nombres || ''} ${contacto?.apellidos || ''}`.toLowerCase()
      const casoCodigo = (caso?.codigo_caso || '').toLowerCase()
      return contactoName.includes(term) || casoCodigo.includes(term)
    })
  }, [visitas, searchTerm])

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
      caso_indice_id: '',
      tipo_visita: '',
      resultado_visita: '',
      establecimiento_id: '',
      fecha_visita_desde: '',
      fecha_visita_hasta: '',
    })
    setSearchTerm('')
    setPage(1)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta visita?')) {
      deleteMutation.mutate(id)
    }
  }

  const tiposVisita = ['Primer contacto', 'Seguimiento']
  const resultadosVisita = ['Realizada', 'No realizada', 'Reagendada']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando visitas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">Error al cargar visitas: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visitas Domiciliarias</h2>
          <p className="text-gray-600 mt-1">Seguimiento domiciliario de contactos y casos</p>
        </div>
        <Link
          to="/visitas-domiciliarias/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Visita
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por contacto o código de caso..."
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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Caso Índice (ID)</label>
                <input
                  type="number"
                  value={filters.caso_indice_id}
                  onChange={(e) => handleFilterChange('caso_indice_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Visita</label>
                <select
                  value={filters.tipo_visita}
                  onChange={(e) => handleFilterChange('tipo_visita', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {tiposVisita.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
                <select
                  value={filters.resultado_visita}
                  onChange={(e) => handleFilterChange('resultado_visita', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {resultadosVisita.map((resultado) => (
                    <option key={resultado} value={resultado}>
                      {resultado}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Establecimiento</label>
                <select
                  value={filters.establecimiento_id}
                  onChange={(e) => handleFilterChange('establecimiento_id', e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                <input
                  type="date"
                  value={filters.fecha_visita_desde}
                  onChange={(e) => handleFilterChange('fecha_visita_desde', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                <input
                  type="date"
                  value={filters.fecha_visita_hasta}
                  onChange={(e) => handleFilterChange('fecha_visita_hasta', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end md:col-span-6">
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
            <Home className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Total: {pagination.total} visita{pagination.total !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {filteredVisitas.length === 0 ? (
          <div className="text-center py-8">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No se encontraron visitas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto / Caso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Establecimiento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVisitas.map((visita) => (
                  <tr key={visita.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {visita.contacto
                          ? `${visita.contacto.nombres} ${visita.contacto.apellidos}`
                          : visita.casoIndice
                            ? visita.casoIndice.codigo_caso
                            : '-'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {visita.contacto?.dni || visita.casoIndice?.codigo_caso || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {formatDateLocal(visita.fecha_visita)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{visita.tipo_visita}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{visita.resultado_visita}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {visita.establecimiento?.nombre || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/visitas-domiciliarias/${visita.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/visitas-domiciliarias/${visita.id}/editar`}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(visita.id)}
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

export default VisitasDomiciliarias
