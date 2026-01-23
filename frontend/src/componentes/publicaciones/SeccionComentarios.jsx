import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Avatar from '../comunes/Avatar';

const SeccionComentarios = ({ 
  comentarios, 
  usuarioActual, 
  autenticado,
  onEnviarComentario, 
  onEliminarComentario 
}) => {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const manejarEnviar = async (e) => {
    e.preventDefault();
    
    if (!nuevoComentario.trim()) return;

    setEnviando(true);
    await onEnviarComentario(nuevoComentario);
    setNuevoComentario('');
    setEnviando(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comentarios ({comentarios.length})
      </h2>

      {/* formulario */}
      {autenticado ? (
        <form onSubmit={manejarEnviar} className="mb-6">
          <div className="flex gap-3">
            <Avatar src={usuarioActual?.avatar} alt={usuarioActual?.nombreUsuario} size="md" />
            <div className="flex-1">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
              />
              <button
                type="submit"
                disabled={!nuevoComentario.trim() || enviando}
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {enviando ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">Inicia sesión para comentar</p>
        </div>
      )}

      {/* lista de comentarios */}
      <div className="space-y-6">
        {comentarios.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Sé el primero en comentar</p>
        ) : (
          comentarios.map((comentario) => (
            <div key={comentario.id} className="flex gap-3">
              <Link to={`/perfil/${comentario.usuario?.nombreUsuario}`}>
                <Avatar
                  src={comentario.usuario?.avatar}
                  alt={comentario.usuario?.nombreUsuario}
                  size="md"
                />
              </Link>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/perfil/${comentario.usuario?.nombreUsuario}`}
                    className="font-semibold text-gray-900 hover:underline"
                  >
                    {comentario.usuario?.nombreUsuario}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(comentario.fechaCreacion).toLocaleDateString('es-ES')}
                    </span>
                    {autenticado && usuarioActual?.id === comentario.usuario?.id && (
                      <button
                        onClick={() => onEliminarComentario(comentario.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700">{comentario.contenido}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SeccionComentarios;