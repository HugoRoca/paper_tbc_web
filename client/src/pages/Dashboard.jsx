import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'
import StatCard from '../components/StatCard'
import AlertCard from '../components/AlertCard'
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

const Dashboard = () => {
  // Consultar métricas
  const { data: casosData, isLoading: casosLoading, error: casosError } = useQuery({
    queryKey: ['dashboard', 'casos-indice'],
    queryFn: dashboardService.getTotalCasosIndice,
  })

  const { data: contactosData, isLoading: contactosLoading, error: contactosError } = useQuery({
    queryKey: ['dashboard', 'contactos'],
    queryFn: dashboardService.getTotalContactos,
  })

  const { data: controlesData, isLoading: controlesLoading, error: controlesError } = useQuery({
    queryKey: ['dashboard', 'controles-pendientes'],
    queryFn: dashboardService.getControlesPendientes,
  })

  const { data: tptData, isLoading: tptLoading, error: tptError } = useQuery({
    queryKey: ['dashboard', 'tpt-iniciados'],
    queryFn: dashboardService.getTptIniciados,
  })

  const { data: alertasData, isLoading: alertasLoading, error: alertasError } = useQuery({
    queryKey: ['dashboard', 'alertas-activas'],
    queryFn: dashboardService.getAlertasActivas,
  })

  const { data: derivacionesData, isLoading: derivacionesLoading, error: derivacionesError } = useQuery({
    queryKey: ['dashboard', 'derivaciones-pendientes'],
    queryFn: dashboardService.getDerivacionesPendientes,
  })

  const isLoading =
    casosLoading ||
    contactosLoading ||
    controlesLoading ||
    tptLoading ||
    alertasLoading ||
    derivacionesLoading

  // Debug: Log de datos recibidos
  console.log('Dashboard data:', {
    casosData,
    contactosData,
    controlesData,
    tptData,
    alertasData,
    derivacionesData,
  })

  // Acceder a los datos correctamente según la estructura del backend
  // Backend devuelve: { success: true, data: [], pagination: { total } }
  const totalCasos = casosData?.success ? (casosData?.pagination?.total || 0) : 0
  const totalContactos = contactosData?.success ? (contactosData?.pagination?.total || 0) : 0
  const controlesPendientes = controlesData?.success ? (controlesData?.pagination?.total || 0) : 0
  const tptIniciados = tptData?.success ? (tptData?.pagination?.total || 0) : 0
  const alertasActivas = alertasData?.success ? (alertasData?.data || []) : []
  const derivacionesPendientes = derivacionesData?.success ? (derivacionesData?.data || []) : []

  // Verificar si hay errores
  const hasError = casosError || contactosError || controlesError || tptError || alertasError || derivacionesError

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

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar el dashboard</h3>
          <p className="text-sm text-red-700 mb-4">
            {casosError?.message || contactosError?.message || 'Error desconocido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Recargar
          </button>
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
            value={totalCasos}
            icon={Users}
            color="blue"
          />
        </Link>
        <Link to="/contactos">
          <StatCard
            title="Contactos Registrados"
            value={totalContactos}
            icon={UserCheck}
            color="green"
          />
        </Link>
        <Link to="/controles-contacto?estado=pendiente">
          <StatCard
            title="Controles Pendientes"
            value={controlesPendientes}
            icon={ClipboardCheck}
            color="yellow"
          />
        </Link>
        <Link to="/tpt-indicaciones?estado=iniciado">
          <StatCard
            title="TPT Iniciados"
            value={tptIniciados}
            icon={Pill}
            color="purple"
          />
        </Link>
      </div>

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
                        {new Date(derivacion.fecha_solicitud).toLocaleDateString()}
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

      {/* Información Adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Resumen del Sistema</h4>
            <p className="text-sm text-blue-800">
              El sistema registra {totalCasos} caso(s) índice y {totalContactos} contacto(s).
              Actualmente hay {controlesPendientes} control(es) pendiente(s) y{' '}
              {tptIniciados} TPT iniciado(s). Se han generado {alertasActivas.length} alerta(s)
              activa(s) que requieren atención.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
