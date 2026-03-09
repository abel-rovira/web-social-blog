import axios from 'axios';

// URL base de tu backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Autenticación
export const autenticacionAPI = {
  registro: (datos) => api.post('/autenticacion/registro', datos),
  login: (datos) => api.post('/autenticacion/login', datos),
  obtenerUsuarioActual: () => api.get('/autenticacion/yo')
};

// Usuarios
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

// Publicaciones
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
  darMeG