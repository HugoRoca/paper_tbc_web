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
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isAdmin = user?.role?.nombre === 'Administrador'

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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">System contact TBC</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
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
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            active
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* User Info Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.nombres || user?.apellidos || user?.nickname || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role?.nombre || 'Sin rol'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {menuItems
                  .flatMap((section) => section.items)
                  .find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

export default Layout
