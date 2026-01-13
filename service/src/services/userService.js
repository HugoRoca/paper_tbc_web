const userRepository = require('../repositories/userRepository');
const authService = require('./authService');
const { Role } = require('../models');

const userService = {
  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    // Verificar que el email no exista
    const existingEmail = await userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('El email ya está registrado');
    }

    // Verificar que el DNI no exista (si se proporciona)
    if (userData.dni) {
      const existingDni = await userRepository.findByDni(userData.dni);
      if (existingDni) {
        throw new Error('El DNI ya está registrado');
      }
    }

    // Verificar que el rol existe
    const role = await userRepository.getRoleById(userData.rol_id);
    if (!role) {
      throw new Error('El rol especificado no existe');
    }

    // Hashear contraseña
    if (!userData.password) {
      throw new Error('La contraseña es requerida');
    }
    userData.password_hash = await authService.hashPassword(userData.password);
    delete userData.password;

    return await userRepository.create(userData);
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    // Excluir password_hash
    delete user.password_hash;
    return user;
  },

  /**
   * Listar usuarios
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await userRepository.findAll(page, limit, filters);
  },

  /**
   * Actualizar usuario
   */
  async update(id, userData) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar email único si se está cambiando
    if (userData.email && userData.email !== user.email) {
      const existing = await userRepository.findByEmail(userData.email);
      if (existing) {
        throw new Error('El email ya está registrado');
      }
    }

    // Verificar DNI único si se está cambiando
    if (userData.dni && userData.dni !== user.dni) {
      const existing = await userRepository.findByDni(userData.dni);
      if (existing) {
        throw new Error('El DNI ya está registrado');
      }
    }

    // Verificar rol si se está cambiando
    if (userData.rol_id && userData.rol_id !== user.rol_id) {
      const role = await userRepository.getRoleById(userData.rol_id);
      if (!role) {
        throw new Error('El rol especificado no existe');
      }
    }

    // No permitir cambiar password aquí
    delete userData.password;
    delete userData.password_hash;

    return await userRepository.update(id, userData);
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(id, currentPassword, newPassword) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isValid = await require('bcrypt').compare(currentPassword, user.password_hash);
    if (!isValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Hashear nueva contraseña
    const newPasswordHash = await authService.hashPassword(newPassword);
    await userRepository.updatePassword(id, newPasswordHash);

    return { message: 'Contraseña actualizada correctamente' };
  },

  /**
   * Eliminar usuario (soft delete)
   */
  async delete(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return await userRepository.delete(id);
  }
};

module.exports = userService;
