const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'tbc_monitoring',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

// Importar modelos
const Role = require('./Role')(sequelize);
const Usuario = require('./Usuario')(sequelize);
const EstablecimientoSalud = require('./EstablecimientoSalud')(sequelize);
const CasoIndice = require('./CasoIndice')(sequelize);
const Contacto = require('./Contacto')(sequelize);
const ExamenContacto = require('./ExamenContacto')(sequelize);
const ControlContacto = require('./ControlContacto')(sequelize);
const EsquemaTpt = require('./EsquemaTpt')(sequelize);
const TptIndicacion = require('./TptIndicacion')(sequelize);
const TptConsentimiento = require('./TptConsentimiento')(sequelize);
const TptSeguimiento = require('./TptSeguimiento')(sequelize);
const ReaccionAdversa = require('./ReaccionAdversa')(sequelize);
const VisitaDomiciliaria = require('./VisitaDomiciliaria')(sequelize);
const DerivacionTransferencia = require('./DerivacionTransferencia')(sequelize);
const Alerta = require('./Alerta')(sequelize);

// Definir asociaciones
// Usuario - Role
Usuario.belongsTo(Role, { foreignKey: 'rol_id', as: 'rol' });
Role.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });

// Usuario - Establecimiento
Usuario.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(Usuario, { foreignKey: 'establecimiento_id', as: 'usuarios' });

// CasoIndice - Establecimiento
CasoIndice.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(CasoIndice, { foreignKey: 'establecimiento_id', as: 'casosIndice' });

// CasoIndice - Usuario (registro)
CasoIndice.belongsTo(Usuario, { foreignKey: 'usuario_registro_id', as: 'usuarioRegistro' });
Usuario.hasMany(CasoIndice, { foreignKey: 'usuario_registro_id', as: 'casosIndiceRegistrados' });

// Contacto - CasoIndice
Contacto.belongsTo(CasoIndice, { foreignKey: 'caso_indice_id', as: 'casoIndice' });
CasoIndice.hasMany(Contacto, { foreignKey: 'caso_indice_id', as: 'contactos' });

// Contacto - Establecimiento
Contacto.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(Contacto, { foreignKey: 'establecimiento_id', as: 'contactos' });

// Contacto - Usuario (registro)
Contacto.belongsTo(Usuario, { foreignKey: 'usuario_registro_id', as: 'usuarioRegistro' });
Usuario.hasMany(Contacto, { foreignKey: 'usuario_registro_id', as: 'contactosRegistrados' });

// ExamenContacto - Contacto
ExamenContacto.belongsTo(Contacto, { foreignKey: 'contacto_id', as: 'contacto' });
Contacto.hasMany(ExamenContacto, { foreignKey: 'contacto_id', as: 'examenes' });

// ControlContacto - Contacto
ControlContacto.belongsTo(Contacto, { foreignKey: 'contacto_id', as: 'contacto' });
Contacto.hasMany(ControlContacto, { foreignKey: 'contacto_id', as: 'controles' });

// TptIndicacion - Contacto
TptIndicacion.belongsTo(Contacto, { foreignKey: 'contacto_id', as: 'contacto' });
Contacto.hasMany(TptIndicacion, { foreignKey: 'contacto_id', as: 'tptIndicaciones' });

// TptIndicacion - EsquemaTpt
TptIndicacion.belongsTo(EsquemaTpt, { foreignKey: 'esquema_tpt_id', as: 'esquemaTpt' });
EsquemaTpt.hasMany(TptIndicacion, { foreignKey: 'esquema_tpt_id', as: 'indicaciones' });

// TptConsentimiento - TptIndicacion
TptConsentimiento.belongsTo(TptIndicacion, { foreignKey: 'tpt_indicacion_id', as: 'tptIndicacion' });
TptIndicacion.hasOne(TptConsentimiento, { foreignKey: 'tpt_indicacion_id', as: 'consentimiento' });

// TptSeguimiento - TptIndicacion
TptSeguimiento.belongsTo(TptIndicacion, { foreignKey: 'tpt_indicacion_id', as: 'tptIndicacion' });
TptIndicacion.hasMany(TptSeguimiento, { foreignKey: 'tpt_indicacion_id', as: 'seguimientos' });

// ReaccionAdversa - TptIndicacion
ReaccionAdversa.belongsTo(TptIndicacion, { foreignKey: 'tpt_indicacion_id', as: 'tptIndicacion' });
TptIndicacion.hasMany(ReaccionAdversa, { foreignKey: 'tpt_indicacion_id', as: 'reaccionesAdversas' });

// VisitaDomiciliaria - Contacto
VisitaDomiciliaria.belongsTo(Contacto, { foreignKey: 'contacto_id', as: 'contacto' });
Contacto.hasMany(VisitaDomiciliaria, { foreignKey: 'contacto_id', as: 'visitas' });

// VisitaDomiciliaria - CasoIndice
VisitaDomiciliaria.belongsTo(CasoIndice, { foreignKey: 'caso_indice_id', as: 'casoIndice' });
CasoIndice.hasMany(VisitaDomiciliaria, { foreignKey: 'caso_indice_id', as: 'visitas' });

// DerivacionTransferencia - Contacto
DerivacionTransferencia.belongsTo(Contacto, { foreignKey: 'contacto_id', as: 'contacto' });
Contacto.hasMany(DerivacionTransferencia, { foreignKey: 'contacto_id', as: 'derivaciones' });

// DerivacionTransferencia - EstablecimientoSalud (origen)
DerivacionTransferencia.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_origen_id', as: 'establecimientoOrigen' });
EstablecimientoSalud.hasMany(DerivacionTransferencia, { foreignKey: 'establecimiento_origen_id', as: 'derivacionesOrigen' });

// DerivacionTransferencia - EstablecimientoSalud (destino)
DerivacionTransferencia.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_destino_id', as: 'establecimientoDestino' });
EstablecimientoSalud.hasMany(DerivacionTransferencia, { foreignKey: 'establecimiento_destino_id', as: 'derivacionesDestino' });

// DerivacionTransferencia - Usuario (solicita)
DerivacionTransferencia.belongsTo(Usuario, { foreignKey: 'usuario_solicita_id', as: 'usuarioSolicita' });
Usuario.hasMany(DerivacionTransferencia, { foreignKey: 'usuario_solicita_id', as: 'derivacionesSolicitadas' });

// DerivacionTransferencia - Usuario (acepta)
DerivacionTransferencia.belongsTo(Usuario, { foreignKey: 'usuario_acepta_id', as: 'usuarioAcepta' });
Usuario.hasMany(DerivacionTransferencia, { foreignKey: 'usuario_acepta_id', as: 'derivacionesAceptadas' });

// Alerta - Contacto
Alerta.belongsTo(Contacto, { foreignKey: 'contacto_id', as: 'contacto' });
Contacto.hasMany(Alerta, { foreignKey: 'contacto_id', as: 'alertas' });

// Alerta - CasoIndice
Alerta.belongsTo(CasoIndice, { foreignKey: 'caso_indice_id', as: 'casoIndice' });
CasoIndice.hasMany(Alerta, { foreignKey: 'caso_indice_id', as: 'alertas' });

// Alerta - TptIndicacion
Alerta.belongsTo(TptIndicacion, { foreignKey: 'tpt_indicacion_id', as: 'tptIndicacion' });
TptIndicacion.hasMany(Alerta, { foreignKey: 'tpt_indicacion_id', as: 'alertas' });

// Alerta - ControlContacto
Alerta.belongsTo(ControlContacto, { foreignKey: 'control_contacto_id', as: 'controlContacto' });
ControlContacto.hasMany(Alerta, { foreignKey: 'control_contacto_id', as: 'alertas' });

// Alerta - VisitaDomiciliaria
Alerta.belongsTo(VisitaDomiciliaria, { foreignKey: 'visita_domiciliaria_id', as: 'visitaDomiciliaria' });
VisitaDomiciliaria.hasMany(Alerta, { foreignKey: 'visita_domiciliaria_id', as: 'alertas' });

// Alerta - Usuario (resuelve)
Alerta.belongsTo(Usuario, { foreignKey: 'usuario_resuelve_id', as: 'usuarioResuelve' });
Usuario.hasMany(Alerta, { foreignKey: 'usuario_resuelve_id', as: 'alertasResueltas' });

// ExamenContacto - EstablecimientoSalud
ExamenContacto.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(ExamenContacto, { foreignKey: 'establecimiento_id', as: 'examenes' });

// ExamenContacto - Usuario
ExamenContacto.belongsTo(Usuario, { foreignKey: 'usuario_registro_id', as: 'usuarioRegistro' });
Usuario.hasMany(ExamenContacto, { foreignKey: 'usuario_registro_id', as: 'examenesRegistrados' });

// ControlContacto - EstablecimientoSalud
ControlContacto.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(ControlContacto, { foreignKey: 'establecimiento_id', as: 'controles' });

// ControlContacto - Usuario (programa)
ControlContacto.belongsTo(Usuario, { foreignKey: 'usuario_programa_id', as: 'usuarioPrograma' });
Usuario.hasMany(ControlContacto, { foreignKey: 'usuario_programa_id', as: 'controlesProgramados' });

// ControlContacto - Usuario (realiza)
ControlContacto.belongsTo(Usuario, { foreignKey: 'usuario_realiza_id', as: 'usuarioRealiza' });
Usuario.hasMany(ControlContacto, { foreignKey: 'usuario_realiza_id', as: 'controlesRealizados' });

// TptIndicacion - EstablecimientoSalud
TptIndicacion.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(TptIndicacion, { foreignKey: 'establecimiento_id', as: 'tptIndicaciones' });

// TptIndicacion - Usuario
TptIndicacion.belongsTo(Usuario, { foreignKey: 'usuario_indicacion_id', as: 'usuarioIndicacion' });
Usuario.hasMany(TptIndicacion, { foreignKey: 'usuario_indicacion_id', as: 'tptIndicacionesRealizadas' });

// TptConsentimiento - Usuario
TptConsentimiento.belongsTo(Usuario, { foreignKey: 'usuario_registro_id', as: 'usuarioRegistro' });
Usuario.hasMany(TptConsentimiento, { foreignKey: 'usuario_registro_id', as: 'tptConsentimientosRegistrados' });

// TptSeguimiento - EstablecimientoSalud
TptSeguimiento.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(TptSeguimiento, { foreignKey: 'establecimiento_id', as: 'tptSeguimientos' });

// TptSeguimiento - Usuario
TptSeguimiento.belongsTo(Usuario, { foreignKey: 'usuario_registro_id', as: 'usuarioRegistro' });
Usuario.hasMany(TptSeguimiento, { foreignKey: 'usuario_registro_id', as: 'tptSeguimientosRegistrados' });

// ReaccionAdversa - EstablecimientoSalud
ReaccionAdversa.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(ReaccionAdversa, { foreignKey: 'establecimiento_id', as: 'reaccionesAdversas' });

// ReaccionAdversa - Usuario
ReaccionAdversa.belongsTo(Usuario, { foreignKey: 'usuario_registro_id', as: 'usuarioRegistro' });
Usuario.hasMany(ReaccionAdversa, { foreignKey: 'usuario_registro_id', as: 'reaccionesAdversasRegistradas' });

// VisitaDomiciliaria - EstablecimientoSalud
VisitaDomiciliaria.belongsTo(EstablecimientoSalud, { foreignKey: 'establecimiento_id', as: 'establecimiento' });
EstablecimientoSalud.hasMany(VisitaDomiciliaria, { foreignKey: 'establecimiento_id', as: 'visitas' });

// VisitaDomiciliaria - Usuario
VisitaDomiciliaria.belongsTo(Usuario, { foreignKey: 'usuario_visita_id', as: 'usuarioVisita' });
Usuario.hasMany(VisitaDomiciliaria, { foreignKey: 'usuario_visita_id', as: 'visitasRealizadas' });

// Testear conexión
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully with Sequelize');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

module.exports = {
  sequelize,
  Role,
  Usuario,
  EstablecimientoSalud,
  CasoIndice,
  Contacto,
  ExamenContacto,
  ControlContacto,
  EsquemaTpt,
  TptIndicacion,
  TptConsentimiento,
  TptSeguimiento,
  ReaccionAdversa,
  VisitaDomiciliaria,
  DerivacionTransferencia,
  Alerta
};
