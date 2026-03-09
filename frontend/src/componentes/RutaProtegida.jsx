import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';
import Cargando from './comunes/Cargando';

const RutaProtegida = ({ children }) => {
  const { autenticado, cargando } = useAutenticacion();

  // Mostrar cargando mientras verificamos autenticación
  if (cargando) {
    return <Cargando texto="Verificando autenticación..." />;
  }

  // Si no está autenticado, redirigir al login
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
};

export default RutaProtegida;