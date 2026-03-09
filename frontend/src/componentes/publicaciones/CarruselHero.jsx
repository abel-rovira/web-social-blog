import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAutenticacion } from '../../hooks/useAutenticacion';

const CarruselHero = () => {
  const { autenticado } = useAutenticacion();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Imágenes para el carrusel (paisajes hermosos y profesionales)
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Paisaje montañoso al atardecer'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      alt: 'Bosque brumoso'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      alt: 'Atardecer en el bosque'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Montañas con niebla'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      alt: 'Naturaleza verde'
    }
  ];

  // Autoplay del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Cambia cada 6 segundos

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Carrusel de imágenes */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Imagen de fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay degradado para mejor legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
          </div>
        </div>
      ))}

      {/* Contenido centrado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-pixara text-center text-white">
          {/* Título principal con animación */}
          <h1 className="title-serif text-5xl md:text-7xl lg:text-8xl mb-4 animate-fadeUp">
            BIENVENIDO A{' '}
            <span className="relative inline-block">
              PIXARA
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-amber-400 rounded-full animate-slideIn"></span>
            </span>
          </h1>
          
          {/* Subtítulo con retraso */}
          <p className="text-xl md:text-2xl text-gray-200 mt-8 mb-6 max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            <span className="italic">"Reflexiones que conectan"</span>
          </p>
          
          {/* Descripción */}
          <p className="text-gray-300 text-lg mb-12 max-w-xl mx-auto animate-fadeUp" style={{ animationDelay: '0.3s' }}>
            Espacio para la escritura honesta, el pensamiento profundo y las ideas que importan
          </p>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeUp" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/explorar" 
              className="group bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Explorar historias
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {autenticado ? (
              <Link 
                to="/crear" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Empieza a escribir
              </Link>
            ) : (
              <Link 
                to="/registro" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Empieza a escribir
              </Link>
            )}
          </div>

          {/* Indicadores del carrusel */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-10 h-2 bg-amber-500'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                } rounded-full`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controles de navegación (aparecen al hacer hover) */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default CarruselHero;