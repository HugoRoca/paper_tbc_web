const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ControlContacto = sequelize.define('ControlContacto', {
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
    numero_control: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_programada: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_realizada: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tipo_control: {
      type: DataTypes.ENUM('Clínico', 'Radiológico', 'Bacteriológico', 'Integral'),
      allowNull: false
    },
    resultado: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Programado', 'Realizado', 'No realizado', 'Cancelado'),
      defaultValue: 'Programado'
    },
    establecimiento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establecimientos_salud',
        key: 'id'
      }
    },
    usuario_programa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    usuario_realiza_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'controles_contacto',
    timestamps: true
  });

  return ControlContacto;
};
