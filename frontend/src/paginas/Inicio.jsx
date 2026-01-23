import React, { useState } from 'react';
import { useAutenticacion } from '../contexto/ContextoAutenticacion';
import { usePublicaciones } from '../hooks/usePublicaciones';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import TarjetaPublicacion from '../componentes/publicaciones/TarjetaPublicacion';
import Cargando from '../componentes/comunes/Cargando';

const Inicio = () => {
  const { autenticado } = useAutenticacion();
  const [tipoFeed, setTipoFeed] = useState(autenticado ? 'feed' : 'todas');
  const { publicaciones, cargando, error, cargarMas, hayMas } = usePublicaciones(tipoFeed);

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* selector de feed */}
        {autenticado && (
          <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2">
            <button
              onClick={() => setTipoFeed('feed')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                tipoFeed === 'feed'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Para ti
            </button>
            <button
              onClick={() => setTipoFeed('todas')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                tipoFeed === 'todas'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Explorar
            </button>
          </div>
        )}

        {/* publicaciones */}
        {cargando && publicaciones.length === 0 ? (
          <Cargando texto="Cargando publicaciones..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : publicaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">No hay publicaciones aún</p>
            {autenticado && (
              <p className="text-gray-500 mt-2">
                ¡Sé el primero en crear una publicación!
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {publicaciones.map((publicacion) => (
              <TarjetaPublicacion key={publicacion.id} publicacion={publicacion} />
            ))}

            {/* boton cargar mas */}
            {hayMas && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={cargarMas}
                  disabled={cargando}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {cargando ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;