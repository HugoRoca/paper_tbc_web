const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TptSeguimiento = sequelize.define('TptSeguimiento', {
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
    fecha_seguimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dosis_administrada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    observaciones_administracion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    efectos_adversos: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    }
  }, {
    tableName: 'tpt_seguimiento',
    timestamps: true
  });

  return TptSeguimiento;
};
