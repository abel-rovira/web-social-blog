import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import Cargando from '../componentes/comunes/Cargando';

const Guardados = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPublicaciones([]);
      setCargando(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="w-8 h-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Publicaciones Guardadas</h1>
          </div>
          <p className="text-gray-600">Tus publicaciones favoritas guardadas</p>
        </div>

        {cargando ? (
          <Cargando texto="Cargando guardados..." />
        ) : publicaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes publicaciones guardadas</h2>
            <p className="text-gray-600">
              Guarda publicaciones para verlas más tarde haciendo clic en el ícono de marcador
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {publicaciones.map((publicacion) => (
              <div key={publicacion.id} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{publicacion.titulo}</h3>
                <p className="text-gray-600 line-clamp-3">{publicacion.contenido}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Guardados;