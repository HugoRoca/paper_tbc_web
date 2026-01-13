const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CasoIndice = sequelize.define('CasoIndice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo_caso: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    paciente_dni: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    paciente_nombres: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    paciente_apellidos: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    sexo: {
      type: DataTypes.ENUM('M', 'F', 'Otro'),
      allowNull: true
    },
    tipo_tb: {
      type: DataTypes.ENUM('Pulmonar', 'Extrapulmonar', 'Miliar', 'Meningea'),
      allowNull: false
    },
    fecha_diagnostico: {
      type: DataTypes.DATEONLY,
      allowNull: false
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
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'casos_indice',
    timestamps: true,
    defaultScope: {
      where: { activo: true }
    }
  });

  return CasoIndice;
};
