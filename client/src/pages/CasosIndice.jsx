import { useState, useEffect, useMemo } from 'react'
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
import Button from '../components/Button'
import Badge from '../components/Badge'
import Card from '../components/Card'

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
    queryKey: ['casos-indice', page, limit, filters],
    queryFn: () => {
      const params = {
        page,
        limit,
        ...filters,
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

  const filteredCasos = useMemo(() => {
    if (!searchTerm) return casosIndice
    const term = searchTerm.toLowerCase()
    return casosIndice.filter((caso) => {
      const fullName = `${caso.paciente_nombres || ''} ${caso.paciente_apellidos || ''}`.toLowerCase()
      return (
        fullName.includes(term) ||
        (caso.paciente_dni || '').toLowerCase().includes(term) ||
        (caso.codigo_caso || '').toLowerCase().includes(term)
      )
    })
  }, [casosIndice, searchTerm])

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Casos Índice</h2>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Gestión de casos índice de tuberculosis
          </p>
        </div>
        <Link
          to="/casos-indice/nuevo"
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Nuevo Caso Índice
        </Link>
      </div>

      {/* Búsqueda y Filtros */}
      <Card>
        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por DNI, nombre o código de caso..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-11"
            />
          </div>
          <Button type="submit" icon={Search}>
            Buscar
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}
          >
            Filtros
          </Button>
        </form>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro Tipo TB */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de TB
                </label>
                <select
                  value={filters.tipo_tb}
                  onChange={(e) => handleFilterChange('tipo_tb', e.target.value)}
                  className="input"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Establecimiento
                </label>
                <select
                  value={filters.establecimiento_id}
                  onChange={(e) => handleFilterChange('establecimiento_id', e.target.value)}
                  className="input"
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
                <Button
                  variant="secondary"
                  icon={X}
                  onClick={clearFilters}
                  className="w-full"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Tabla de casos índice */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">
                Total: {pagination.total} caso{pagination.total !== 1 ? 's' : ''}
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Mostrando {filteredCasos.length} en esta página
              </p>
            </div>
          </div>
        </div>

        {filteredCasos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No se encontraron casos índice</p>
            <p className="text-sm text-gray-400 mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tipo TB
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Fecha Diagnóstico
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Establecimiento
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCasos.map((caso) => (
                    <tr key={caso.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {caso.codigo_caso}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {caso.paciente_nombres} {caso.paciente_apellidos}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 font-medium">{caso.paciente_dni || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="primary">{caso.tipo_tb}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {caso.fecha_diagnostico ? formatDateLocal(caso.fecha_diagnostico) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {caso.establecimiento?.nombre || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/casos-indice/${caso.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/casos-indice/${caso.id}/editar`}
                            className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
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
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-medium text-gray-700">
                  Página <span className="font-bold text-blue-600">{pagination.page}</span> de{' '}
                  <span className="font-bold text-gray-900">{pagination.totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    icon={ChevronLeft}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    icon={ChevronRight}
                    iconPosition="right"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

export default CasosIndice
