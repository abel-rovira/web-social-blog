import axios from 'axios';

// url base de la api (backend)
const API_URL = 'http://localhost:5000/api';

// crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// interceptor para agregar token en cada peticion
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token invalido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// servicios de autenticacion
export const autenticacionAPI = {
  registro: (datos) => api.post('/autenticacion/registro', datos),
  login: (datos) => api.post('/autenticacion/login', datos),
  obtenerUsuarioActual: () => api.get('/autenticacion/yo')
};

// servicios de usuarios
export const usuariosAPI = {
  obtenerPerfil: (nombreUsuario) => api.get(`/usuarios/${nombreUsuario}`),
  actualizarPerfil: (datos) => {
    const formData = new FormData();
    Object.keys(datos).forEach(key => {
      if (datos[key] !== null && datos[key] !== undefined) {
        formData.append(key, datos[key]);
      }
    });
    return api.put('/usuarios/perfil', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  cambiarContrasena: (datos) => api.put('/usuarios/cambiar-contrasena', datos),
  buscarUsuarios: (termino) => api.get(`/usuarios/buscar?termino=${termino}`)
};

// servicios de publicaciones
export const publicacionesAPI = {
  obtenerTodas: (pagina = 1, limite = 10) => 
    api.get(`/publicaciones?pagina=${pagina}&limite=${limite}`),
  obtenerFeed: (pagina = 1, limite = 10) => 
    api.get(`/publicaciones/feed?pagina=${pagina}&limite=${limite}`),
  obtenerTrending: () => api.get('/publicaciones/explorar'),
  obtenerPorId: (id) => api.get(`/publicaciones/${id}`),
  crear: (datos) => {
    const formData = new FormData();
    formData.append('titulo', datos.titulo);
    formData.append('contenido', datos.contenido);
    if (datos.etiquetas) {
      formData.append('etiquetas', JSON.stringify(datos.etiquetas));
    }
    if (datos.esBorrador !== undefined) {
      formData.append('esBorrador', datos.esBorrador);
    }
    if (datos.imagenes && datos.imagenes.length > 0) {
      datos.imagenes.forEach(imagen => {
        formData.append('imagenes', imagen);
      });
    }
    return api.post('/publicaciones', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  actualizar: (id, datos) => {
    const formData = new FormData();
    formData.append('titulo', datos.titulo);
    formData.append('contenido', datos.contenido);
    if (datos.etiquetas) {
      formData.append('etiquetas', JSON.stringify(datos.etiquetas));
    }
    if (datos.esBorrador !== undefined) {
      formData.append('esBorrador', datos.esBorrador);
    }
    if (datos.imagenes && datos.imagenes.length > 0) {
      datos.imagenes.forEach(imagen => {
        formData.append('imagenes', imagen);
      });
    }
    return api.put(`/publicaciones/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  eliminar: (id) => api.delete(`/publicaciones/${id}`),
  darMeGusta: (id) => api.post(`/publicaciones/${id}/me-gusta`),
  guardar: (id) => api.post(`/publicaciones/${id}/guardar`),
  buscar: (termino, pagina = 1) => 
    api.get(`/publicaciones/buscar?termino=${termino}&pagina=${pagina}`)
};

// servicios de comentarios
export const comentariosAPI = {
  obtener: (publicacionId) => 
    api.get(`/comentarios/publicacion/${publicacionId}`),
  crear: (datos) => api.post('/comentarios', datos),
  actualizar: (id, datos) => api.put(`/comentarios/${id}`, datos),
  eliminar: (id) => api.delete(`/comentarios/${id}`)
};

// servicios de seguidores
export const seguidoresAPI = {
  seguir: (usuarioId) => api.post(`/seguidores/seguir/${usuarioId}`),
  dejarDeSeguir: (usuarioId) => 
    api.delete(`/seguidores/dejar-seguir/${usuarioId}`),
  obtenerSeguidores: (usuarioId) => 
    api.get(`/seguidores/${usuarioId}/seguidores`),
  obtenerSiguiendo: (usuarioId) => 
    api.get(`/seguidores/${usuarioId}/siguiendo`),
  verificar: (usuarioId) => api.get(`/seguidores/verificar/${usuarioId}`)
};

export default api;