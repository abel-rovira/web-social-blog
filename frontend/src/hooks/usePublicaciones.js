import { useState, useEffect } from 'react';
import { publicacionesAPI } from '../servicios/api';

export const usePublicaciones = (tipo = 'todas') => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(true);

  useEffect(() => {
    cargarPublicaciones();
  }, [tipo, pagina]);

  const cargarPublicaciones = async () => {
    try {
      setCargando(true);
      let respuesta;

      switch (tipo) {
        case 'feed':
          respuesta = await publicacionesAPI.obtenerFeed(pagina);
          break;
        case 'trending':
          respuesta = await publicacionesAPI.obtenerTrending();
          break;
        default:
          respuesta = await publicacionesAPI.obtenerTodas(pagina);
      }

      const nuevasPublicaciones = respuesta.data.datos;

      if (pagina === 1) {
        setPublicaciones(nuevasPublicaciones);
      } else {
        setPublicaciones(prev => [...prev, ...nuevasPublicaciones]);
      }

      setHayMas(nuevasPublicaciones.length > 0);
      setError(null);
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
      setError('Error al cargar publicaciones');
    } finally {
      setCargando(false);
    }
  };

  const recargar = () => {
    setPagina(1);
    cargarPublicaciones();
  };

  const cargarMas = () => {
    if (!cargando && hayMas) {
      setPagina(prev => prev + 1);
    }
  };

  return {
    publicaciones,
    cargando,
    error,
    recargar,
    cargarMas,
    hayMas
  };
};