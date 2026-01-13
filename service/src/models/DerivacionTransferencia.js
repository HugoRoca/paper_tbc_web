const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DerivacionTransferencia = sequelize.define('DerivacionTransferencia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contacto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contactos',
        key: 'id'
      }
    },
    establecimiento_origen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establecimientos_salud',
        key: 'id'
      }
    },
    establecimiento_destino_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establecimientos_salud',
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.ENUM('Derivación', 'Transferencia'),
      allowNull: false
    },
    fecha_solicitud: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_aceptacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Aceptada', 'Rechazada', 'Completada'),
      defaultValue: 'Pendiente'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    usuario_solicita_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    usuario_acepta_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'derivaciones_transferencias',
    timestamps: true
  });

  return DerivacionTransferencia;
};
