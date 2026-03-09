import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, PenSquare, Bookmark, LogOut, Menu, X, User, Home, Compass } from 'lucide-react';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import Avatar from './Avatar';

const BarraNavegacion = () => {
  const { autenticado, usuario, logout } = useAutenticacion();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(busqueda)}`);
      setBusqueda('');
      setMenuAbierto(false);
    }
  };

  const handleLogout = () => {
    logout(); // Esto ya redirige al inicio
  };

  // Si está cargando, mostrar un esqueleto simple
  if (!usuario && autenticado) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-pixara">
          <div className="flex items-center justify-between h-16">
            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-pixara">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
            onClick={() => setMenuAbierto(false)}
          >
            <span className="font-serif text-2xl font-bold text-gray-900">
              PIXARA
            </span>
          </Link>

          {/* Búsqueda Desktop */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar historias..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </form>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-amber-600 bg-amber-50' 
                  : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              Inicio
            </Link>
            
            <Link
              to="/explorar"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/explorar') 
                  ? 'text-amber-600 bg-amber-50' 
                  : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              Explorar
            </Link>
            
            {autenticado && usuario ? (
              <>
                <Link
                  to="/crear"
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/crear') 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <PenSquare className="w-4 h-4" />
                  Escribir
                </Link>
                
                <Link
                  to="/guardados"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/guardados') 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                  title="Guardados"
                >
                  <Bookmark className="w-5 h-5" />
                </Link>
                
                <Link
                  to={`/perfil/${usuario.nombreUsuario}`}
                  className="ml-2"
                >
                  <Avatar
                    src={usuario.avatar}
                    alt={usuario.nombreUsuario}
                    size="sm"
                    className="border-2 border-transparent hover:border-amber-400 transition-all"
                  />
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
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
          <div className="container-pixara space-y-3">
            {/* Búsqueda móvil */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar historias..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </form>

            {/* Links móvil */}
            <div className="flex flex-col">
              <Link
                to="/"
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Home className="w-5 h-5 text-gray-500" />
                Inicio
              </Link>
              
              <Link
                to="/explorar"
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Compass className="w-5 h-5 text-gray-500" />
                Explorar
              </Link>
              
              {autenticado && usuario ? (
                <>
                  <Link
                    to="/crear"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <PenSquare className="w-5 h-5 text-gray-500" />
                    Escribir
                  </Link>
                  
                  <Link
                    to="/guardados"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <Bookmark className="w-5 h-5 text-gray-500" />
                    Guardados
                  </Link>
                  
                  <Link
                    to={`/perfil/${usuario.nombreUsuario}`}
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    Mi perfil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuAbierto(false)}
                    className="px-4 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setMenuAbierto(false)}
                    className="px-4 py-3 text-center bg-amber-600 text-white rounded-lg hover:bg-amber-700"
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