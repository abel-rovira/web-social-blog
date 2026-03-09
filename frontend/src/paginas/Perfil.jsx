import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { usuariosAPI, publicacionesAPI, seguidoresAPI } from '../servicios/api';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import EditarPerfil from '../componentes/perfil/EditarPerfil';
import TarjetaPublicacion from '../componentes/publicaciones/TarjetaPublicacion';
import Cargando from '../componentes/comunes/Cargando';
import { Settings, Calendar, Link as LinkIcon, MapPin, Users, UserPlus, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Perfil = () => {
  const { nombreUsuario } = useParams();
  const navigate = useNavigate();
  const { usuario: usuarioActual, autenticado } = useAutenticacion();
  
  const [usuario, setUsuario] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [siguiendo, setSiguiendo] = useState(false);
  const [procesandoSeguir, setProcesandoSeguir] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [stats, setStats] = useState({
    seguidores: 0,
    siguiendo: 0,
    publicaciones: 0
  });

  useEffect(() => {
    if (nombreUsuario) {
      cargarPerfil();
    }
  }, [nombreUsuario]);

  const cargarPerfil = async () => {
    try {
      setCargando(true);
      const respuesta = await usuariosAPI.obtenerPerfil(nombreUsuario);
      
      if (respuesta.data.exito) {
        const datos = respuesta.data.datos;
        setUsuario(datos);
        setPublicaciones(datos.publicaciones || []);
        setStats({
          seguidores: datos.totalSeguidores || 0,
          siguiendo: datos.totalSiguiendo || 0,
          publicaciones: datos.totalPublicaciones || 0
        });
        setSiguiendo(datos.sigueAlUsuario || false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el perfil');
      navigate('/');
    } finally {
      setCargando(false);
    }
  };

  const handleSeguir = async () => {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    setProcesandoSeguir(true);
    try {
      if (siguiendo) {
        await seguidoresAPI.dejarDeSeguir(usuario.id);
        setStats(prev => ({ ...prev, seguidores: prev.seguidores - 1 }));
        toast.success(`Dejaste de seguir a @${usuario.nombreUsuario}`);
      } else {
        await seguidoresAPI.seguir(usuario.id);
        setStats(prev => ({ ...prev, seguidores: prev.seguidores + 1 }));
        toast.success(`Ahora sigues a @${usuario.nombreUsuario}`);
      }
      setSiguiendo(!siguiendo);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la solicitud');
    } finally {
      setProcesandoSeguir(false);
    }
  };

  const handlePerfilActualizado = (datosActualizados) => {
    setUsuario(datosActualizados);
    setStats({
      seguidores: datosActualizados.totalSeguidores || 0,
      siguiendo: datosActualizados.totalSiguiendo || 0,
      publicaciones: datosActualizados.totalPublicaciones || 0
    });
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BarraNavegacion />
        <Cargando texto="Cargando perfil..." />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BarraNavegacion />
        <div className="container-pixara py-12 text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-2">Usuario no encontrado</h2>
          <p className="text-gray-600">El perfil que buscas no existe</p>
        </div>
      </div>
    );
  }

  const esPerfilPropio = autenticado && usuarioActual?.id === usuario.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="container-pixara py-8">
        {/* Cabecera del perfil */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <img
                src={usuario.avatar}
                alt={usuario.nombreUsuario}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-amber-100"
              />
            </div>

            {/* Información */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-gray-900">
                    {usuario.nombreUsuario}
                  </h1>
                  {usuario.nombreCompleto && (
                    <p className="text-gray-600">{usuario.nombreCompleto}</p>
                  )}
                </div>

                {esPerfilPropio ? (
                  <button
                    onClick={() => setModalEditarAbierto(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Editar perfil
                  </button>
                ) : autenticado ? (
                  <button
                    onClick={handleSeguir}
                    disabled={procesandoSeguir}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                      siguiendo
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {procesandoSeguir ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : siguiendo ? (
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
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Seguir
                  </button>
                )}
              </div>

              {/* Estadísticas */}
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.publicaciones}</div>
                  <div className="text-sm text-gray-600">Publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.seguidores}</div>
                  <div className="text-sm text-gray-600">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.siguiendo}</div>
                  <div className="text-sm text-gray-600">Siguiendo</div>
                </div>
              </div>

              {/* Biografía */}
              {usuario.biografia && (
                <p className="text-gray-700 mb-4">{usuario.biografia}</p>
              )}

              {/* Enlaces */}
              {usuario.enlaces && usuario.enlaces.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {usuario.enlaces.map((enlace, index) => (
                    enlace && (
                      <a
                        key={index}
                        href={enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {new URL(enlace).hostname.replace('www.', '')}
                      </a>
                    )
                  ))}
                </div>
              )}

              {/* Fecha de registro */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                Miembro desde {format(new Date(usuario.fechaCreacion), "MMMM yyyy", { locale: es })}
              </div>
            </div>
          </div>
        </div>

        {/* Publicaciones */}
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
            Publicaciones
          </h2>

          {publicaciones.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-600 text-lg">
                {esPerfilPropio
                  ? 'Aún no has creado ninguna publicación'
                  : 'Este usuario no ha publicado nada aún'}
              </p>
              {esPerfilPropio && (
                <button
                  onClick={() => navigate('/crear')}
                  className="mt-4 btn-primary"
                >
                  Crear mi primera publicación
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicaciones.map((publicacion) => (
                <TarjetaPublicacion key={publicacion.id} publicacion={publicacion} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <EditarPerfil
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        onPerfilActualizado={handlePerfilActualizado}
      />
    </div>
  );
};

export default Perfil;