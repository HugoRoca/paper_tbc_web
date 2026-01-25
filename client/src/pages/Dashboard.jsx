import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'
import StatCard from '../components/StatCard'
import AlertCard from '../components/AlertCard'
import { formatDateLocal } from '../utils/date'
import {
  Users,
  UserCheck,
  ClipboardCheck,
  Pill,
  AlertTriangle,
  ArrowRightLeft,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = {
  blue: ['#3B82F6', '#60A5FA', '#93C5FD'],
  green: ['#10B981', '#34D399', '#6EE7B7'],
  yellow: ['#F59E0B', '#FBBF24', '#FCD34D'],
  purple: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
  red: ['#EF4444', '#F87171', '#FCA5A5'],
}

const Dashboard = () => {
  // Opciones de query para forzar actualización sin caché
  const queryOptions = {
    staleTime: 0, // Los datos se consideran obsoletos inmediatamente
    gcTime: 0, // No guardar en caché (garbage collection time en v5)
    refetchOnMount: true, // Siempre refetchear al montar el componente
    refetchOnWindowFocus: false, // No refetchear al enfocar la ventana
  }

  // Estadísticas generales
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
    ...queryOptions,
  })

  // Gráficos
  const { data: casosPorTipoData } = useQuery({
    queryKey: ['dashboard', 'casos-por-tipo'],
    queryFn: dashboardService.getCasosPorTipo,
    ...queryOptions,
  })

  const { data: casosPorMesData } = useQuery({
    queryKey: ['dashboard', 'casos-por-mes'],
    queryFn: () => dashboardService.getCasosPorMes(6),
    ...queryOptions,
  })

  const { data: contactosPorTipoData } = useQuery({
    queryKey: ['dashboard', 'contactos-por-tipo'],
    queryFn: dashboardService.getContactosPorTipo,
    ...queryOptions,
  })

  const { data: tptPorEstadoData } = useQuery({
    queryKey: ['dashboard', 'tpt-por-estado'],
    queryFn: dashboardService.getTptPorEstado,
    ...queryOptions,
  })

  const { data: controlesPorEstadoData } = useQuery({
    queryKey: ['dashboard', 'controles-por-estado'],
    queryFn: dashboardService.getControlesPorEstado,
    ...queryOptions,
  })

  const { data: alertasPorSeveridadData } = useQuery({
    queryKey: ['dashboard', 'alertas-por-severidad'],
    queryFn: dashboardService.getAlertasPorSeveridad,
    ...queryOptions,
  })

  // Alertas y derivaciones
  const { data: alertasData } = useQuery({
    queryKey: ['dashboard', 'alertas-activas'],
    queryFn: dashboardService.getAlertasActivas,
    ...queryOptions,
  })

  const { data: derivacionesData } = useQuery({
    queryKey: ['dashboard', 'derivaciones-pendientes'],
    queryFn: dashboardService.getDerivacionesPendientes,
    ...queryOptions,
  })

  const isLoading = statsLoading

  const stats = statsData?.data || {}
  const casosPorTipo = casosPorTipoData?.data || []
  const casosPorMes = casosPorMesData?.data || []
  const contactosPorTipo = contactosPorTipoData?.data || []
  const tptPorEstado = tptPorEstadoData?.data || []
  const controlesPorEstado = controlesPorEstadoData?.data || []
  const alertasPorSeveridad = alertasPorSeveridadData?.data || []
  const alertasActivas = alertasData?.success ? alertasData?.data || [] : []
  const derivacionesPendientes = derivacionesData?.success ? derivacionesData?.data || [] : []

  // Formatear datos para gráficos
  const casosPorMesFormatted = casosPorMes.map((item) => ({
    mes: item.mes,
    cantidad: item.cantidad,
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Vista general del sistema de monitoreo TBC</p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/casos-indice">
          <StatCard
            title="Casos Índice"
            value={stats.totalCasos || 0}
            icon={Users}
            color="blue"
          />
        </Link>
        <Link to="/contactos">
          <StatCard
            title="Contactos Registrados"
            value={stats.totalContactos || 0}
            icon={UserCheck}
            color="green"
          />
        </Link>
        <Link to="/controles-contacto?estado=pendiente">
          <StatCard
            title="Controles Pendientes"
            value={stats.controlesPendientes || 0}
            icon={ClipboardCheck}
            color="yellow"
          />
        </Link>
        <Link to="/tpt-indicaciones?estado=iniciado">
          <StatCard
            title="TPT Iniciados"
            value={stats.tptIniciados || 0}
            icon={Pill}
            color="purple"
          />
        </Link>
      </div>

      {/* Gráficos - Primera Fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Casos por Tipo de TB */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Casos por Tipo de TB
          </h3>
          {casosPorTipo.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={casosPorTipo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Casos por Mes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Casos Registrados por Mes (Últimos 6 meses)
          </h3>
          {casosPorMesFormatted.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={casosPorMesFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Casos"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>
      </div>

      {/* Gráficos - Segunda Fila */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contactos por Tipo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contactos por Tipo
          </h3>
          {contactosPorTipo.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contactosPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contactosPorTipo.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.green[index % COLORS.green.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* TPT por Estado */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            TPT por Estado
          </h3>
          {tptPorEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tptPorEstado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Controles por Estado */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Controles por Estado
          </h3>
          {controlesPorEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={controlesPorEstado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>
      </div>

      {/* Alertas por Severidad */}
      {alertasPorSeveridad.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alertas Activas por Severidad
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertasPorSeveridad}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alertas y Derivaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Activas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Alertas Activas
            </h3>
            <Link
              to="/alertas"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todas
            </Link>
          </div>
          {alertasActivas.length > 0 ? (
            <div className="space-y-3">
              {alertasActivas.slice(0, 5).map((alerta) => (
                <AlertCard key={alerta.id} alerta={alerta} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay alertas activas</p>
            </div>
          )}
        </div>

        {/* Derivaciones Pendientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              Derivaciones Pendientes
            </h3>
            <Link
              to="/derivaciones-transferencias?estado=pendiente"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todas
            </Link>
          </div>
          {derivacionesPendientes.length > 0 ? (
            <div className="space-y-3">
              {derivacionesPendientes.slice(0, 5).map((derivacion) => (
                <div
                  key={derivacion.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                          {derivacion.tipo}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                          {derivacion.estado}
                        </span>
                      </div>
                      {derivacion.contacto && (
                        <p className="text-sm text-gray-700 mb-1">
                          Contacto: {derivacion.contacto.nombres}{' '}
                          {derivacion.contacto.apellidos}
                        </p>
                      )}
                      {derivacion.motivo && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {derivacion.motivo}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDateLocal(derivacion.fecha_solicitud)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ArrowRightLeft className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay derivaciones pendientes</p>
            </div>
          )}
        </div>
      </div>

      {/* Resumen del Sistema */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Resumen del Sistema</h4>
            <p className="text-sm text-blue-800">
              El sistema registra {stats.totalCasos || 0} caso(s) índice y{' '}
              {stats.totalContactos || 0} contacto(s). Actualmente hay{' '}
              {stats.controlesPendientes || 0} control(es) pendiente(s) y{' '}
              {stats.tptIniciados || 0} TPT iniciado(s). Se han generado{' '}
              {alertasActivas.length} alerta(s) activa(s) que requieren atención.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
