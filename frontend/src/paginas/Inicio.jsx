import React, { useState, useEffect } from 'react';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { usePublicaciones } from '../hooks/usePublicaciones';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import CarruselDestacados from '../componentes/publicaciones/CarruselDestacados';
import TarjetaPublicacion from '../componentes/publicaciones/TarjetaPublicacion';
import Cargando from '../componentes/comunes/Cargando';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

const Inicio = () => {
  const { autenticado } = useAutenticacion();
  const [tipoFeed, setTipoFeed] = useState('destacadas');
  const [destacadas, setDestacadas] = useState([]);
  const { publicaciones, cargando, error, cargarMas, hayMas } = usePublicaciones(tipoFeed);

  useEffect(() => {
    // Simular carga de destacadas (esto debería venir de tu API)
    const mockDestacadas = [
      {
        id: 1,
        titulo: '10 Consejos para mejorar tu productividad',
        contenido: 'Descubre las mejores técnicas para ser más productivo en tu día a día...',
        imagenes: ['https://images.unsplash.com/photo-1499750310107-5fef28a66643'],
        autor: { nombreUsuario: 'juanperez', avatar: 'https://via.placeholder.com/40' },
        etiquetas: [{ nombre: 'productividad' }, { nombre: 'consejos' }],
        totalMeGustas: 234,
        totalComentarios: 45,
      },
      {
        id: 2,
        titulo: 'Viaje por la Patagonia: Una aventura inolvidable',
        contenido: 'Recorriendo los paisajes más impresionantes del sur del mundo...',
        imagenes: ['https://images.unsplash.com/photo-1516302752625-fccf7c31c848'],
        autor: { nombreUsuario: 'mariaviajera', avatar: 'https://via.placeholder.com/40' },
        etiquetas: [{ nombre: 'viajes' }, { nombre: 'aventura' }],
        totalMeGustas: 567,
        totalComentarios: 89,
      },
      {
        id: 3,
        titulo: 'Las mejores recetas de cocina mediterránea',
        contenido: 'Aprende a preparar platos deliciosos y saludables...',
        imagenes: ['https://images.unsplash.com/photo-1505935428862-770b6f24f629'],
        autor: { nombreUsuario: 'chefana', avatar: 'https://via.placeholder.com/40' },
        etiquetas: [{ nombre: 'cocina' }, { nombre: 'recetas' }],
        totalMeGustas: 789,
        totalComentarios: 123,
      }
    ];
    setDestacadas(mockDestacadas);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <BarraNavegacion />

      {/* Hero Section con Carrusel */}
      <section className="container-blog py-8">
        <CarruselDestacados publicaciones={destacadas} />
      </section>

      {/* Selector de Feed */}
      <section className="container-blog py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="gradient-text">Blog</span> Moderno
          </h1>
          
          <div className="flex gap-2">
            <button
              onClick={() => setTipoFeed('destacadas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                tipoFeed === 'destacadas'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Destacadas
            </button>
            <button
              onClick={() => setTipoFeed('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                tipoFeed === 'trending'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
            <button
              onClick={() => setTipoFeed('recientes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                tipoFeed === 'recientes'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              Recientes
            </button>
          </div>
        </div>

        {/* Grid de Publicaciones */}
        {cargando && publicaciones.length === 0 ? (
          <Cargando texto="Cargando publicaciones..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicaciones.map((publicacion) => (
                <div key={publicacion.id} className="animate-fadeIn">
                  <TarjetaPublicacion publicacion={publicacion} />
                </div>
              ))}
            </div>

            {/* Botón Cargar Más */}
            {hayMas && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={cargarMas}
                  disabled={cargando}
                  className="btn-primary flex items-center gap-2"
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Cargando...
                    </>
                  ) : (
                    'Cargar más artículos'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer simple */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="container-blog text-center text-gray-600">
          <p>© 2026 Blog Moderno. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;