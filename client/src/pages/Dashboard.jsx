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
  RefreshCw,
  Calendar,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()

  // Función para refrescar todos los datos del dashboard
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  // Opciones de query para forzar actualización sin caché
  const queryOptions = {
    staleTime: 0, // Los datos se consideran obsoletos inmediatamente
    gcTime: 0, // No guardar en caché (garbage collection time en v5)
    refetchOnMount: true, // Siempre refetchear al montar el componente
    refetchOnWindowFocus: false, // No refetchear al enfocar la ventana
  }

  // Estadísticas generales
  const { data: statsData, isLoading: statsLoading, isFetching: statsFetching } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
    ...queryOptions,
  })

  // Gráficos
  const { data: casosPorTipoData, isFetching: casosPorTipoFetching } = useQuery({
    queryKey: ['dashboard', 'casos-por-tipo'],
    queryFn: dashboardService.getCasosPorTipo,
    ...queryOptions,
  })

  const { data: casosPorMesData, isFetching: casosPorMesFetching } = useQuery({
    queryKey: ['dashboard', 'casos-por-mes'],
    queryFn: () => dashboardService.getCasosPorMes(6),
    ...queryOptions,
  })

  const { data: contactosPorTipoData, isFetching: contactosPorTipoFetching } = useQuery({
    queryKey: ['dashboard', 'contactos-por-tipo'],
    queryFn: dashboardService.getContactosPorTipo,
    ...queryOptions,
  })

  const { data: tptPorEstadoData, isFetching: tptPorEstadoFetching } = useQuery({
    queryKey: ['dashboard', 'tpt-por-estado'],
    queryFn: dashboardService.getTptPorEstado,
    ...queryOptions,
  })

  const { data: controlesPorEstadoData, isFetching: controlesPorEstadoFetching } = useQuery({
    queryKey: ['dashboard', 'controles-por-estado'],
    queryFn: dashboardService.getControlesPorEstado,
    ...queryOptions,
  })

  const { data: alertasPorSeveridadData, isFetching: alertasPorSeveridadFetching } = useQuery({
    queryKey: ['dashboard', 'alertas-por-severidad'],
    queryFn: dashboardService.getAlertasPorSeveridad,
    ...queryOptions,
  })

  // Alertas y derivaciones
  const { data: alertasData, isFetching: alertasFetching } = useQuery({
    queryKey: ['dashboard', 'alertas-activas'],
    queryFn: dashboardService.getAlertasActivas,
    ...queryOptions,
  })

  const { data: derivacionesData, isFetching: derivacionesFetching } = useQuery({
    queryKey: ['dashboard', 'derivaciones-pendientes'],
    queryFn: dashboardService.getDerivacionesPendientes,
    ...queryOptions,
  })

  // Verificar si alguna query está cargando o actualizando
  const isLoading =
    statsLoading ||
    casosPorTipoFetching ||
    casosPorMesFetching ||
    contactosPorTipoFetching ||
    tptPorEstadoFetching ||
    controlesPorEstadoFetching ||
    alertasPorSeveridadFetching ||
    alertasFetching ||
    derivacionesFetching

  const isFetching =
    statsFetching ||
    casosPorTipoFetching ||
    casosPorMesFetching ||
    contactosPorTipoFetching ||
    tptPorEstadoFetching ||
    controlesPorEstadoFetching ||
    alertasPorSeveridadFetching ||
    alertasFetching ||
    derivacionesFetching

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

  // Mostrar pantalla de carga inicial solo si no hay datos previos
  if (isLoading && !statsData) {
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
    <div className="space-y-6 relative">
      {/* Indicador de actualización */}
      {isFetching && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <span className="text-sm font-semibold">Actualizando datos...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Vista general del sistema de monitoreo TBC</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isFetching && (
            <div className="flex items-center gap-2 text-sm text-blue-600 px-3 py-2 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span>Actualizando...</span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isFetching
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
            }`}
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/casos-indice" className={`relative ${statsFetching ? 'animate-pulse' : ''}`}>
          {statsFetching && (
            <div className="absolute -top-1 -right-1 z-10">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          )}
          <StatCard
            title="Casos Índice"
            value={stats.totalCasos || 0}
            icon={Users}
            color="blue"
          />
        </Link>
        <Link to="/contactos" className={`relative ${statsFetching ? 'animate-pulse' : ''}`}>
          {statsFetching && (
            <div className="absolute -top-1 -right-1 z-10">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
            </div>
          )}
          <StatCard
            title="Contactos Registrados"
            value={stats.totalContactos || 0}
            icon={UserCheck}
            color="green"
          />
        </Link>
        <Link to="/controles-contacto?estado=pendiente" className={`relative ${statsFetching ? 'animate-pulse' : ''}`}>
          {statsFetching && (
            <div className="absolute -top-1 -right-1 z-10">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
            </div>
          )}
          <StatCard
            title="Controles Pendientes"
            value={stats.controlesPendientes || 0}
            icon={ClipboardCheck}
            color="yellow"
          />
        </Link>
        <Link to="/tpt-indicaciones?estado=iniciado" className={`relative ${statsFetching ? 'animate-pulse' : ''}`}>
          {statsFetching && (
            <div className="absolute -top-1 -right-1 z-10">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
            </div>
          )}
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
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-6 relative">
          {casosPorTipoFetching && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600 font-medium">Actualizando...</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Casos por Tipo de TB</h3>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          {casosPorTipo.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={casosPorTipo} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#colorBlue)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos disponibles</p>
              </div>
            </div>
          )}
        </div>

        {/* Casos por Mes */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-6 relative">
          {casosPorMesFetching && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600 font-medium">Actualizando...</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Casos Registrados por Mes</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          {casosPorMesFormatted.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={casosPorMesFormatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ stroke: '#10B981', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="url(#colorGreen)"
                  strokeWidth={3}
                  name="Casos"
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7 }}
                  animationDuration={800}
                />
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#34D399" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos disponibles</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gráficos - Segunda Fila */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contactos por Tipo */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-6 relative">
          {contactosPorTipoFetching && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600 font-medium">Actualizando...</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Contactos por Tipo</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          {contactosPorTipo.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contactosPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                >
                  {contactosPorTipo.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.green[index % COLORS.green.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos disponibles</p>
              </div>
            </div>
          )}
        </div>

        {/* TPT por Estado */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-6 relative">
          {tptPorEstadoFetching && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600 font-medium">Actualizando...</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">TPT por Estado</h3>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
          {tptPorEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tptPorEstado} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#colorPurple)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
                <defs>
                  <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos disponibles</p>
              </div>
            </div>
          )}
        </div>

        {/* Controles por Estado */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-6 relative">
          {controlesPorEstadoFetching && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600 font-medium">Actualizando...</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Controles por Estado</h3>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>
          {controlesPorEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={controlesPorEstado} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#colorYellow)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
                <defs>
                  <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos disponibles</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alertas por Severidad */}
      {alertasPorSeveridad.length > 0 && (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-6 relative">
          {alertasPorSeveridadFetching && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600 font-medium">Actualizando...</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Alertas Activas por Severidad</h3>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertasPorSeveridad} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#colorRed)" 
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
              <defs>
                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alertas y Derivaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Activas */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span>Alertas Activas</span>
            </h3>
            <Link
              to="/alertas"
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
            >
              Ver todas →
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
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              </div>
              <span>Derivaciones Pendientes</span>
            </h3>
            <Link
              to="/derivaciones-transferencias?estado=pendiente"
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
            >
              Ver todas →
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-900 mb-2 text-lg">Resumen del Sistema</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              El sistema registra <span className="font-semibold text-blue-900">{stats.totalCasos || 0}</span> caso(s) índice y{' '}
              <span className="font-semibold text-blue-900">{stats.totalContactos || 0}</span> contacto(s). Actualmente hay{' '}
              <span className="font-semibold text-blue-900">{stats.controlesPendientes || 0}</span> control(es) pendiente(s) y{' '}
              <span className="font-semibold text-blue-900">{stats.tptIniciados || 0}</span> TPT iniciado(s). Se han generado{' '}
              <span className="font-semibold text-red-600">{alertasActivas.length}</span> alerta(s) activa(s) que requieren atención.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
