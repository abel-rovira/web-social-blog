import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, UserPlus, UserCheck, Calendar, Link as LinkIcon } from 'lucide-react';
import { useAutenticacion } from '../contexto/ContextoAutenticacion';
import { useUsuario } from '../hooks/useUsuario';
import { seguidoresAPI, publicacionesAPI } from '../servicios/api';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import Cargando from '../componentes/comunes/Cargando';
import TarjetaPublicacion from '../componentes/publicaciones/TarjetaPublicacion';

const Perfil = () => {
  const { nombreUsuario } = useParams();
  const navigate = useNavigate();
  const { usuario: usuarioActual, autenticado } = useAutenticacion();
  const { usuario, cargando, error } = useUsuario(nombreUsuario);
  
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargandoPublicaciones, setCargandoPublicaciones] = useState(true);
  const [siguiendo, setSiguiendo] = useState(false);
  const [procesandoSeguir, setProcesandoSeguir] = useState(false);

  const esPerfilPropio = autenticado && usuarioActual?.nombreUsuario === nombreUsuario;

  useEffect(() => {
    if (usuario) {
      cargarPublicaciones();
      if (autenticado && !esPerfilPropio) {
        verificarSeguimiento();
      }
    }
  }, [usuario]);

  const cargarPublicaciones = async () => {
    try {
      setCargandoPublicaciones(true);
      const respuesta = await publicacionesAPI.obtenerTodas(1, 20);
      // filtrar publicaciones del usuario
      const publicacionesUsuario = respuesta.data.datos.filter(
        pub => pub.autor.nombreUsuario === nombreUsuario
      );
      setPublicaciones(publicacionesUsuario);
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
    } finally {
      setCargandoPublicaciones(false);
    }
  };

  const verificarSeguimiento = async () => {
    try {
      const respuesta = await seguidoresAPI.verificar(usuario.id);
      setSiguiendo(respuesta.data.siguiendo);
    } catch (err) {
      console.error('Error al verificar seguimiento:', err);
    }
  };

  const manejarSeguir = async () => {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    setProcesandoSeguir(true);
    try {
      if (siguiendo) {
        await seguidoresAPI.dejarDeSeguir(usuario.id);
        setSiguiendo(false);
      } else {
        await seguidoresAPI.seguir(usuario.id);
        setSiguiendo(true);
      }
    } catch (err) {
      console.error('Error al seguir/dejar de seguir:', err);
    } finally {
      setProcesandoSeguir(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BarraNavegacion />
        <Cargando texto="Cargando perfil..." />
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BarraNavegacion />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Usuario no encontrado</h2>
            <p className="text-gray-600">El usuario que buscas no existe</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* cabecera del perfil */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* avatar */}
            <img
              src={usuario.avatar || 'https://via.placeholder.com/150'}
              alt={usuario.nombreUsuario}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />

            {/* informacion */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{usuario.nombreUsuario}</h1>
                
                {esPerfilPropio ? (
                  <button
                    onClick={() => navigate('/configuracion')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Editar perfil
                  </button>
                ) : (
                  <button
                    onClick={manejarSeguir}
                    disabled={procesandoSeguir}
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

              {/* estadisticas */}
              <div className="flex justify-center md:justify-start gap-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{publicaciones.length}</div>
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

              {/* biografia */}
              {usuario.biografia && (
                <p className="text-gray-700 mb-4">{usuario.biografia}</p>
              )}

              {/* enlaces */}
              {usuario.enlaces && usuario.enlaces.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {usuario.enlaces.map((enlace, index) => (
                    
                      key={index}
                      href={enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {new URL(enlace).hostname}
                    </a>
                  ))}
                </div>
              )}

              {/* fecha de registro */}
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
                <Calendar className="w-4 h-4" />
                Miembro desde {new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* publicaciones */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Publicaciones</h2>
          
          {cargandoPublicaciones ? (
            <Cargando texto="Cargando publicaciones..." />
          ) : publicaciones.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600">
                {esPerfilPropio
                  ? 'Aún no has creado ninguna publicación'
                  : 'Este usuario no ha publicado nada aún'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {publicaciones.map((publicacion) => (
                <TarjetaPublicacion key={publicacion.id} publicacion={publicacion} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;