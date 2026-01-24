import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Perfil from './pages/Perfil'
import CasosIndice from './pages/CasosIndice'
import CasoIndiceDetalle from './pages/CasoIndiceDetalle'
import CasoIndiceNuevo from './pages/CasoIndiceNuevo'
import CasoIndiceEditar from './pages/CasoIndiceEditar'

// Placeholder components para las demás pantallas
const Placeholder = ({ title }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas con Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Outlet />
                </Layout>
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Casos Índice */}
            <Route path="casos-indice" element={<CasosIndice />} />
            <Route path="casos-indice/nuevo" element={<CasoIndiceNuevo />} />
            <Route path="casos-indice/:id" element={<CasoIndiceDetalle />} />
            <Route path="casos-indice/:id/editar" element={<CasoIndiceEditar />} />
            
            {/* Contactos */}
            <Route path="contactos" element={<Placeholder title="Contactos" />} />
            <Route path="contactos/nuevo" element={<Placeholder title="Nuevo Contacto" />} />
            <Route path="contactos/:id" element={<Placeholder title="Detalle Contacto" />} />
            <Route path="contactos/:id/editar" element={<Placeholder title="Editar Contacto" />} />
            
            {/* Exámenes de Contacto */}
            <Route path="examenes-contacto" element={<Placeholder title="Exámenes de Contacto" />} />
            <Route path="examenes-contacto/nuevo" element={<Placeholder title="Nuevo Examen" />} />
            <Route path="examenes-contacto/:id/editar" element={<Placeholder title="Editar Examen" />} />
            
            {/* Controles de Contacto */}
            <Route path="controles-contacto" element={<Placeholder title="Controles de Contacto" />} />
            <Route path="controles-contacto/nuevo" element={<Placeholder title="Nuevo Control" />} />
            <Route path="controles-contacto/:id/editar" element={<Placeholder title="Editar Control" />} />
            
            {/* TPT Indicaciones */}
            <Route path="tpt-indicaciones" element={<Placeholder title="Indicaciones TPT" />} />
            <Route path="tpt-indicaciones/nuevo" element={<Placeholder title="Nueva Indicación TPT" />} />
            <Route path="tpt-indicaciones/:id" element={<Placeholder title="Detalle Indicación TPT" />} />
            <Route path="tpt-indicaciones/:id/editar" element={<Placeholder title="Editar Indicación TPT" />} />
            
            {/* TPT Seguimiento */}
            <Route path="tpt-seguimiento" element={<Placeholder title="Seguimiento TPT" />} />
            <Route path="tpt-seguimiento/nuevo" element={<Placeholder title="Nuevo Seguimiento TPT" />} />
            <Route path="tpt-seguimiento/:id/editar" element={<Placeholder title="Editar Seguimiento TPT" />} />
            
            {/* Reacciones Adversas */}
            <Route path="reacciones-adversas" element={<Placeholder title="Reacciones Adversas" />} />
            <Route path="reacciones-adversas/nuevo" element={<Placeholder title="Nueva Reacción Adversa" />} />
            <Route path="reacciones-adversas/:id/editar" element={<Placeholder title="Editar Reacción Adversa" />} />
            
            {/* Visitas Domiciliarias */}
            <Route path="visitas-domiciliarias" element={<Placeholder title="Visitas Domiciliarias" />} />
            <Route path="visitas-domiciliarias/nuevo" element={<Placeholder title="Nueva Visita Domiciliaria" />} />
            <Route path="visitas-domiciliarias/:id/editar" element={<Placeholder title="Editar Visita Domiciliaria" />} />
            
            {/* Derivaciones/Transferencias */}
            <Route path="derivaciones-transferencias" element={<Placeholder title="Derivaciones/Transferencias" />} />
            <Route path="derivaciones-transferencias/nuevo" element={<Placeholder title="Nueva Derivación/Transferencia" />} />
            <Route path="derivaciones-transferencias/:id/editar" element={<Placeholder title="Editar Derivación/Transferencia" />} />
            
            {/* Alertas */}
            <Route path="alertas" element={<Placeholder title="Alertas" />} />
            <Route path="alertas/nuevo" element={<Placeholder title="Nueva Alerta" />} />
            <Route path="alertas/:id" element={<Placeholder title="Detalle Alerta" />} />
            <Route path="alertas/:id/editar" element={<Placeholder title="Editar Alerta" />} />
            
            {/* Establecimientos de Salud */}
            <Route path="establecimientos-salud" element={<Placeholder title="Establecimientos de Salud" />} />
            <Route path="establecimientos-salud/nuevo" element={<Placeholder title="Nuevo Establecimiento" />} />
            <Route path="establecimientos-salud/:id/editar" element={<Placeholder title="Editar Establecimiento" />} />
            
            {/* Usuarios (Solo Admin) */}
            <Route path="usuarios" element={<Placeholder title="Usuarios" />} />
            <Route path="usuarios/nuevo" element={<Placeholder title="Nuevo Usuario" />} />
            <Route path="usuarios/:id" element={<Placeholder title="Detalle Usuario" />} />
            <Route path="usuarios/:id/editar" element={<Placeholder title="Editar Usuario" />} />
            
            {/* Roles (Solo Admin) */}
            <Route path="roles" element={<Placeholder title="Roles" />} />
            <Route path="roles/nuevo" element={<Placeholder title="Nuevo Rol" />} />
            <Route path="roles/:id/editar" element={<Placeholder title="Editar Rol" />} />
            
            {/* Auditoría (Solo Admin) */}
            <Route path="auditoria" element={<Placeholder title="Auditoría" />} />
            <Route path="auditoria/:id" element={<Placeholder title="Detalle Auditoría" />} />
            
            {/* Integraciones (Solo Admin) */}
            <Route path="integraciones-log" element={<Placeholder title="Logs de Integraciones" />} />
            <Route path="integraciones/sigtb" element={<Placeholder title="Consultar SIGTB" />} />
            <Route path="integraciones/netlab" element={<Placeholder title="Consultar NETLAB" />} />
            
            {/* Perfil */}
            <Route path="perfil" element={<Perfil />} />
          </Route>
          
          {/* Ruta catch-all: redirigir a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
