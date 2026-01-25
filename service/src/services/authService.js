const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { Usuario } = require('../models');

const authService = {
  /**
   * Autenticar usuario y generar token
   */
  async login(email, password) {
    // Buscar usuario con password_hash (no excluir en este caso)
    const user = await Usuario.findOne({
      where: { email, activo: true },
      include: [{
        model: require('../models').Role,
        as: 'rol',
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const userData = user.toJSON();
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Actualizar último acceso
    await Usuario.update(
      { ultimo_acceso: new Date() },
      { where: { id: userData.id } }
    );

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        rol_id: userData.rol_id
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return {
      token,
      user: {
        id: userData.id,
        email: userData.email,
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        rol_id: userData.rol_id,
        rol_nombre: userData.rol?.nombre,
        rol: userData.rol || null,
        establecimiento_id: userData.establecimiento_id
      }
    };
  },

  /**
   * Hashear contraseña
   */
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  /**
   * Verificar token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
};

module.exports = authService;
