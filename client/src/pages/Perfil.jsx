import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Shield, Building2, Lock, Eye, EyeOff, Save } from 'lucide-react'
import toast from 'react-hot-toast'

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
        <p className="text-gray-600 mt-1">Gestiona tu información personal y seguridad</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Usuario */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Información Personal
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Nombres
              </label>
              <p className="text-gray-900 font-medium">
                {user.nombres || 'No especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Apellidos
              </label>
              <p className="text-gray-900 font-medium">
                {user.apellidos || 'No especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo Electrónico
              </label>
              <p className="text-gray-900 font-medium">
                {user.email || 'No especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Rol
              </label>
              <p className="text-gray-900 font-medium">
                {user.role?.nombre || 'Sin rol asignado'}
              </p>
              {user.role?.descripcion && (
                <p className="text-sm text-gray-500 mt-1">
                  {user.role.descripcion}
                </p>
              )}
            </div>

            {user.establecimiento_salud && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Establecimiento de Salud
                </label>
                <p className="text-gray-900 font-medium">
                  {user.establecimiento_salud.nombre || 'No especificado'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Cambiar Contraseña
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                La contraseña debe tener al menos 6 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Confirma tu nueva contraseña"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Cambiar Contraseña
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Perfil
