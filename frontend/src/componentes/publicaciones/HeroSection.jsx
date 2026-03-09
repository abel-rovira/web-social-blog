import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAutenticacion } from '../../hooks/useAutenticacion';

const HeroSection = () => {
  const { autenticado } = useAutenticacion();

  return (
    <section className="container-pixara py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        {/* Título principal con el estilo de la imagen */}
        <h1 className="title-serif text-5xl md:text-7xl lg:text-8xl text-gray-900 mb-4 animate-fadeUp">
          BIENVENIDO A{' '}
          <span className="relative">
            PIXARA
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-amber-400 rounded-full"></span>
          </span>
        </h1>
        
        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-gray-600 mt-8 mb-6 max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
          <span className="italic">"Reflexiones que conectan"</span>
        </p>
        
        {/* Descripción */}
        <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto animate-fadeUp" style={{ animationDelay: '0.3s' }}>
          Espacio para la escritura honesta, el pensamiento profundo y las ideas que importan
        </p>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeUp" style={{ animationDelay: '0.4s' }}>
          <Link 
            to="/explorar" 
            className="btn-pixara-primary flex items-center justify-center gap-2 group"
          >
            Explorar historias
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {autenticado ? (
            <Link 
              to="/crear" 
              className="btn-pixara-outline"
            >
              Empieza a escribir
            </Link>
          ) : (
            <Link 
              to="/registro" 
              className="btn-pixara-outline"
            >
              Empieza a escribir
            </Link>
          )}
        </div>

        {/* Elemento decorativo */}
        <div className="mt-16 flex justify-center gap-2">
          <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
          <span className="w-2 h-2 bg-amber-300 rounded-full"></span>
          <span className="w-2 h-2 bg-amber-200 rounded-full"></span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;