const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Auditoria = sequelize.define('Auditoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    tabla_afectada: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    registro_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accion: {
      type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT', 'LOGIN', 'LOGOUT'),
      allowNull: false
    },
    datos_anteriores: {
      type: DataTypes.JSON,
      allowNull: true
    },
    datos_nuevos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_accion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'auditoria',
    timestamps: false // Usa fecha_accion en lugar de created_at
  });

  return Auditoria;
};
