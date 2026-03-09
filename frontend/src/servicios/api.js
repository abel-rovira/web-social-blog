import axios from 'axios';

// URL base de tu backend - CAMBIA ESTO SEGÚN TU IP
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
});

// Interceptor para agregar token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (opcional)
    console.log('Petición:', {
      url: config.url,
      method: config.method,
      data: config.data,
      token: token ? 'presente' : 'ausente'
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    // Log para debugging (opcional)
    console.log('Respuesta:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Manejar errores
    if (error.response) {
      // El servidor respondió con un error
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
      
      // Token expirado o no autorizado
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('No hubo respuesta del servidor:', error.request);
    } else {
      // Error al configurar la petición
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// =====================================
// SERVICIOS DE AUTENTICACIÓN
// =====================================
export const autenticacionAPI = {
  // Registro de nuevo usuario
  registro: async (datos) => {
    try {
      const response = await api.post('/autenticacion/registro', {
        nombreUsuario: datos.nombreUsuario,
        correo: datos.correo,
        contrasena: datos.contrasena
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Inicio de sesión
  login: async (datos) => {
    try {
      const response = await api.post('/autenticacion/login', {
        identificador: datos.identificador,
        contrasena: datos.contrasena
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario actual
  obtenerUsuarioActual: async () => {
    try {
      const response = await api.get('/autenticacion/yo');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// =====================================
// SERVICIOS DE USUARIOS
// =====================================
export const usuariosAPI = {
  // Obtener perfil por nombre de usuario
  obtenerPerfil: async (nombreUsuario) => {
    try {
      const response = await api.get(`/usuarios/${nombreUsuario}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar perfil (con imagen)
  actualizarPerfil: async (datos) => {
    try {
      const formData = new FormData();
      
      if (datos.nombreUsuario) formData.append('nombreUsuario', datos.nombreUsuario);
      if (datos.biografia) formData.append('biografia', datos.biografia);
      if (datos.correo) formData.append('correo', datos.correo);
      if (datos.enlaces) formData.append('enlaces', JSON.stringify(datos.enlaces));
      
      // Si hay archivo de avatar
      if (datos.avatar && datos.avatar instanceof File) {
        formData.append('avatar', datos.avatar);
      }

      const response = await api.put('/usuarios/perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar contraseña
  cambiarContrasena: async (datos) => {
    try {
      const response = await api.put('/usuarios/cambiar-contrasena', {
        contrasenaActual: datos.contrasenaActual,
        nuevaContrasena: datos.nuevaContrasena
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar usuarios
  buscarUsuarios: async (termino, pagina = 1) => {
    try {
      const response = await api.get(`/usuarios/buscar?termino=${encodeURIComponent(termino)}&pagina=${pagina}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// =====================================
// SERVICIOS DE PUBLICACIONES
// =====================================
export const publicacionesAPI = {
  // Obtener todas las publicaciones (feed global)
  obtenerTodas: async (pagina = 1, limite = 10) => {
    try {
      const response = await api.get(`/publicaciones?pagina=${pagina}&limite=${limite}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener feed personalizado (requiere autenticación)
  obtenerFeed: async (pagina = 1, limite = 10) => {
    try {
      const response = await api.get(`/publicaciones/feed?pagina=${pagina}&limite=${limite}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener publicaciones trending
  obtenerTrending: async () => {
    try {
      const response = await api.get('/publicaciones/explorar');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Buscar publicaciones
  buscar: async (termino, pagina = 1) => {
    try {
      const response = await api.get(`/publicaciones/buscar?termino=${encodeURIComponent(termino)}&pagina=${pagina}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener publicación por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/publicaciones/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear publicación
  crear: async (datos) => {
    try {
      const formData = new FormData();
      formData.append('titulo', datos.titulo);
      formData.append('contenido', datos.contenido);
      
      if (datos.etiquetas && datos.etiquetas.length > 0) {
        formData.append('etiquetas', JSON.stringify(datos.etiquetas));
      }
      
      if (datos.esBorrador !== undefined) {
        formData.append('esBorrador', datos.esBorrador);
      }

      // Subir imágenes si existen
      if (datos.imagenes && datos.imagenes.length > 0) {
        datos.imagenes.forEach(imagen => {
          formData.append('imagenes', imagen);
        });
      }

      const response = await api.post('/publicaciones', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar publicación
  actualizar: async (id, datos) => {
    try {
      const formData = new FormData();
      formData.append('titulo', datos.titulo);
      formData.append('contenido', datos.contenido);
      
      if (datos.etiquetas && datos.etiquetas.length > 0) {
        formData.append('etiquetas', JSON.stringify(datos.etiquetas));
      }
      
      if (datos.esBorrador !== undefined) {
        formData.append('esBorrador', datos.esBorrador);
      }

      // Subir nuevas imágenes si existen
      if (datos.imagenes && datos.imagenes.length > 0) {
        datos.imagenes.forEach(imagen => {
          formData.append('imagenes', imagen);
        });
      }

      const response = await api.put(`/publicaciones/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar publicación
  eliminar: async (id) => {
    try {
      const response = await api.delete(`/publicaciones/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Dar/Quitar me gusta
  darMeGusta: async (id) => {
    try {
      const response = await api.post(`/publicaciones/${id}/me-gusta`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Guardar/Quitar publicación
  guardar: async (id) => {
    try {
      const response = await api.post(`/publicaciones/${id}/guardar`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// =====================================
// SERVICIOS DE COMENTARIOS
// =====================================
export const comentariosAPI = {
  // Obtener comentarios de una publicación
  obtener: async (publicacionId, pagina = 1, limite = 20) => {
    try {
      const response = await api.get(`/comentarios/publicacion/${publicacionId}?pagina=${pagina}&limite=${limite}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear comentario
  crear: async (datos) => {
    try {
      const response = await api.post('/comentarios', {
        publicacionId: datos.publicacionId,
        contenido: datos.contenido
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar comentario
  actualizar: async (id, datos) => {
    try {
      const response = await api.put(`/comentarios/${id}`, {
        contenido: datos.contenido
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar comentario
  eliminar: async (id) => {
    try {
      const response = await api.delete(`/comentarios/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// =====================================
// SERVICIOS DE SEGUIDORES
// =====================================
export const seguidoresAPI = {
  // Seguir a un usuario
  seguir: async (usuarioId) => {
    try {
      const response = await api.post(`/seguidores/seguir/${usuarioId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Dejar de seguir
  dejarDeSeguir: async (usuarioId) => {
    try {
      const response = await api.delete(`/seguidores/dejar-seguir/${usuarioId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener seguidores de un usuario
  obtenerSeguidores: async (usuarioId, pagina = 1, limite = 20) => {
    try {
      const response = await api.get(`/seguidores/${usuarioId}/seguidores?pagina=${pagina}&limite=${limite}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuarios que sigue un usuario
  obtenerSiguiendo: async (usuarioId, pagina = 1, limite = 20) => {
    try {
      const response = await api.get(`/seguidores/${usuarioId}/siguiendo?pagina=${pagina}&limite=${limite}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verificar si sigue a un usuario
  verificar: async (usuarioId) => {
    try {
      const response = await api.get(`/seguidores/verificar/${usuarioId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Exportar instancia de api por si se necesita directamente
export default api;