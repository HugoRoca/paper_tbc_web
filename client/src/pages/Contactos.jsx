import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { contactoService } from '../services/contactoService'
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

const Contactos = () => {
  const queryClient = useQueryClient()

  // Estado para filtros y búsqueda
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    caso_indice_id: '',
    tipo_contacto: '',
    establecimiento_id: '',
    dni: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  // Consultar contactos
  const { data, isLoading, error } = useQuery({
    queryKey: ['contactos', page, limit, filters],
    queryFn: () => {
      const params = {
        page,
        limit,
        ...filters,
      }

      // Remover filtros vacíos
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })

      return contactoService.list(params)
    },
  })

  // Consultar establecimientos para el filtro
  const { data: establecimientosData } = useQuery({
    queryKey: ['establecimientos-salud', 'all'],
    queryFn: () => establecimientoSaludService.list({ limit: 1000, page: 1 }),
  })

  // Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: (id) => contactoService.delete(id),
    onSuccess: () => {
      toast.success('Contacto eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['contactos'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el contacto')
    },
  })

  const contactos = data?.data
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 }

  // Búsqueda local por nombre/apellido/dni en la página actual
  const filteredContactos = useMemo(() => {
    const currentContactos = contactos || []
    if (!searchTerm) return currentContactos
    const term = searchTerm.toLowerCase()
    return currentContactos.filter((contacto) => {
      const fullName = `${contacto.nombres || ''} ${contacto.apellidos || ''}`.toLowerCase()
      return (
        fullName.includes(term) ||
        (contacto.dni || '').toLowerCase().includes(term) ||
        (contacto.casoIndice?.codigo_caso || '').toLowerCase().includes(term)
      )
    })
  }, [contactos, searchTerm])

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  // Manejar filtros
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      caso_indice_id: '',
      tipo_contacto: '',
      establecimiento_id: '',
      dni: '',
    })
    setSearchTerm('')
    setPage(1)
  }

  // Confirmar eliminación
  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar el contacto de ${nombre}?`)) {
      deleteMutation.mutate(id)
    }
  }

  const tiposContacto = ['Intradomiciliario', 'Extradomiciliario']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contactos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">Error al cargar contactos: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Contactos</h2>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Censo y seguimiento de contactos
          </p>
        </div>
        <Link
          to="/contactos/nuevo"
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Nuevo Contacto
        </Link>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="card card-hover">
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
          <button
            type="submit"
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-secondary flex items-center justify-center gap-2 ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </form>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filtro Tipo Contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contacto</label>
                <select
                  value={filters.tipo_contacto}
                  onChange={(e) => handleFilterChange('tipo_contacto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {tiposContacto.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Caso Índice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caso Índice (ID)</label>
                <input
                  type="number"
                  value={filters.caso_indice_id}
                  onChange={(e) => handleFilterChange('caso_indice_id', e.target.value)}
                  placeholder="Ej: 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtro Establecimiento */}
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

      {/* Tabla de contactos */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">
                Total: {pagination.total} contacto{pagination.total !== 1 ? 's' : ''}
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Mostrando {filteredContactos.length} en esta página
              </p>
            </div>
          </div>
        </div>

        {filteredContactos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No se encontraron contactos</p>
            <p className="text-sm text-gray-400 mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    DNI
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Caso Índice
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Establecimiento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContactos.map((contacto) => (
                  <tr key={contacto.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {contacto.nombres} {contacto.apellidos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-medium">{contacto.dni || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-primary">
                        {contacto.tipo_contacto}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={contacto.casoIndice?.id ? `/casos-indice/${contacto.casoIndice.id}` : '#'}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {contacto.casoIndice?.codigo_caso || '-'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {contacto.establecimiento?.nombre || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {contacto.fecha_registro ? formatDateLocal(contacto.fecha_registro) : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/contactos/${contacto.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/contactos/${contacto.id}/editar`}
                          className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(contacto.id, `${contacto.nombres} ${contacto.apellidos}`)}
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
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-gray-700">
              Página <span className="font-bold text-blue-600">{pagination.page}</span> de{' '}
              <span className="font-bold text-gray-900">{pagination.totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
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

export default Contactos
