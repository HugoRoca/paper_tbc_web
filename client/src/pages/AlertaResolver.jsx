import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertaService } from '../services/alertaService'
import { ArrowLeft, Save, X, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateLocal } from '../utils/date'

const AlertaResolver = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [observaciones, setObservaciones] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['alerta', id],
    queryFn: () => alertaService.getById(id),
  })

  const resolverMutation = useMutation({
    mutationFn: () => alertaService.resolver(id, { observaciones: observaciones.trim() }),
    onSuccess: () => {
      toast.success('Alerta resuelta correctamente')
      queryClient.invalidateQueries({ queryKey: ['alerta', id] })
      queryClient.invalidateQueries({ queryKey: ['alertas'] })
      navigate(`/alertas/${id}`)
    },
    onError: (resolverError) => {
      toast.error(resolverError.response?.data?.message || 'Error al resolver la alerta')
    },
  })

  const alerta = data?.data

  const handleSubmit = (e) => {
    e.preventDefault()
    resolverMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando alerta...</p>
        </div>
      </div>
    )
  }

  if (error || !alerta) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            {error?.response?.data?.message || 'Alerta no encontrada'}
          </p>
          <Link
            to="/alertas"
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
          <Link to={`/alertas/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resolver Alerta</h2>
            <p className="text-gray-600 mt-1">Tipo: {alerta.tipo_alerta}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <p className="text-gray-900 mt-1">{alerta.estado}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Severidad</label>
            <p className="text-gray-900 mt-1">{alerta.severidad}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha de Alerta</label>
            <p className="text-gray-900 mt-1">{formatDateLocal(alerta.fecha_alerta)}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Confirmar resolución
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
          <textarea
            name="observaciones"
            rows="4"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <Link
            to={`/alertas/${id}`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={resolverMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Resolver
          </button>
        </div>
      </form>
    </div>
  )
}

export default AlertaResolver
