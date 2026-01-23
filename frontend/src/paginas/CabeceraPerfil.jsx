import React from 'react';
import { Settings, UserPlus, UserCheck, Calendar, Link as LinkIcon } from 'lucide-react';
import Avatar from '../comunes/Avatar';

const CabeceraPerfil = ({ 
  usuario, 
  esPerfilPropio, 
  siguiendo, 
  onSeguir, 
  onEditarPerfil,
  procesando 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar src={usuario.avatar} alt={usuario.nombreUsuario} size="2xl" />

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{usuario.nombreUsuario}</h1>
            
            {esPerfilPropio ? (
              <button
                onClick={onEditarPerfil}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Editar perfil
              </button>
            ) : (
              <button
                onClick={onSeguir}
                disabled={procesando}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                  siguiendo
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {siguiendo ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Siguiendo
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Seguir
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{usuario.totalPublicaciones || 0}</div>
              <div className="text-sm text-gray-600">Publicaciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{usuario.totalSeguidores || 0}</div>
              <div className="text-sm text-gray-600">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{usuario.totalSiguiendo || 0}</div>
              <div className="text-sm text-gray-600">Siguiendo</div>
            </div>
          </div>

          {usuario.biografia && (
            <p className="text-gray-700 mb-4">{usuario.biografia}</p>
          )}

          {usuario.enlaces && usuario.enlaces.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {usuario.enlaces.map((enlace, index) => (
                
                  key={index}
                  href={enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                >
                  <LinkIcon className="w-4 h-4" />
                  {enlace}
                </a>
              ))}
            </div>
          )}

          {usuario.fechaCreacion && (
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              Miembro desde {new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric'
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CabeceraPerfil;