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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container-pixara">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Estilo PIXARA */}
          <Link to="/" className="flex items-center">
            <span className="title-serif text-2xl text-gray-900 tracking-wider">
              PIXARA
            </span>
          </Link>

          {/* Búsqueda Desktop - con el estilo "Q Buscar historias..." */}
          <form onSubmit={manejarBusqueda} className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Q Buscar historias..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 placeholder-gray-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400 hover:text-amber-600 transition-colors" />
              </button>
            </div>
          </form>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/explorar"
              className="px-4 py-2 text-gray-600 hover:text-amber-600 font-medium transition-colors"
            >
              Explorar
            </Link>
            
            {autenticado ? (
              <>
                <Link
                  to="/crear"
                  className="px-4 py-2 text-gray-600 hover:text-amber-600 font-medium transition-colors flex items-center gap-1"
                >
                  <PenSquare className="w-4 h-4" />
                  Escribir
                </Link>
                <Link
                  to="/guardados"
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
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
                    className="border-2 border-transparent hover:border-amber-400 transition-all"
                  />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-amber-600 font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors font-medium"
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
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container-pixara space-y-4">
            {/* Búsqueda móvil */}
            <form onSubmit={manejarBusqueda}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Q Buscar historias..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </form>

            {/* Links móvil */}
            <div className="flex flex-col">
              <Link
                to="/explorar"
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Compass className="w-5 h-5 text-gray-500" />
                Explorar
              </Link>
              
              {autenticado ? (
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
                    to={`/perfil/${usuario?.nombreUsuario}`}
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    Mi perfil
                  </Link>
                  <button
                    onClick={manejarLogout}
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
                    className="px-4 py-3 text-center bg-amber-600 text-white rounded-full hover:bg-amber-700"
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