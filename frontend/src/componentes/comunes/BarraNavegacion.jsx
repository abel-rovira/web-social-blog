import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Bookmark, LogOut, Menu, X, User } from 'lucide-react';
import { useAutenticacion } from '../../contexto/ContextoAutenticacion';
import Avatar from './Avatar';
import { motion, AnimatePresence } from 'framer-motion';

const BarraNavegacion: React.FC = () => {
  const { autenticado, usuario, logout } = useAutenticacion();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const isActive = (path: string) => location.pathname === path;

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(busqueda.trim())}`);
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
    <header className="bg-card border-b border-border sticky top-0 z-50">
      {/* Franja superior decorativa */}
      <div className="h-0.5 bg-primary w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-display text-xl font-bold tracking-[0.12em] text-foreground hover:text-primary transition-colors">
              PIXARA
            </span>
          </Link>

          {/* Búsqueda desktop */}
          <form onSubmit={manejarBusqueda} className="hidden md:block flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar historias..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-muted border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground" />
              
            </div>
          </form>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/explorar"
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              isActive('/explorar') ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`
              }>
              
              Explorar
            </Link>

            {autenticado ?
            <>
                <Link
                to="/crear"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                
                  <PlusCircle className="w-4 h-4" />
                  Escribir
                </Link>
                <Link
                to="/guardados"
                className={`p-2 rounded-full transition-colors ${
                isActive('/guardados') ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`
                }
                title="Guardados">
                
                  <Bookmark className="w-4 h-4" />
                </Link>
                <Link
                to={`/perfil/${usuario?.nombreUsuario}`}
                className="ml-1"
                title="Mi perfil">
                
                  <Avatar src={usuario?.avatar} alt={usuario?.nombreUsuario} size="sm" className="hover:ring-primary transition-all" />
                </Link>
                <button
                onClick={manejarLogout}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-full transition-colors"
                title="Cerrar sesión">
                
                  <LogOut className="w-4 h-4" />
                </button>
              </> :

            <>
                <Link
                to="/login"
                className="px-4 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
                
                  Entrar
                </Link>
                <Link
                to="/registro"
                className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-terracotta-dark rounded-full transition-colors">
                
                  Registrarse
                </Link>
              </>
            }
          </nav>

          {/* Botón móvil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 text-foreground hover:bg-secondary rounded-full transition-colors"
            aria-label="Menú">
            
            {menuAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuAbierto &&
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-card border-t border-border">
          
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
              {/* Búsqueda móvil */}
              <form onSubmit={manejarBusqueda}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                  type="text"
                  placeholder="Buscar historias..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
                
                </div>
              </form>

              {/* Links móvil */}
              <div className="flex flex-col gap-1">
                <Link to="/explorar" onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                
                  <Search className="w-4 h-4 text-muted-foreground" /> Explorar
                </Link>
                {autenticado ?
              <>
                    <Link to="/crear" onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  
                      <PlusCircle className="w-4 h-4 text-muted-foreground" /> Escribir
                    </Link>
                    <Link to="/guardados" onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  
                      <Bookmark className="w-4 h-4 text-muted-foreground" /> Guardados
                    </Link>
                    <Link to={`/perfil/${usuario?.nombreUsuario}`} onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  
                      <User className="w-4 h-4 text-muted-foreground" /> Mi perfil
                    </Link>
                    <button onClick={manejarLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left">
                  
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </> :

              <div className="flex gap-2 pt-1">
                    <Link to="/login" onClick={() => setMenuAbierto(false)}
                className="flex-1 text-center px-4 py-2.5 text-sm font-medium border border-border rounded-full hover:bg-muted transition-colors">
                  
                      Entrar
                    </Link>
                    <Link to="/registro" onClick={() => setMenuAbierto(false)}
                className="flex-1 text-center px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-terracotta-dark transition-colors">
                  
                      Registrarse
                    </Link>
                  </div>
              }
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

};

export default BarraNavegacion;