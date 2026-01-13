const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contacto = sequelize.define('Contacto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    caso_indice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'casos_indice',
        key: 'id'
      }
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellidos: {
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
    tipo_contacto: {
      type: DataTypes.ENUM('Intradomiciliario', 'Extradomiciliario'),
      allowNull: false
    },
    parentesco: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(20),
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
    fecha_registro: {
      type: DataTypes.DATEONLY,
      allowNull: false
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
    tableName: 'contactos',
    timestamps: true,
    defaultScope: {
      where: { activo: true }
    }
  });

  return Contacto;
};
