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
import Contactos from './pages/Contactos'
import ContactoDetalle from './pages/ContactoDetalle'
import ContactoNuevo from './pages/ContactoNuevo'
import ContactoEditar from './pages/ContactoEditar'
import ExamenesContacto from './pages/ExamenesContacto'
import ExamenContactoDetalle from './pages/ExamenContactoDetalle'
import ExamenContactoNuevo from './pages/ExamenContactoNuevo'
import ExamenContactoEditar from './pages/ExamenContactoEditar'
import ControlesContacto from './pages/ControlesContacto'
import ControlContactoDetalle from './pages/ControlContactoDetalle'
import ControlContactoNuevo from './pages/ControlContactoNuevo'
import ControlContactoEditar from './pages/ControlContactoEditar'
import TptIndicaciones from './pages/TptIndicaciones'
import TptIndicacionDetalle from './pages/TptIndicacionDetalle'
import TptIndicacionNuevo from './pages/TptIndicacionNuevo'
import TptIndicacionEditar from './pages/TptIndicacionEditar'
import TptSeguimiento from './pages/TptSeguimiento'
import TptSeguimientoDetalle from './pages/TptSeguimientoDetalle'
import TptSeguimientoNuevo from './pages/TptSeguimientoNuevo'
import TptSeguimientoEditar from './pages/TptSeguimientoEditar'
import ReaccionesAdversas from './pages/ReaccionesAdversas'
import ReaccionAdversaDetalle from './pages/ReaccionAdversaDetalle'
import ReaccionAdversaNuevo from './pages/ReaccionAdversaNuevo'
import ReaccionAdversaEditar from './pages/ReaccionAdversaEditar'
import VisitasDomiciliarias from './pages/VisitasDomiciliarias'
import VisitaDomiciliariaDetalle from './pages/VisitaDomiciliariaDetalle'
import VisitaDomiciliariaNuevo from './pages/VisitaDomiciliariaNuevo'
import VisitaDomiciliariaEditar from './pages/VisitaDomiciliariaEditar'
import DerivacionesTransferencias from './pages/DerivacionesTransferencias'
import DerivacionTransferenciaDetalle from './pages/DerivacionTransferenciaDetalle'
import DerivacionTransferenciaNuevo from './pages/DerivacionTransferenciaNuevo'
import DerivacionTransferenciaEditar from './pages/DerivacionTransferenciaEditar'
import Alertas from './pages/Alertas'
import AlertaDetalle from './pages/AlertaDetalle'
import AlertaNuevo from './pages/AlertaNuevo'
import AlertaResolver from './pages/AlertaResolver'
import AlertaEditar from './pages/AlertaEditar'
import EstablecimientosSalud from './pages/EstablecimientosSalud'
import EstablecimientoNuevo from './pages/EstablecimientoNuevo'
import EstablecimientoDetalle from './pages/EstablecimientoDetalle'
import EstablecimientoEditar from './pages/EstablecimientoEditar'
import Usuarios from './pages/Usuarios'
import UsuarioNuevo from './pages/UsuarioNuevo'
import UsuarioDetalle from './pages/UsuarioDetalle'
import UsuarioEditar from './pages/UsuarioEditar'
import Roles from './pages/Roles'
import RolNuevo from './pages/RolNuevo'
import RolEditar from './pages/RolEditar'
import Auditoria from './pages/Auditoria'
import AuditoriaDetalle from './pages/AuditoriaDetalle'
import IntegracionesLog from './pages/IntegracionesLog'
import IntegracionLogDetalle from './pages/IntegracionLogDetalle'
import IntegracionSigtb from './pages/IntegracionSigtb'
import IntegracionNetlab from './pages/IntegracionNetlab'
import TptConsentimientoNuevo from './pages/TptConsentimientoNuevo'
import TptConsentimientoDetalle from './pages/TptConsentimientoDetalle'
import TptIndicacionIniciar from './pages/TptIndicacionIniciar'
import EsquemasTpt from './pages/EsquemasTpt'
import EsquemaTptNuevo from './pages/EsquemaTptNuevo'
import EsquemaTptDetalle from './pages/EsquemaTptDetalle'
import EsquemaTptEditar from './pages/EsquemaTptEditar'

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
            <Route path="contactos" element={<Contactos />} />
            <Route path="contactos/nuevo" element={<ContactoNuevo />} />
            <Route path="contactos/:id" element={<ContactoDetalle />} />
            <Route path="contactos/:id/editar" element={<ContactoEditar />} />
            
            {/* Exámenes de Contacto */}
            <Route path="examenes-contacto" element={<ExamenesContacto />} />
            <Route path="examenes-contacto/:id" element={<ExamenContactoDetalle />} />
            <Route path="examenes-contacto/nuevo" element={<ExamenContactoNuevo />} />
            <Route path="examenes-contacto/:id/editar" element={<ExamenContactoEditar />} />
            
            {/* Controles de Contacto */}
            <Route path="controles-contacto" element={<ControlesContacto />} />
            <Route path="controles-contacto/nuevo" element={<ControlContactoNuevo />} />
            <Route path="controles-contacto/:id" element={<ControlContactoDetalle />} />
            <Route path="controles-contacto/:id/editar" element={<ControlContactoEditar />} />
            
            {/* Esquemas TPT */}
            <Route path="esquemas-tpt" element={<EsquemasTpt />} />
            <Route path="esquemas-tpt/nuevo" element={<EsquemaTptNuevo />} />
            <Route path="esquemas-tpt/:id" element={<EsquemaTptDetalle />} />
            <Route path="esquemas-tpt/:id/editar" element={<EsquemaTptEditar />} />
            
            {/* TPT Indicaciones */}
            <Route path="tpt-indicaciones" element={<TptIndicaciones />} />
            <Route path="tpt-indicaciones/nuevo" element={<TptIndicacionNuevo />} />
            <Route path="tpt-indicaciones/:id" element={<TptIndicacionDetalle />} />
            <Route path="tpt-indicaciones/:id/editar" element={<TptIndicacionEditar />} />
            <Route path="tpt-indicaciones/:id/iniciar" element={<TptIndicacionIniciar />} />
            
            {/* TPT Consentimientos */}
            <Route path="tpt-consentimientos/nuevo" element={<TptConsentimientoNuevo />} />
            <Route path="tpt-consentimientos/:id" element={<TptConsentimientoDetalle />} />
            
            {/* TPT Seguimiento */}
            <Route path="tpt-seguimiento" element={<TptSeguimiento />} />
            <Route path="tpt-seguimiento/nuevo" element={<TptSeguimientoNuevo />} />
            <Route path="tpt-seguimiento/:id" element={<TptSeguimientoDetalle />} />
            <Route path="tpt-seguimiento/:id/editar" element={<TptSeguimientoEditar />} />
            
            {/* Reacciones Adversas */}
            <Route path="reacciones-adversas" element={<ReaccionesAdversas />} />
            <Route path="reacciones-adversas/nuevo" element={<ReaccionAdversaNuevo />} />
            <Route path="reacciones-adversas/:id" element={<ReaccionAdversaDetalle />} />
            <Route path="reacciones-adversas/:id/editar" element={<ReaccionAdversaEditar />} />
            
            {/* Visitas Domiciliarias */}
            <Route path="visitas-domiciliarias" element={<VisitasDomiciliarias />} />
            <Route path="visitas-domiciliarias/nuevo" element={<VisitaDomiciliariaNuevo />} />
            <Route path="visitas-domiciliarias/:id" element={<VisitaDomiciliariaDetalle />} />
            <Route path="visitas-domiciliarias/:id/editar" element={<VisitaDomiciliariaEditar />} />
            
            {/* Derivaciones/Transferencias */}
            <Route path="derivaciones-transferencias" element={<DerivacionesTransferencias />} />
            <Route path="derivaciones-transferencias/:id" element={<DerivacionTransferenciaDetalle />} />
            <Route path="derivaciones-transferencias/nuevo" element={<DerivacionTransferenciaNuevo />} />
            <Route path="derivaciones-transferencias/:id/editar" element={<DerivacionTransferenciaEditar />} />
            
            {/* Alertas */}
            <Route path="alertas" element={<Alertas />} />
            <Route path="alertas/nuevo" element={<AlertaNuevo />} />
            <Route path="alertas/:id" element={<AlertaDetalle />} />
            <Route path="alertas/:id/resolver" element={<AlertaResolver />} />
            <Route path="alertas/:id/editar" element={<AlertaEditar />} />
            
            {/* Establecimientos de Salud */}
            <Route path="establecimientos-salud" element={<EstablecimientosSalud />} />
            <Route path="establecimientos-salud/nuevo" element={<EstablecimientoNuevo />} />
            <Route path="establecimientos-salud/:id" element={<EstablecimientoDetalle />} />
            <Route path="establecimientos-salud/:id/editar" element={<EstablecimientoEditar />} />
            
            {/* Usuarios (Solo Admin) */}
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="usuarios/nuevo" element={<UsuarioNuevo />} />
            <Route path="usuarios/:id" element={<UsuarioDetalle />} />
            <Route path="usuarios/:id/editar" element={<UsuarioEditar />} />
            
            {/* Roles (Solo Admin) */}
            <Route path="roles" element={<Roles />} />
            <Route path="roles/nuevo" element={<RolNuevo />} />
            <Route path="roles/:id/editar" element={<RolEditar />} />
            
            {/* Auditoría (Solo Admin) */}
            <Route path="auditoria" element={<Auditoria />} />
            <Route path="auditoria/:id" element={<AuditoriaDetalle />} />
            
            {/* Integraciones (Solo Admin) */}
            <Route path="integraciones-log" element={<IntegracionesLog />} />
            <Route path="integraciones-log/:id" element={<IntegracionLogDetalle />} />
            <Route path="integraciones/sigtb" element={<IntegracionSigtb />} />
            <Route path="integraciones/netlab" element={<IntegracionNetlab />} />
            
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
