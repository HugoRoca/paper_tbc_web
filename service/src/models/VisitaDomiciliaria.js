const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VisitaDomiciliaria = sequelize.define('VisitaDomiciliaria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contacto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contactos',
        key: 'id'
      }
    },
    caso_indice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'casos_indice',
        key: 'id'
      }
    },
    tipo_visita: {
      type: DataTypes.ENUM('Primer contacto', 'Seguimiento'),
      allowNull: false
    },
    fecha_visita: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_programada: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    hora_visita: {
      type: DataTypes.TIME,
      allowNull: true
    },
    direccion_visita: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resultado_visita: {
      type: DataTypes.ENUM('Realizada', 'No realizada', 'Reagendada'),
      defaultValue: 'Realizada'
    },
    motivo_no_realizada: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    observaciones: {
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
    usuario_visita_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'visitas_domiciliarias',
    timestamps: true
  });

  return VisitaDomiciliaria;
};
