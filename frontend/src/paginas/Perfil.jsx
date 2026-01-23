import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, UserPlus, Calendar } from 'lucide-react';
import { useAutenticacion } from '../contexto/ContextoAutenticacion';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import Cargando from '../componentes/comunes/Cargando';

const Perfil = () => {
  const { nombreUsuario } = useParams();
  const navigate = useNavigate();
  const { usuario: usuarioActual, autenticado } = useAutenticacion();
  
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => setCargando(false), 1000);
  }, []);

  const esPerfilPropio = autenticado && usuarioActual?.nombreUsuario === nombreUsuario;

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BarraNavegacion />
        <Cargando texto="Cargando perfil..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src="https://via.placeholder.com/150"
              alt={nombreUsuario}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{nombreUsuario}</h1>
                
                {esPerfilPropio ? (
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                    <Settings className="w-4 h-4" />
                    Editar perfil
                  </button>
                ) : autenticado && (
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <UserPlus className="w-4 h-4" />
                    Seguir
                  </button>
                )}
              </div>

              <div className="flex justify-center md:justify-start gap-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Siguiendo</div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">Esta es la biografía del usuario</p>

              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                Miembro desde enero 2026
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Publicaciones</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">
              {esPerfilPropio
                ? 'Aún no has creado ninguna publicación'
                : 'Este usuario no ha publicado nada aún'}
            </p>
            {esPerfilPropio && (
              <button
                onClick={() => navigate('/crear')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear mi primera publicación
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;