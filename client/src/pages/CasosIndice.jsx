import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { casoIndiceService } from '../services/casoIndiceService'
import { establecimientoSaludService } from '../services/establecimientoSaludService'
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const CasosIndice = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Estado para filtros y búsqueda
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    tipo_tb: '',
    establecimiento_id: '',
    paciente_dni: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  // Consultar casos índice
  const { data, isLoading, error } = useQuery({
    queryKey: ['casos-indice', page, limit, filters, searchTerm],
    queryFn: () => {
      const params = {
        page,
        limit,
        ...filters,
      }
      // Si hay búsqueda, agregar al filtro de DNI
      if (searchTerm) {
        params.paciente_dni = searchTerm
      }
      // Remover filtros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })
      return casoIndiceService.list(params)
    },
  })

  // Consultar establecimientos para el filtro
  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  // Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: (id) => casoIndiceService.delete(id),
    onSuccess: () => {
      toast.success('Caso índice eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['casos-indice'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el caso índice')
    },
  })

  const casosIndice = data?.data || []
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 }

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    // La búsqueda se aplica automáticamente vía queryKey
  }

  // Manejar filtros
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      tipo_tb: '',
      establecimiento_id: '',
      paciente_dni: '',
    })
    setSearchTerm('')
    setPage(1)
  }

  // Confirmar eliminación
  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar el caso índice de ${nombre}?`)) {
      deleteMutation.mutate(id)
    }
  }

  // Tipos de TB para el filtro
  const tiposTB = ['Pulmonar', 'Extrapulmonar', 'Miliar', 'Meningea']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando casos índice...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">Error al cargar los casos índice: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Casos Índice</h2>
          <p className="text-gray-600 mt-1">Gestión de casos índice de tuberculosis</p>
        </div>
        <Link
          to="/casos-indice/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Caso Índice
        </Link>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por DNI, nombre o código de caso..."
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

        {/* Panel de filtros */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro Tipo TB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de TB
                </label>
                <select
                  value={filters.tipo_tb}
                  onChange={(e) => handleFilterChange('tipo_tb', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {tiposTB.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Establecimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Establecimiento
                </label>
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

              {/* Botón limpiar filtros */}
              <div className="flex items-end">
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

      {/* Tabla de casos índice */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {casosIndice.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron casos índice</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo TB
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Diagnóstico
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
                  {casosIndice.map((caso) => (
                    <tr key={caso.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {caso.codigo_caso}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {caso.paciente_nombres} {caso.paciente_apellidos}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{caso.paciente_dni || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                          {caso.tipo_tb}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {caso.fecha_diagnostico ? formatDateLocal(caso.fecha_diagnostico) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {caso.establecimiento?.nombre || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/casos-indice/${caso.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/casos-indice/${caso.id}/editar`}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(
                                caso.id,
                                `${caso.paciente_nombres} ${caso.paciente_apellidos}`
                              )
                            }
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

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, pagination.total)} de{' '}
                  {pagination.total} casos índice
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Página {page} de {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CasosIndice
