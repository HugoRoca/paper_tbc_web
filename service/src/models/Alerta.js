const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alerta = sequelize.define('Alerta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo_alerta: {
      type: DataTypes.ENUM('Control no realizado', 'TPT no iniciada', 'TPT abandonada', 'Visita no realizada', 'Otro'),
      allowNull: false
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
    tpt_indicacion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tpt_indicaciones',
        key: 'id'
      }
    },
    control_contacto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'controles_contacto',
        key: 'id'
      }
    },
    visita_domiciliaria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'visitas_domiciliarias',
        key: 'id'
      }
    },
    severidad: {
      type: DataTypes.ENUM('Baja', 'Media', 'Alta', 'Crítica'),
      defaultValue: 'Media'
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha_alerta: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_resolucion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Activa', 'En revisión', 'Resuelta', 'Descartada'),
      defaultValue: 'Activa'
    },
    usuario_resuelve_id: {
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
    tableName: 'alertas',
    timestamps: true
  });

  return Alerta;
};
