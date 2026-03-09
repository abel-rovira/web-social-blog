import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { usePublicaciones } from '../hooks/usePublicaciones';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import CarruselHero from '../componentes/publicaciones/CarruselHero';
import TarjetaPublicacion from '../componentes/publicaciones/TarjetaPublicacion';
import Cargando from '../componentes/comunes/Cargando';
import { Sparkles, TrendingUp, Clock, ArrowRight } from 'lucide-react';

const Inicio = () => {
  const { autenticado } = useAutenticacion();
  const [tipoFeed, setTipoFeed] = useState('recientes');
  const [destacadas, setDestacadas] = useState([]);
  const { publicaciones, cargando, error, cargarMas, hayMas } = usePublicaciones(tipoFeed);

  useEffect(() => {
    // Aquí conectarías con tu API real
    const mockDestacadas = [
      {
        id: 1,
        titulo: 'El arte de escribir con propósito',
        contenido: 'Reflexiones sobre la escritura honesta y el pensamiento profundo...',
        imagenes: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3'],
        autor: { nombreUsuario: 'anaescritora', avatar: 'https://via.placeholder.com/40' },
        etiquetas: [{ nombre: 'escritura' }, { nombre: 'reflexión' }],
        totalMeGustas: 342,
        totalComentarios: 56,
      },
      {
        id: 2,
        titulo: 'Encontrar tu voz en un mundo ruidoso',
        contenido: 'Cómo mantener la autenticidad cuando todos gritan...',
        imagenes: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3'],
        autor: { nombreUsuario: 'carlosvoz', avatar: 'https://via.placeholder.com/40' },
        etiquetas: [{ nombre: 'autenticidad' }, { nombre: 'voz' }],
        totalMeGustas: 289,
        totalComentarios: 43,
      },
      {
        id: 3,
        titulo: 'La belleza de las palabras simples',
        contenido: 'A veces menos es más cuando se trata de comunicar...',
        imagenes: ['https://images.unsplash.com/photo-1474932430478-367dbb6832c1?ixlib=rb-4.0.3'],
        autor: { nombreUsuario: 'martasimple', avatar: 'https://via.placeholder.com/40' },
        etiquetas: [{ nombre: 'minimalismo' }, { nombre: 'escritura' }],
        totalMeGustas: 421,
        totalComentarios: 78,
      }
    ];
    setDestacadas(mockDestacadas);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <BarraNavegacion />

      {/* Carrusel Hero - AHORA CON EL DISEÑO ESPECTACULAR */}
      <CarruselHero />

      {/* Sección de Destacadas */}
      <section className="container-pixara py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="title-serif text-3xl md:text-4xl text-gray-900 mb-2">
              Historias <span className="text-amber-600">destacadas</span>
            </h2>
            <p className="text-gray-600">Lo mejor de nuestra comunidad</p>
          </div>
          <Link 
            to="/explorar" 
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destacadas.map((pub, index) => (
            <div key={pub.id} className="animate-fadeUp" style={{ animationDelay: `${index * 0.1}s` }}>
              <TarjetaPublicacion publicacion={pub} />
            </div>
          ))}
        </div>
      </section>

      {/* Selector de Feed */}
      <section className="container-pixara py-8 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h3 className="title-serif text-2xl text-gray-900">Últimas publicaciones</h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setTipoFeed('recientes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                tipoFeed === 'recientes'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              Recientes
            </button>
            <button
              onClick={() => setTipoFeed('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                tipoFeed === 'trending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Populares
            </button>
            <button
              onClick={() => setTipoFeed('destacadas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                tipoFeed === 'destacadas'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Destacadas
            </button>
          </div>
        </div>

        {/* Grid de Publicaciones */}
        {cargando && publicaciones.length === 0 ? (
          <Cargando texto="Cargando historias..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : publicaciones.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {publicaciones.map((publicacion, index) => (
                <div key={publicacion.id} className="animate-fadeUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TarjetaPublicacion publicacion={publicacion} />
                </div>
              ))}
            </div>

            {hayMas && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={cargarMas}
                  disabled={cargando}
                  className="border border-gray-300 hover:border-amber-600 text-gray-700 hover:text-amber-600 font-medium py-3 px-8 rounded-full transition-colors flex items-center gap-2"
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                      Cargando...
                    </>
                  ) : (
                    'Cargar más historias'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No hay publicaciones aún</p>
            {autenticado && (
              <Link to="/crear" className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-full transition-colors inline-block mt-4">
                Escribe la primera historia
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Llamada a la acción */}
      <section className="bg-amber-50 py-16 mt-16">
        <div className="container-pixara text-center">
          <h2 className="title-serif text-3xl md:text-4xl text-gray-900 mb-4">
            ¿Listo para compartir tu historia?
          </h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Únete a una comunidad de escritores honestos y pensadores profundos
          </p>
          {autenticado ? (
            <Link to="/crear" className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-full transition-colors inline-block">
              Comenzar a escribir
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/registro" className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-8 rounded-full transition-colors">
                Registrarse gratis
              </Link>
              <Link to="/explorar" className="border border-gray-300 hover:border-amber-600 text-gray-700 hover:text-amber-600 font-medium py-3 px-8 rounded-full transition-colors">
                Explorar
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="container-pixara">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="title-serif text-xl text-gray-900">PIXARA</span>
              <p className="text-gray-500 text-sm mt-1">Espacio para la escritura honesta</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-amber-600 transition-colors">Sobre nosotros</a>
              <a href="#" className="hover:text-amber-600 transition-colors">Contacto</a>
              <a href="#" className="hover:text-amber-600 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-amber-600 transition-colors">Términos</a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-8">
            © 2026 PIXARA. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;