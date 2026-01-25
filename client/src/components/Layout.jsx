import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  FileCheck,
  Pill,
  Activity,
  AlertTriangle,
  Home,
  Building2,
  UserCog,
  Shield,
  FileText,
  Plug,
  User,
  LogOut,
  Menu,
  X,
  ArrowRightLeft,
  Database,
  Network,
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const roleName = user?.role?.nombre || user?.rol?.nombre || user?.rol_nombre
  const isAdmin = roleName === 'Administrador'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      title: 'Principal',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      ],
    },
    {
      title: 'Gestión de Casos',
      items: [
        { icon: Users, label: 'Casos Índice', path: '/casos-indice' },
        { icon: UserCheck, label: 'Contactos', path: '/contactos' },
      ],
    },
    {
      title: 'Controles y Exámenes',
      items: [
        { icon: ClipboardList, label: 'Exámenes de Contacto', path: '/examenes-contacto' },
        { icon: FileCheck, label: 'Controles de Contacto', path: '/controles-contacto' },
      ],
    },
    {
      title: 'TPT',
      items: [
        { icon: Pill, label: 'Indicaciones TPT', path: '/tpt-indicaciones' },
        { icon: Activity, label: 'Seguimiento TPT', path: '/tpt-seguimiento' },
        { icon: AlertTriangle, label: 'Reacciones Adversas', path: '/reacciones-adversas' },
        ...(isAdmin ? [
          { icon: Pill, label: 'Esquemas TPT', path: '/esquemas-tpt' },
        ] : []),
      ],
    },
    {
      title: 'Seguimiento',
      items: [
        { icon: Home, label: 'Visitas Domiciliarias', path: '/visitas-domiciliarias' },
        { icon: ArrowRightLeft, label: 'Derivaciones/Trans.', path: '/derivaciones-transferencias' },
      ],
    },
    {
      title: 'Alertas',
      items: [
        { icon: AlertTriangle, label: 'Alertas', path: '/alertas' },
      ],
    },
    {
      title: 'Administración',
      items: [
        { icon: Building2, label: 'Establecimientos', path: '/establecimientos-salud' },
        ...(isAdmin ? [
          { icon: UserCog, label: 'Usuarios', path: '/usuarios' },
          { icon: Shield, label: 'Roles', path: '/roles' },
          { icon: FileText, label: 'Auditoría', path: '/auditoria' },
          { icon: Plug, label: 'Integraciones', path: '/integraciones-log' },
          { icon: Database, label: 'Consultar SIGTB', path: '/integraciones/sigtb' },
          { icon: Network, label: 'Consultar NETLAB', path: '/integraciones/netlab' },
        ] : []),
      ],
    },
    {
      title: 'Usuario',
      items: [
        { icon: User, label: 'Mi Perfil', path: '/perfil' },
      ],
    },
  ]

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">System contact TBC</span>
                <span className="text-xs text-blue-100">Monitoreo TBC</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    const active = isActive(item.path)
                    return (
                      <li key={itemIndex}>
                        <Link
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                            active
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`} />
                          <span>{item.label}</span>
                          {active && (
                            <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* User Info Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.nombres || user?.apellidos || user?.nickname || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate font-medium">
                  {roleName || 'Sin rol'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems
                    .flatMap((section) => section.items)
                    .find((item) => isActive(item.path))?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Sistema de Monitoreo TBC</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 min-h-screen">{children}</main>
      </div>
    </div>
  )
}

export default Layout
