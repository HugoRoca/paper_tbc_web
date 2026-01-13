const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IntegracionLog = sequelize.define('IntegracionLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sistema_externo: {
      type: DataTypes.ENUM('SIGTB', 'NETLAB', 'Otro'),
      allowNull: false
    },
    tipo_operacion: {
      type: DataTypes.ENUM('Consulta', 'Envío', 'Recepción', 'Sincronización'),
      allowNull: false
    },
    endpoint: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    datos_enviados: {
      type: DataTypes.JSON,
      allowNull: true
    },
    datos_recibidos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Exitoso', 'Error', 'Pendiente'),
      allowNull: false,
      defaultValue: 'Pendiente'
    },
    codigo_respuesta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mensaje_error: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'integraciones_log',
    timestamps: true,
    updatedAt: false, // Solo created_at
    createdAt: 'created_at'
  });

  return IntegracionLog;
};
