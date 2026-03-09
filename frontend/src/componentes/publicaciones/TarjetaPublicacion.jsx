import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { publicacionesAPI } from '../../servicios/api';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import Avatar from '../comunes/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TarjetaPublicacion = ({ publicacion, onActualizar }) => {
  const navigate = useNavigate();
  const { autenticado } = useAutenticacion();
  
  // Validar que la publicación existe
  if (!publicacion) {
    return null;
  }

  // Valores por defecto seguros
  const [leGusta, setLeGusta] = useState(publicacion.leGusta || false);
  const [guardada, setGuardada] = useState(publicacion.guardada || false);
  const [totalMeGustas, setTotalMeGustas] = useState(publicacion.totalMeGustas || 0);

  const manejarMeGusta = async () => {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    const nuevoEstado = !leGusta;
    setLeGusta(nuevoEstado);
    setTotalMeGustas(nuevoEstado ? totalMeGustas + 1 : totalMeGustas - 1);

    try {
      await publicacionesAPI.darMeGusta(publicacion.id);
      if (onActualizar) onActualizar();
    } catch (error) {
      console.error('Error al dar me gusta:', error);
      setLeGusta(!nuevoEstado);
      setTotalMeGustas(nuevoEstado ? totalMeGustas - 1 : totalMeGustas + 1);
    }
  };

  const manejarGuardar = async () => {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    const nuevoEstado = !guardada;
    setGuardada(nuevoEstado);

    try {
      await publicacionesAPI.guardar(publicacion.id);
      if (onActualizar) onActualizar();
    } catch (error) {
      console.error('Error al guardar:', error);
      setGuardada(!nuevoEstado);
    }
  };

  const manejarCompartir = () => {
    const url = `${window.location.origin}/publicacion/${publicacion.id}`;
    navigator.clipboard.writeText(url);
    // Aquí podrías mostrar un toast de éxito
  };

  // Obtener fecha formateada de forma segura
  const fechaFormateada = publicacion.fechaCreacion 
    ? formatDistanceToNow(new Date(publicacion.fechaCreacion), { addSuffix: true, locale: es })
    : 'fecha desconocida';

  // Obtener extracto del contenido de forma segura
  const obtenerExtracto = () => {
    if (!publicacion.contenido) return 'Sin contenido';
    
    // Eliminar caracteres de markdown para el extracto
    const textoSinMarkdown = publicacion.contenido
      .replace(/[#*`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();
    
    return textoSinMarkdown.length > 150 
      ? textoSinMarkdown.substring(0, 150) + '...'
      : textoSinMarkdown;
  };

  return (
    <article className="card hover:shadow-lg transition-all duration-300">
      {/* Cabecera del autor */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link 
            to={`/perfil/${publicacion.autor?.nombreUsuario || 'usuario'}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar 
              src={publicacion.autor?.avatar} 
              alt={publicacion.autor?.nombreUsuario || 'Usuario'}
              size="md"
            />
            <div>
              <p className="font-semibold text-gray-900">
                {publicacion.autor?.nombreUsuario || 'Usuario'}
              </p>
              <p className="text-sm text-gray-500">
                {fechaFormateada}
              </p>
            </div>
          </Link>

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Imagen principal */}
      {publicacion.imagenes && publicacion.imagenes.length > 0 && (
        <Link to={`/publicacion/${publicacion.id}`}>
          <div className="relative w-full h-48 sm:h-64 overflow-hidden">
            <img
              src={publicacion.imagenes[0]}
              alt={publicacion.titulo || 'Publicación'}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible';
              }}
            />
          </div>
        </Link>
      )}

      {/* Contenido */}
      <div className="p-4">
        <Link to={`/publicacion/${publicacion.id}`}>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 hover:text-amber-600 transition-colors line-clamp-2">
            {publicacion.titulo || 'Sin título'}
          </h3>
        </Link>

        {/* Extracto del contenido */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {obtenerExtracto()}
        </p>

        {/* Etiquetas */}
        {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {publicacion.etiquetas.slice(0, 3).map((etiqueta, index) => (
              <Link
                key={index}
                to={`/explorar?tag=${etiqueta.nombre}`}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-amber-100 hover:text-amber-600 transition-colors"
              >
                #{etiqueta.nombre}
              </Link>
            ))}
            {publicacion.etiquetas.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                +{publicacion.etiquetas.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Me gusta */}
            <button
              onClick={manejarMeGusta}
              className="flex items-center gap-1.5 group"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  leGusta
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-500 group-hover:text-red-500'
                }`}
              />
              <span className={`text-sm font-medium ${
                leGusta ? 'text-red-500' : 'text-gray-600'
              }`}>
                {totalMeGustas}
              </span>
            </button>

            {/* Comentarios */}
            <Link 
              to={`/publicacion/${publicacion.id}#comentarios`}
              className="flex items-center gap-1.5 group"
            >
              <MessageCircle className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium text-gray-600">
                {publicacion.totalComentarios || 0}
              </span>
            </Link>

            {/* Compartir */}
            <button
              onClick={manejarCompartir}
              className="flex items-center gap-1.5 group"
            >
              <Share2 className="w-5 h-5 text-gray-500 group-hover:text-green-500 transition-colors" />
            </button>
          </div>

          {/* Guardar */}
          <button
            onClick={manejarGuardar}
            className="group"
          >
            <Bookmark
              className={`w-5 h-5 transition-all ${
                guardada
                  ? 'fill-amber-500 text-amber-500'
                  : 'text-gray-500 group-hover:text-amber-500'
              }`}
            />
          </button>
        </div>

        {/* Leer más */}
        <Link
          to={`/publicacion/${publicacion.id}`}
          className="block mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          Leer más →
        </Link>
      </div>
    </article>
  );
};

export default TarjetaPublicacion;