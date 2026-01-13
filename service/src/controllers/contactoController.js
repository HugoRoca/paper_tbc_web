const contactoService = require('../services/contactoService');

const contactoController = {
  /**
   * @swagger
   * /api/contactos:
   *   post:
   *     summary: Crear nuevo contacto
   *     tags: [Contactos]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - caso_indice_id
   *               - nombres
   *               - apellidos
   *               - tipo_contacto
   *               - establecimiento_id
   *             properties:
   *               caso_indice_id:
   *                 type: integer
   *               dni:
   *                 type: string
   *               nombres:
   *                 type: string
   *               apellidos:
   *                 type: string
   *               fecha_nacimiento:
   *                 type: string
   *                 format: date
   *               sexo:
   *                 type: string
   *                 enum: [M, F, Otro]
   *               tipo_contacto:
   *                 type: string
   *                 enum: [Intradomiciliario, Extradomiciliario]
   *               parentesco:
   *                 type: string
   *               direccion:
   *                 type: string
   *               telefono:
   *                 type: string
   *               establecimiento_id:
   *                 type: integer
   *               fecha_registro:
   *                 type: string
   *                 format: date
   *               observaciones:
   *                 type: string
   *     responses:
   *       201:
   *         description: Contacto creado exitosamente
   */
  async create(ctx) {
    try {
      const contactoData = ctx.request.body;
      const userId = ctx.state.user.id;
      
      const contacto = await contactoService.create(contactoData, userId);
      
      ctx.status = 201;
      ctx.body = {
        success: true,
        data: contacto
      };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/contactos:
   *   get:
   *     summary: Listar contactos
   *     tags: [Contactos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *       - in: query
   *         name: caso_indice_id
   *         schema:
   *           type: integer
   *       - in: query
   *         name: tipo_contacto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de contactos
   */
  async list(ctx) {
    try {
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 10;
      const filters = {
        caso_indice_id: ctx.query.caso_indice_id ? parseInt(ctx.query.caso_indice_id) : undefined,
        tipo_contacto: ctx.query.tipo_contacto,
        establecimiento_id: ctx.query.establecimiento_id ? parseInt(ctx.query.establecimiento_id) : undefined,
        dni: ctx.query.dni
      };

      Object.keys(filters).forEach(key => 
        filters[key] === undefined && delete filters[key]
      );

      const result = await contactoService.list(page, limit, filters);
      
      ctx.body = {
        success: true,
        ...result
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/contactos/{id}:
   *   get:
   *     summary: Obtener contacto por ID
   *     tags: [Contactos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Contacto encontrado
   */
  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const contacto = await contactoService.getById(id);
      
      ctx.body = {
        success: true,
        data: contacto
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/contactos/caso-indice/{casoIndiceId}:
   *   get:
   *     summary: Listar contactos por caso índice
   *     tags: [Contactos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: casoIndiceId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lista de contactos
   */
  async getByCasoIndice(ctx) {
    try {
      const casoIndiceId = parseInt(ctx.params.casoIndiceId);
      const contactos = await contactoService.getByCasoIndice(casoIndiceId);
      
      ctx.body = {
        success: true,
        data: contactos
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/contactos/{id}:
   *   put:
   *     summary: Actualizar contacto
   *     tags: [Contactos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Contacto actualizado
   */
  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const contactoData = ctx.request.body;
      
      const contacto = await contactoService.update(id, contactoData);
      
      ctx.body = {
        success: true,
        data: contacto
      };
    } catch (error) {
      ctx.status = error.message.includes('no encontrado') ? 404 : 400;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * @swagger
   * /api/contactos/{id}:
   *   delete:
   *     summary: Eliminar contacto
   *     tags: [Contactos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Contacto eliminado
   */
  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await contactoService.delete(id);
      
      ctx.body = {
        success: true,
        message: 'Contacto eliminado exitosamente'
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: error.message
      };
    }
  }
};

module.exports = contactoController;
