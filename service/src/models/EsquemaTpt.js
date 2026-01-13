const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EsquemaTpt = sequelize.define('EsquemaTpt', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duracion_meses: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    medicamentos: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'esquemas_tpt',
    timestamps: true
  });

  return EsquemaTpt;
};
