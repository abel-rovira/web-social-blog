import { useState, useEffect } from 'react';
import { usuariosAPI } from '../servicios/api';

export const useUsuario = (nombreUsuario) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (nombreUsuario) {
      cargarUsuario();
    }
  }, [nombreUsuario]);

  const cargarUsuario = async () => {
    try {
      setCargando(true);
      const respuesta = await usuariosAPI.obtenerPerfil(nombreUsuario);
      setUsuario(respuesta.data.datos);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      setError('Usuario no encontrado');
    } finally {
      setCargando(false);
    }
  };

  return { usuario, cargando, error, recargar: cargarUsuario };
};