const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReaccionAdversa = sequelize.define('ReaccionAdversa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tpt_indicacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tpt_indicaciones',
        key: 'id'
      }
    },
    fecha_reaccion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tipo_reaccion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    severidad: {
      type: DataTypes.ENUM('Leve', 'Moderada', 'Severa', 'Grave'),
      allowNull: false
    },
    sintomas: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    accion_tomada: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medicamento_sospechoso: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    resultado: {
      type: DataTypes.ENUM('En seguimiento', 'Resuelto', 'Pendiente'),
      defaultValue: 'En seguimiento'
    },
    establecimiento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'establecimientos_salud',
        key: 'id'
      }
    },
    usuario_registro_id: {
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
    tableName: 'reacciones_adversas',
    timestamps: true
  });

  return ReaccionAdversa;
};
