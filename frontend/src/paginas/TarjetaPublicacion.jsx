import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { publicacionesAPI } from '../../servicios/api';
import { useAutenticacion } from '../../contexto/ContextoAutenticacion';
import Avatar from '../comunes/Avatar';

const TarjetaPublicacion = ({ publicacion, onActualizar }) => {
  const navigate = useNavigate();
  const { autenticado } = useAutenticacion();
  
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

  const manejarCompartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: publicacion.titulo,
          text: publicacion.contenido.substring(0, 100) + '...',
          url: window.location.origin + `/publicacion/${publicacion.id}`
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      // copiar al portapapeles
      navigator.clipboard.writeText(window.location.origin + `/publicacion/${publicacion.id}`);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* cabecera del autor */}
      <div className="flex items-center justify-between p-4">
        <Link 
          to={`/perfil/${publicacion.autor?.nombreUsuario}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Avatar 
            src={publicacion.autor?.avatar} 
            alt={publicacion.autor?.nombreUsuario}
            size="md"
          />
          <div>
            <p className="font-semibold text-gray-900">{publicacion.autor?.nombreUsuario}</p>
            <p className="text-sm text-gray-500">
              {new Date(publicacion.fechaCreacion).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </Link>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* imagen principal */}
      {publicacion.imagenes && publicacion.imagenes.length > 0 && (
        <Link to={`/publicacion/${publicacion.id}`}>
          <div className="relative w-full h-96">
            <img
              src={publicacion.imagenes[0]}
              alt={publicacion.titulo}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
            />
          </div>
        </Link>
      )}

      {/* contenido */}
      <div className="p-4">
        <Link to={`/publicacion/${publicacion.id}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
            {publicacion.titulo}
          </h2>
        </Link>

        {/* preview del contenido */}
        <div className="prose prose-sm max-w-none mb-4 line-clamp-3">
          <ReactMarkdown>
            {publicacion.contenido.substring(0, 200) + (publicacion.contenido.length > 200 ? '...' : '')}
          </ReactMarkdown>
        </div>

        {/* etiquetas */}
        {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {publicacion.etiquetas.slice(0, 3).map((etiqueta) => (
              <Link
                key={etiqueta.id}
                to={`/etiqueta/${etiqueta.nombre}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                #{etiqueta.nombre}
              </Link>
            ))}
            {publicacion.etiquetas.length > 3 && (
              <span className="text-sm text-gray-500">
                +{publicacion.etiquetas.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            {/* me gusta */}
            <button
              onClick={manejarMeGusta}
              className="flex items-center gap-2 group"
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  leGusta
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600 group-hover:text-red-500'
                }`}
              />
              <span className="text-sm font-medium text-gray-700">{totalMeGustas}</span>
            </button>

            {/* comentarios */}
            <Link 
              to={`/publicacion/${publicacion.id}#comentarios`}
              className="flex items-center gap-2 group"
            >
              <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium text-gray-700">
                {publicacion.totalComentarios || 0}
              </span>
            </Link>

            {/* compartir */}
            <button onClick={manejarCompartir} className="flex items-center gap-2 group">
              <Share2 className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition-colors" />
            </button>
          </div>

          {/* guardar */}
          <button onClick={manejarGuardar} className="group">
            <Bookmark
              className={`w-6 h-6 transition-all ${
                guardada
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-600 group-hover:text-yellow-500'
              }`}
            />
          </button>
        </div>

        {/* boton leer mas */}
        <Link
          to={`/publicacion/${publicacion.id}`}
          className="block mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Leer más &rarr;
        </Link>
      </div>
    </article>
  );
};

export default TarjetaPublicacion;