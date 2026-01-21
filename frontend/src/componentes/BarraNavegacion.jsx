import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, PlusSquare, User, LogOut, Bookmark, Menu, X } from 'lucide-react';
import { useAutenticacion } from '../../contexto/ContextoAutenticacion';

const BarraNavegacion = () => {
  const { autenticado, usuario, logout } = useAutenticacion();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/explorar?q=${busqueda}`);
      setBusqueda('');
    }
  };

  const manejarLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">NS</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Social Blog</span>
          </Link>

          {/* barra de busqueda (escritorio) */}
          <form onSubmit={manejarBusqueda} className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar publicaciones, usuarios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* menu escritorio */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              <Home className="w-6 h-6" />
            </Link>

            <Link to="/explorar" className="text-gray-700 hover:text-blue-600 transition-colors">
              <Search className="w-6 h-6" />
            </Link>

            {autenticado ? (
              <>
                <Link to="/crear" className="text-gray-700 hover:text-blue-600 transition-colors">
                  <PlusSquare className="w-6 h-6" />
                </Link>

                <Link to="/guardados" className="text-gray-700 hover:text-blue-600 transition-colors">
                  <Bookmark className="w-6 h-6" />
                </Link>

                <Link
                  to={`/perfil/${usuario?.nombreUsuario}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <img
                    src={usuario?.avatar || 'https://via.placeholder.com/40'}
                    alt={usuario?.nombreUsuario}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                </Link>

                <button
                  onClick={manejarLogout}
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* boton menu movil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-gray-700"
          >
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* menu movil */}
        {menuAbierto && (
          <div className="md:hidden pb-4 space-y-4">
            {/* busqueda movil */}
            <form onSubmit={manejarBusqueda}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>

            {/* enlaces movil */}
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMenuAbierto(false)}
              >
                <Home className="w-5 h-5" />
                <span>Inicio</span>
              </Link>

              <Link
                to="/explorar"
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMenuAbierto(false)}
              >
                <Search className="w-5 h-5" />
                <span>Explorar</span>
              </Link>

              {autenticado ? (
                <>
                  <Link
                    to="/crear"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <PlusSquare className="w-5 h-5" />
                    <span>Crear</span>
                  </Link>

                  <Link
                    to="/guardados"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <Bookmark className="w-5 h-5" />
                    <span>Guardados</span>
                  </Link>

                  <Link
                    to={`/perfil/${usuario?.nombreUsuario}`}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Perfil</span>
                  </Link>

                  <button
                    onClick={() => {
                      manejarLogout();
                      setMenuAbierto(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BarraNavegacion;