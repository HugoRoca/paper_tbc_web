const casoIndiceService = require('../services/casoIndiceService');

const casoIndiceController = {
  /**
   * @swagger
   * /api/casos-indice:
   *   post:
   *     summary: Crear nuevo caso índice
   *     tags: [Casos Índice]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - paciente_nombres
   *               - paciente_apellidos
   *               - tipo_tb
   *               - fecha_diagnostico
   *               - establecimiento_id
   *             properties:
   *               codigo_caso:
   *                 type: string
   *               paciente_dni:
   *                 type: string
   *               paciente_nombres:
   *                 type: string
   *               paciente_apellidos:
   *                 type: string
   *               fecha_nacimiento:
   *                 type: string
   *                 format: date
   *               sexo:
   *                 type: string
   *                 enum: [M, F, Otro]
   *               tipo_tb:
   *                 type: string
   *                 enum: [Pulmonar, Extrapulmonar, Miliar, Meningea]
   *               fecha_diagnostico:
   *                 type: string
   *                 format: date
   *               establecimiento_id:
   *                 type: integer
   *               observaciones:
   *                 type: string
   *     responses:
   *       201:
   *         description: Caso índice creado exitosamente
   */
  async create(ctx) {
    try {
      const casoData = ctx.request.body;
      const userId = ctx.state.user.id;
      
      const caso = await casoIndiceService.create(casoData, userId);
      
      ctx.status = 201;
      ctx.body = {
        success: true,
        data: caso
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
   * /api/casos-indice:
   *   get:
   *     summary: Listar casos índice
   *     tags: [Casos Índice]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Elementos por página
   *       - in: query
   *         name: tipo_tb
   *         schema:
   *           type: string
   *         description: Filtrar por tipo de TB
   *       - in: query
   *         name: establecimiento_id
   *         schema:
   *           type: integer
   *         description: Filtrar por establecimiento
   *     responses:
   *       200:
   *         description: Lista de casos índice
   */
  async list(ctx) {
    try {
      const page = parseInt(ctx.query.page) || 1;
      const limit = parseInt(ctx.query.limit) || 10;
      const filters = {
        tipo_tb: ctx.query.tipo_tb,
        establecimiento_id: ctx.query.establecimiento_id ? parseInt(ctx.query.establecimiento_id) : undefined,
        paciente_dni: ctx.query.paciente_dni
      };

      // Remover filtros undefined
      Object.keys(filters).forEach(key => 
        filters[key] === undefined && delete filters[key]
      );

      const result = await casoIndiceService.list(page, limit, filters);
      
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
   * /api/casos-indice/{id}:
   *   get:
   *     summary: Obtener caso índice por ID
   *     tags: [Casos Índice]
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
   *         description: Caso índice encontrado
   *       404:
   *         description: Caso índice no encontrado
   */
  async getById(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const caso = await casoIndiceService.getById(id);
      
      ctx.body = {
        success: true,
        data: caso
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
   * /api/casos-indice/{id}:
   *   put:
   *     summary: Actualizar caso índice
   *     tags: [Casos Índice]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Caso índice actualizado
   */
  async update(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      const casoData = ctx.request.body;
      const userId = ctx.state.user.id;
      
      const caso = await casoIndiceService.update(id, casoData, userId);
      
      ctx.body = {
        success: true,
        data: caso
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
   * /api/casos-indice/{id}:
   *   delete:
   *     summary: Eliminar caso índice
   *     tags: [Casos Índice]
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
   *         description: Caso índice eliminado
   */
  async delete(ctx) {
    try {
      const id = parseInt(ctx.params.id);
      await casoIndiceService.delete(id);
      
      ctx.body = {
        success: true,
        message: 'Caso índice eliminado exitosamente'
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

module.exports = casoIndiceController;
