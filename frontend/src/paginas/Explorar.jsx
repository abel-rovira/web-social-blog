import React, { useState, useEffect } from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { publicacionesAPI } from '../servicios/api';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import Cargando from '../componentes/comunes/Cargando';

const Explorar = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    cargarTrending();
  }, []);

  const cargarTrending = async () => {
    try {
      setCargando(true);
      const respuesta = await publicacionesAPI.obtenerTrending();
      setPublicaciones(respuesta.data.datos);
    } catch (err) {
      console.error('Error al cargar trending:', err);
    } finally {
      setCargando(false);
    }
  };

  const manejarBusqueda = async (e) => {
    e.preventDefault();
    
    if (!busqueda.trim()) {
      cargarTrending();
      return;
    }

    try {
      setBuscando(true);
      const respuesta = await publicacionesAPI.buscar(busqueda);
      setPublicaciones(respuesta.data.datos);
    } catch (err) {
      console.error('Error al buscar:', err);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* cabecera */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Explorar</h1>
          </div>
          <p className="text-gray-600">Descubre las publicaciones más populares</p>
        </div>

        {/* barra de busqueda */}
        <form onSubmit={manejarBusqueda} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-6 py-4 pl-14 pr-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            {busqueda && (
              <button
                type="button"
                onClick={() => {
                  setBusqueda('');
                  cargarTrending();
                }}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* publicaciones */}
        {cargando || buscando ? (
          <Cargando texto={buscando ? 'Buscando...' : 'Cargando publicaciones...'} />
        ) : publicaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">
              {busqueda ? 'No se encontraron resultados' : 'No hay publicaciones trending'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {publicaciones.map((publicacion, index) => (
              <div key={publicacion.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {publicacion.titulo}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">{publicacion.contenido}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span> {publicacion.totalMeGustas} me gusta</span>
                      <span> {publicacion.totalComentarios} comentarios</span>
                      <span> {publicacion.autor?.nombreUsuario}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explorar;