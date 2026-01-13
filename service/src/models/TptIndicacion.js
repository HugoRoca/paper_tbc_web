const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TptIndicacion = sequelize.define('TptIndicacion', {
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
    esquema_tpt_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'esquemas_tpt',
        key: 'id'
      }
    },
    fecha_indicacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_fin_prevista: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Indicado', 'En curso', 'Completado', 'Suspenso', 'Abandonado'),
      defaultValue: 'Indicado'
    },
    motivo_indicacion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    establecimiento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establecimientos_salud',
        key: 'id'
      }
    },
    usuario_indicacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'tpt_indicaciones',
    timestamps: true
  });

  return TptIndicacion;
};
