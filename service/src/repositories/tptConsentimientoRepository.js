const { TptConsentimiento, TptIndicacion, Usuario } = require('../models');

const tptConsentimientoRepository = {
  /**
   * Crear nuevo consentimiento TPT
   */
  async create(consentimientoData) {
    const consentimiento = await TptConsentimiento.create(consentimientoData);
    return await this.findById(consentimiento.id);
  },

  /**
   * Buscar consentimiento por ID
   */
  async findById(id) {
    const consentimiento = await TptConsentimiento.findByPk(id, {
      include: [
        {
          model: TptIndicacion,
          as: 'tptIndicacion',
          attributes: ['id', 'fecha_indicacion', 'estado']
        },
        {
          model: Usuario,
          as: 'usuarioRegistro',
          attributes: ['id', 'nombres', 'apellidos']
        }
      ]
    });
    return consentimiento ? consentimiento.toJSON() : null;
  },

  /**
   * Buscar consentimiento por indicación TPT
   */
  async findByTptIndicacion(tptIndicacionId) {
    const consentimiento = await TptConsentimiento.findOne({
      where: { tpt_indicacion_id: tptIndicacionId },
      include: [
        {
          model: Usuario,
          as: 'usuarioRegistro',
          attributes: ['id', 'nombres', 'apellidos']
        }
      ]
    });
    return consentimiento ? consentimiento.toJSON() : null;
  },

  /**
   * Actualizar consentimiento
   */
  async update(id, consentimientoData) {
    await TptConsentimiento.update(consentimientoData, {
      where: { id }
    });
    return await this.findById(id);
  },

  /**
   * Eliminar consentimiento
   */
  async delete(id) {
    await TptConsentimiento.destroy({
      where: { id }
    });
    return true;
  }
};

module.exports = tptConsentimientoRepository;
