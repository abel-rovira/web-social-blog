import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, Trash2, Edit, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { publicacionesAPI, comentariosAPI } from '../servicios/api';
import { useAutenticacion } from '../contexto/ContextoAutenticacion';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import Cargando from '../componentes/comunes/Cargando';
import Avatar from '../componentes/comunes/Avatar';

const DetallePublicacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, autenticado } = useAutenticacion();

  const [publicacion, setPublicacion] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPublicacion();
    cargarComentarios();
  }, [id]);

  const cargarPublicacion = async () => {
    try {
      setCargando(true);
      const respuesta = await publicacionesAPI.obtenerPorId(id);
      setPublicacion(respuesta.data.datos);
    } catch (err) {
      console.error('Error al cargar publicación:', err);
      setError('Publicación no encontrada');
    } finally {
      setCargando(false);
    }
  };

  const cargarComentarios = async () => {
    try {
      const respuesta = await comentariosAPI.obtener(id);
      setComentarios(respuesta.data.datos || []);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    }
  };

  const manejarMeGusta = async () => {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    try {
      await publicacionesAPI.darMeGusta(id);
      setPublicacion({
        ...publicacion,
        leGusta: !publicacion.leGusta,
        totalMeGustas: publicacion.leGusta 
          ? publicacion.totalMeGustas - 1 
          : publicacion.totalMeGustas + 1
      });
    } catch (err) {
      console.error('Error al dar me gusta:', err);
    }
  };

  const manejarGuardar = async () => {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    try {
      await publicacionesAPI.guardar(id);
      setPublicacion({
        ...publicacion,
        guardada: !publicacion.guardada
      });
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const manejarEnviarComentario = async (e) => {
    e.preventDefault();
    
    if (!autenticado) {
      navigate('/login');
      return;
    }

    if (!nuevoComentario.trim()) return;

    setEnviandoComentario(true);
    try {
      const respuesta = await comentariosAPI.crear({
        publicacionId: id,
        contenido: nuevoComentario
      });

      setComentarios([respuesta.data.datos, ...comentarios]);
      setNuevoComentario('');
      setPublicacion({
        ...publicacion,
        totalComentarios: publicacion.totalComentarios + 1
      });
    } catch (err) {
      console.error('Error al crear comentario:', err);
    } finally {
      setEnviandoComentario(false);
    }
  };

  const manejarEliminarPublicacion = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) return;

    try {
      await publicacionesAPI.eliminar(id);
      navigate('/');
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const manejarEliminarComentario = async (comentarioId) => {
    if (!window.confirm('¿Eliminar este comentario?')) return;

    try {
      await comentariosAPI.eliminar(comentarioId);
      setComentarios(comentarios.filter(c => c.id !== comentarioId));
      setPublicacion({
        ...publicacion,
        totalComentarios: publicacion.totalComentarios - 1
      });
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BarraNavegacion />
        <Cargando texto="Cargando publicación..." />
      </div>
    );
  }

  if (error || !publicacion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BarraNavegacion />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Publicación no encontrada</h2>
            <p className="text-gray-600">La publicación que buscas no existe</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const esAutor = autenticado && usuario?.id === publicacion.autor?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* articulo */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* cabecera del autor */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Link 
              to={`/perfil/${publicacion.autor?.nombreUsuario}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar 
                src={publicacion.autor?.avatar} 
                alt={publicacion.autor?.nombreUsuario}
                size="md"
              />
              <div>
                <p className="font-semibold text-gray-900">{publicacion.autor?.nombreUsuario}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(publicacion.fechaCreacion).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </Link>

            {esAutor && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/editar/${id}`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={manejarEliminarPublicacion}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* imagen principal */}
          {publicacion.imagenes && publicacion.imagenes.length > 0 && (
            <div className="relative w-full h-96">
              <img
                src={publicacion.imagenes[0]}
                alt={publicacion.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* contenido */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{publicacion.titulo}</h1>

            {/* etiquetas */}
            {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {publicacion.etiquetas.map((etiqueta) => (
                  <Link
                    key={etiqueta.id}
                    to={`/etiqueta/${etiqueta.nombre}`}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    #{etiqueta.nombre}
                  </Link>
                ))}
              </div>
            )}

            {/* contenido markdown */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{publicacion.contenido}</ReactMarkdown>
            </div>

            {/* mas imagenes */}
            {publicacion.imagenes && publicacion.imagenes.length > 1 && (
              <div className="grid grid-cols-2 gap-4 mt-8">
                {publicacion.imagenes.slice(1).map((imagen, index) => (
                  <img
                    key={index}
                    src={imagen}
                    alt={`Imagen ${index + 2}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* acciones */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <button
                onClick={manejarMeGusta}
                className="flex items-center gap-2 group"
              >
                <Heart
                  className={`w-6 h-6 transition-all ${
                    publicacion.leGusta
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-600 group-hover:text-red-500'
                  }`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {publicacion.totalMeGustas}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {publicacion.totalComentarios}
                </span>
              </div>

              <button className="flex items-center gap-2 group">
                <Share2 className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition-colors" />
              </button>
            </div>

            <button onClick={manejarGuardar} className="group">
              <Bookmark
                className={`w-6 h-6 transition-all ${
                  publicacion.guardada
                    ? 'fill-yellow-500 text-yellow-500'
                    : 'text-gray-600 group-hover:text-yellow-500'
                }`}
              />
            </button>
          </div>
        </article>

        {/* seccion de comentarios */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comentarios ({publicacion.totalComentarios})
          </h2>

          {/* formulario de comentario */}
          {autenticado ? (
            <form onSubmit={manejarEnviarComentario} className="mb-6">
              <div className="flex gap-3">
                <Avatar src={usuario?.avatar} alt={usuario?.nombreUsuario} size="md" />
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
                    disabled={!nuevoComentario.trim() || enviandoComentario}
                    className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {enviandoComentario ? 'Enviando...' : 'Comentar'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Inicia sesión para comentar</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Iniciar sesión
              </button>
            </div>
          )}

          {/* lista de comentarios */}
          <div className="space-y-6">
            {comentarios.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Sé el primero en comentar
              </p>
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
                        {autenticado && 
                         (usuario?.id === comentario.usuario?.id || esAutor) && (
                          <button
                            onClick={() => manejarEliminarComentario(comentario.id)}
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
      </div>
    </div>
  );
};

export default DetallePublicacion;