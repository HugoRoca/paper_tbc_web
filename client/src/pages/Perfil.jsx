import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Shield, Building2, Lock, Eye, EyeOff, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Loading from '../components/Loading'

const Perfil = () => {
  const { user, changePassword } = useAuth()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Todos los campos son requeridos')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('La nueva contraseña debe ser diferente a la actual')
      return
    }

    setLoading(true)
    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword)
      if (result && result.success) {
        toast.success('Contraseña actualizada correctamente')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(result?.error || 'Error al cambiar contraseña')
      }
    } catch (error) {
      console.error('Error en handleChangePassword:', error)
      toast.error('Error inesperado al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <Loading message="Cargando información del usuario..." />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mi Perfil</h2>
        <p className="text-gray-600 mt-1 flex items-center gap-2">
          <User className="w-4 h-4" />
          Gestiona tu información personal y seguridad
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Usuario */}
        <Card hover>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Información Personal</h3>
          </div>
          
          <div className="space-y-5">
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                Nombres
              </label>
              <p className="text-gray-900 font-semibold text-lg">
                {user.nombres || 'No especificado'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                Apellidos
              </label>
              <p className="text-gray-900 font-semibold text-lg">
                {user.apellidos || 'No especificado'}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo Electrónico
              </label>
              <p className="text-blue-900 font-semibold text-lg">
                {user.email || 'No especificado'}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Rol
              </label>
              <Badge variant="primary" size="lg" className="mt-1">
                {user.role?.nombre || user.rol?.nombre || 'Sin rol asignado'}
              </Badge>
              {user.role?.descripcion && (
                <p className="text-sm text-gray-600 mt-2">
                  {user.role.descripcion}
                </p>
              )}
            </div>

            {user.establecimiento_salud && (
              <div className="p-4 bg-green-50 rounded-xl">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Establecimiento de Salud
                </label>
                <p className="text-green-900 font-semibold text-lg">
                  {user.establecimiento_salud.nombre || 'No especificado'}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Cambiar Contraseña */}
        <Card hover>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Cambiar Contraseña</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña Actual
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="input pl-11 pr-11"
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="input pl-11 pr-11"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                La contraseña debe tener al menos 6 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input pl-11 pr-11"
                  placeholder="Confirma tu nueva contraseña"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              icon={Save}
              className="w-full"
            >
              Cambiar Contraseña
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Perfil
