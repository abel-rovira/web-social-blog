import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PenSquare, Bookmark, LogOut, Menu, X, User, Home, Compass } from 'lucide-react';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import Avatar from './Avatar';

const BarraNavegacion = () => {
  const { autenticado, usuario, logout } = useAutenticacion();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(busqueda)}`);
      setBusqueda('');
      setMenuAbierto(false);
    }
  };

  const manejarLogout = () => {
    logout();
    navigate('/');
    setMenuAbierto(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-blog">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">Blog</span>
            <span className="text-gray-600 text-sm hidden sm:inline">Moderno</span>
          </Link>

          {/* Búsqueda Desktop */}
          <form onSubmit={manejarBusqueda} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Inicio"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link
              to="/explorar"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Explorar"
            >
              <Compass className="w-5 h-5" />
            </Link>
            
            {autenticado ? (
              <>
                <Link
                  to="/crear"
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Escribir"
                >
                  <PenSquare className="w-5 h-5" />
                </Link>
                <Link
                  to="/guardados"
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Guardados"
                >
                  <Bookmark className="w-5 h-5" />
                </Link>
                <Link
                  to={`/perfil/${usuario?.nombreUsuario}`}
                  className="ml-2"
                >
                  <Avatar
                    src={usuario?.avatar}
                    alt={usuario?.nombreUsuario}
                    size="sm"
                  />
                </Link>
                <button
                  onClick={manejarLogout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón móvil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container-blog space-y-3">
            {/* Búsqueda móvil */}
            <form onSubmit={manejarBusqueda}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            {/* Links móvil */}
            <div className="flex flex-col">
              <Link
                to="/"
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Home className="w-5 h-5 text-gray-600" />
                Inicio
              </Link>
              <Link
                to="/explorar"
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Compass className="w-5 h-5 text-gray-600" />
                Explorar
              </Link>
              
              {autenticado ? (
                <>
                  <Link
                    to="/crear"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <PenSquare className="w-5 h-5 text-gray-600" />
                    Escribir
                  </Link>
                  <Link
                    to="/guardados"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <Bookmark className="w-5 h-5 text-gray-600" />
                    Guardados
                  </Link>
                  <Link
                    to={`/perfil/${usuario?.nombreUsuario}`}
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    Mi perfil
                  </Link>
                  <button
                    onClick={manejarLogout}
                    className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuAbierto(false)}
                    className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setMenuAbierto(false)}
                    className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BarraNavegacion;