import React, { createContext, useState, useEffect, useContext } from 'react';
import { autenticacionAPI } from '../servicios/api';

const ContextoAutenticacion = createContext();

export const useAutenticacion = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('useAutenticacion debe usarse dentro de ProveedorAutenticacion');
  }
  return contexto;
};

export const ProveedorAutenticacion = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  // verificar si hay usuario logueado al cargar la app
  useEffect(() => {
    verificarAutenticacion();
  }, []);

  const verificarAutenticacion = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setCargando(false);
      return;
    }

    try {
      const respuesta = await autenticacionAPI.obtenerUsuarioActual();
      setUsuario(respuesta.data.datos);
      setAutenticado(true);
    } catch (error) {
      console.error('Error al verificar autenticacion:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } finally {
      setCargando(false);
    }
  };

  const login = async (credenciales) => {
    try {
      const respuesta = await autenticacionAPI.login(credenciales);
      const { token, usuario } = respuesta.data.datos;
      
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      
      setUsuario(usuario);
      setAutenticado(true);
      
      return { exito: true };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        exito: false,
        mensaje: error.response?.data?.mensaje || 'Error al iniciar sesión'
      };
    }
  };

  const registro = async (datos) => {
    try {
      const respuesta = await autenticacionAPI.registro(datos);
      const { token, usuario } = respuesta.data.datos;
      
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      
      setUsuario(usuario);
      setAutenticado(true);
      
      return { exito: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        exito: false,
        mensaje: error.response?.data?.mensaje || 'Error al registrarse'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setAutenticado(false);
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
    actualizarUsuario
  };

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  );
};

export default ContextoAutenticacion;