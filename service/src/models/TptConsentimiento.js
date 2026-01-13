const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TptConsentimiento = sequelize.define('TptConsentimiento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tpt_indicacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'tpt_indicaciones',
        key: 'id'
      }
    },
    fecha_consentimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    consentimiento_firmado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ruta_archivo_consentimiento: {
      type: DataTypes.STRING(500),
      allowNull: true
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
    tableName: 'tpt_consentimientos',
    timestamps: true
  });

  return TptConsentimiento;
};
