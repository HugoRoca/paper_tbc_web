const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ExamenContacto = sequelize.define('ExamenContacto', {
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
    fecha_examen: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tipo_examen: {
      type: DataTypes.ENUM('Clínico', 'Radiológico', 'Inmunológico', 'Bacteriológico', 'Integral'),
      allowNull: false
    },
    resultado: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resultado_codificado: {
      type: DataTypes.STRING(50),
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
    tableName: 'examenes_contacto',
    timestamps: true
  });

  return ExamenContacto;
};
