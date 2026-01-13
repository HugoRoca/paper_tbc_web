const derivacionTransferenciaRepository = require('../repositories/derivacionTransferenciaRepository');
const contactoRepository = require('../repositories/contactoRepository');
const establecimientoSaludRepository = require('../repositories/establecimientoSaludRepository');

const derivacionTransferenciaService = {
  /**
   * Crear nueva derivación/transferencia
   */
  async create(derivacionData, userId) {
    // Verificar que el contacto existe
    const contacto = await contactoRepository.findById(derivacionData.contacto_id);
    if (!contacto) {
      throw new Error('Contacto no encontrado');
    }

    // Verificar que los establecimientos existen
    const origen = await establecimientoSaludRepository.findById(derivacionData.establecimiento_origen_id);
    if (!origen) {
      throw new Error('Establecimiento origen no encontrado');
    }

    const destino = await establecimientoSaludRepository.findById(derivacionData.establecimiento_destino_id);
    if (!destino) {
      throw new Error('Establecimiento destino no encontrado');
    }

    if (derivacionData.establecimiento_origen_id === derivacionData.establecimiento_destino_id) {
      throw new Error('El establecimiento origen y destino no pueden ser el mismo');
    }

    derivacionData.usuario_solicita_id = userId;
    derivacionData.estado = 'Pendiente';
    return await derivacionTransferenciaRepository.create(derivacionData);
  },

  /**
   * Obtener derivación por ID
   */
  async getById(id) {
    const derivacion = await derivacionTransferenciaRepository.findById(id);
    if (!derivacion) {
      throw new Error('Derivación/Transferencia no encontrada');
    }
    return derivacion;
  },

  /**
   * Listar derivaciones por contacto
   */
  async getByContacto(contactoId) {
    return await derivacionTransferenciaRepository.findByContacto(contactoId);
  },

  /**
   * Listar derivaciones pendientes por establecimiento destino
   */
  async getPendientesByEstablecimiento(establecimientoId) {
    return await derivacionTransferenciaRepository.findPendientesByEstablecimiento(establecimientoId);
  },

  /**
   * Listar derivaciones
   */
  async list(page = 1, limit = 10, filters = {}) {
    return await derivacionTransferenciaRepository.findAll(page, limit, filters);
  },

  /**
   * Aceptar derivación
   */
  async aceptar(id, usuarioId) {
    const derivacion = await derivacionTransferenciaRepository.findById(id);
    if (!derivacion) {
      throw new Error('Derivación/Transferencia no encontrada');
    }

    if (derivacion.estado !== 'Pendiente') {
      throw new Error('Solo se pueden aceptar derivaciones pendientes');
    }

    return await derivacionTransferenciaRepository.update(id, {
      estado: 'Aceptada',
      fecha_aceptacion: new Date().toISOString().split('T')[0],
      usuario_acepta_id: usuarioId
    });
  },

  /**
   * Rechazar derivación
   */
  async rechazar(id, motivo, usuarioId) {
    const derivacion = await derivacionTransferenciaRepository.findById(id);
    if (!derivacion) {
      throw new Error('Derivación/Transferencia no encontrada');
    }

    if (derivacion.estado !== 'Pendiente') {
      throw new Error('Solo se pueden rechazar derivaciones pendientes');
    }

    return await derivacionTransferenciaRepository.update(id, {
      estado: 'Rechazada',
      usuario_acepta_id: usuarioId,
      observaciones: motivo
    });
  },

  /**
   * Actualizar derivación
   */
  async update(id, derivacionData) {
    const derivacion = await derivacionTransferenciaRepository.findById(id);
    if (!derivacion) {
      throw new Error('Derivación/Transferencia no encontrada');
    }

    // No permitir cambiar ciertos campos
    delete derivacionData.contacto_id;
    delete derivacionData.usuario_solicita_id;

    return await derivacionTransferenciaRepository.update(id, derivacionData);
  },

  /**
   * Eliminar derivación
   */
  async delete(id) {
    const derivacion = await derivacionTransferenciaRepository.findById(id);
    if (!derivacion) {
      throw new Error('Derivación/Transferencia no encontrada');
    }
    return await derivacionTransferenciaRepository.delete(id);
  }
};

module.exports = derivacionTransferenciaService;
