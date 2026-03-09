import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const CarruselDestacados = ({ publicaciones }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === publicaciones.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [publicaciones.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? publicaciones.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === publicaciones.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!publicaciones || publicaciones.length === 0) {
    return (
      <div className="relative h-[500px] bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-xl">No hay publicaciones destacadas</p>
        </div>
      </div>
    );
  }

  const pub = publicaciones[currentIndex];

  return (
    <div className="relative h-[500px] rounded-2xl overflow-hidden group">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ 
          backgroundImage: `url(${pub.imagenes?.[0] || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3'})` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="absolute inset-0 flex items-end">
        <div className="container-blog w-full pb-16">
          <div className="max-w-3xl animate-fadeIn">
            {/* Etiquetas */}
            <div className="flex gap-2 mb-4">
              {pub.etiquetas?.slice(0, 3).map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/etiqueta/${tag.nombre}`}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  #{tag.nombre}
                </Link>
              ))}
            </div>

            {/* Título */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 line-clamp-2">
              {pub.titulo}
            </h2>

            {/* Extracto */}
            <p className="text-lg text-gray-200 mb-6 line-clamp-3">
              {pub.contenido.replace(/[#*`]/g, '').substring(0, 200)}...
            </p>

            {/* Autor y metadata */}
            <div className="flex items-center justify-between">
              <Link
                to={`/perfil/${pub.autor?.nombreUsuario}`}
                className="flex items-center gap-3"
              >
                <img
                  src={pub.autor?.avatar || 'https://via.placeholder.com/40'}
                  alt={pub.autor?.nombreUsuario}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <span className="text-white font-medium">{pub.autor?.nombreUsuario}</span>
              </Link>

              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5" />
                  <span>{pub.totalMeGustas || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  <span>{pub.totalComentarios || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bookmark className="w-5 h-5" />
                  <span>{pub.totalGuardados || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {publicaciones.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarruselDestacados;