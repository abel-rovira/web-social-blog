import React, { createContext, useState, useEffect, useContext } from 'react';
import { autenticacionAPI } from '../servicios/api';
import toast from 'react-hot-toast';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAutenticacion = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAutenticacion debe usarse dentro de AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  // Verificar token al cargar la app
  useEffect(() => {
    verificarToken();
  }, []);

  const verificarToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setCargando(false);
      setAutenticado(false);
      setUsuario(null);
      return;
    }

    try {
      const respuesta = await autenticacionAPI.obtenerUsuarioActual();
      
      if (respuesta.data && respuesta.data.exito) {
        setUsuario(respuesta.data.datos);
        setAutenticado(true);
        // Guardar usuario actualizado en localStorage
        localStorage.setItem('usuario', JSON.stringify(respuesta.data.datos));
      } else {
        throw new Error('Error al obtener usuario');
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setAutenticado(false);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  const login = async (credenciales) => {
    try {
      const respuesta = await autenticacionAPI.login(credenciales);
      
      if (respuesta.data && respuesta.data.exito) {
        const { token, usuario } = respuesta.data.datos;
        
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        setUsuario(usuario);
        setAutenticado(true);
        
        toast.success('¡Bienvenido de nuevo!');
        return { exito: true };
      } else {
        throw new Error(respuesta.data?.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      const mensaje = error.response?.data?.mensaje || 'Error al iniciar sesión';
      toast.error(mensaje);
      return { exito: false, mensaje };
    }
  };

  const registro = async (datos) => {
    try {
      const respuesta = await autenticacionAPI.registro(datos);
      
      if (respuesta.data && respuesta.data.exito) {
        const { token, usuario } = respuesta.data.datos;
        
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        setUsuario(usuario);
        setAutenticado(true);
        
        toast.success('¡Cuenta creada exitosamente!');
        return { exito: true };
      } else {
        throw new Error(respuesta.data?.mensaje || 'Error al registrarse');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      const mensaje = error.response?.data?.mensaje || 'Error al registrarse';
      toast.error(mensaje);
      return { exito: false, mensaje };
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // Limpiar estado
    setUsuario(null);
    setAutenticado(false);
    
    toast.success('¡Hasta pronto!');
    
    // Redirigir al inicio
    window.location.href = '/';
  };

  const actualizarUsuario = (datosActualizados) => {
    setUsuario(prev => ({ ...prev, ...datosActualizados }));
    localStorage.setItem('usuario', JSON.stringify({ ...usuario, ...datosActualizados }));
  };

  const valor = {
    usuario,
    autenticado,
    cargando,
    login,
    registro,
    logout,
    actualizarUsuario,
    verificarToken
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;