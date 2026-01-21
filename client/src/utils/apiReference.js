/**
 * Referencia de API - Mapeo de Endpoints del Backend
 * 
 * Este archivo documenta los patrones comunes de endpoints, modelos y respuestas
 * del backend para evitar errores al implementar servicios en el frontend.
 * 
 * IMPORTANTE: Siempre consultar los controladores en service/src/controllers/
 * para verificar los nombres exactos de los campos y la estructura de las respuestas.
 */

/**
 * Estructura estándar de respuestas del backend
 */
export const API_RESPONSE_PATTERNS = {
  // Respuesta exitosa (GET, POST, PUT)
  success: {
    success: true,
    data: {}, // o array, o objeto con pagination
    pagination: { // solo en listados
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10
    }
  },
  
  // Respuesta de error
  error: {
    success: false,
    message: "Mensaje de error"
  }
}

/**
 * Endpoints de Autenticación
 * Referencia: service/src/controllers/authController.js
 */
export const AUTH_ENDPOINTS = {
  login: {
    method: 'POST',
    path: '/api/auth/login',
    body: {
      email: 'string',
      password: 'string'
    },
    response: {
      success: true,
      data: {
        token: 'string',
        user: {} // objeto Usuario
      }
    }
  },
  
  me: {
    method: 'GET',
    path: '/api/auth/me',
    response: {
      success: true,
      data: {
        user: {} // objeto Usuario completo
      }
    }
  }
}

/**
 * Endpoints de Usuarios
 * Referencia: service/src/controllers/userController.js
 */
export const USER_ENDPOINTS = {
  changePassword: {
    method: 'PUT',
    path: '/api/usuarios/:id/cambiar-password',
    body: {
      currentPassword: 'string', // ⚠️ NO usar password_actual
      newPassword: 'string' // ⚠️ NO usar password_nueva
    },
    response: {
      success: true,
      message: 'Contraseña actualizada correctamente'
    }
  }
}

/**
 * Endpoints de Casos Índice
 * Referencia: service/src/controllers/casoIndiceController.js
 */
export const CASO_INDICE_ENDPOINTS = {
  list: {
    method: 'GET',
    path: '/api/casos-indice',
    queryParams: {
      page: 'integer',
      limit: 'integer',
      tipo_tb: 'string', // enum: Pulmonar, Extrapulmonar, Miliar, Meningea
      establecimiento_id: 'integer'
    },
    response: {
      success: true,
      data: [], // array de CasoIndice
      pagination: {}
    }
  },
  
  create: {
    method: 'POST',
    path: '/api/casos-indice',
    body: {
      codigo_caso: 'string',
      paciente_dni: 'string',
      paciente_nombres: 'string', // required
      paciente_apellidos: 'string', // required
      fecha_nacimiento: 'date', // formato: YYYY-MM-DD
      sexo: 'string', // enum: M, F, Otro
      tipo_tb: 'string', // required, enum: Pulmonar, Extrapulmonar, Miliar, Meningea
      fecha_diagnostico: 'date', // required, formato: YYYY-MM-DD
      establecimiento_id: 'integer', // required
      observaciones: 'string'
    },
    response: {
      success: true,
      data: {} // objeto CasoIndice creado
    }
  }
}

/**
 * Endpoints de Contactos
 * Referencia: service/src/controllers/contactoController.js
 */
export const CONTACTO_ENDPOINTS = {
  list: {
    method: 'GET',
    path: '/api/contactos',
    queryParams: {
      page: 'integer',
      limit: 'integer',
      caso_indice_id: 'integer',
      tipo_contacto: 'string' // enum: Intradomiciliario, Extradomiciliario
    }
  },
  
  create: {
    method: 'POST',
    path: '/api/contactos',
    body: {
      caso_indice_id: 'integer', // required
      dni: 'string',
      nombres: 'string', // required
      apellidos: 'string', // required
      fecha_nacimiento: 'date',
      sexo: 'string', // enum: M, F, Otro
      tipo_contacto: 'string', // required, enum: Intradomiciliario, Extradomiciliario
      parentesco: 'string',
      direccion: 'string',
      telefono: 'string',
      establecimiento_id: 'integer', // required
      fecha_registro: 'date',
      observaciones: 'string'
    }
  }
}

/**
 * Patrones comunes de campos
 */
export const COMMON_FIELDS = {
  // Campos de fecha siempre en formato YYYY-MM-DD
  dateFormat: 'YYYY-MM-DD',
  
  // Enums comunes
  sexo: ['M', 'F', 'Otro'],
  tipoTB: ['Pulmonar', 'Extrapulmonar', 'Miliar', 'Meningea'],
  tipoContacto: ['Intradomiciliario', 'Extradomiciliario']
}

/**
 * Convenciones importantes:
 * 
 * 1. Nombres de campos: Usar snake_case como en el backend
 *    - paciente_nombres (NO pacienteNombres)
 *    - caso_indice_id (NO casoIndiceId)
 * 
 * 2. Respuestas: Siempre verificar response.success antes de acceder a response.data
 * 
 * 3. Paginación: Los listados devuelven { data: [], pagination: {} }
 * 
 * 4. Errores: Siempre en { success: false, message: "..." }
 * 
 * 5. Fechas: Formato YYYY-MM-DD en strings
 * 
 * 6. Enums: Verificar valores exactos en los controladores
 */

export default {
  API_RESPONSE_PATTERNS,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  CASO_INDICE_ENDPOINTS,
  CONTACTO_ENDPOINTS,
  COMMON_FIELDS
}
