import React from 'react';
import TarjetaPublicacion from './TarjetaPublicacion';
import Cargando from '../comunes/Cargando';

const FeedPublicaciones = ({ publicaciones, cargando, error, onCargarMas, hayMas }) => {
  if (cargando && publicaciones.length === 0) {
    return <Cargando texto="Cargando publicaciones..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (publicaciones.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-600 text-lg">No hay publicaciones para mostrar</p>
        <p className="text-gray-500 mt-2">Sigue a otros usuarios para ver su contenido aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {publicaciones.map((publicacion) => (
        <TarjetaPublicacion key={publicacion.id} publicacion={publicacion} />
      ))}

      {hayMas && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onCargarMas}
            disabled={cargando}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cargando ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedPublicaciones;