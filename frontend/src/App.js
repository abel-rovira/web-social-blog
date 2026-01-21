import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAutenticacion, useAutenticacion } from './contexto/ContextoAutenticacion';

// paginas
import Inicio from './paginas/Inicio';
import IniciarSesion from './paginas/IniciarSesion';
import Registro from './paginas/Registro';
import Perfil from './paginas/Perfil';
import CrearPublicacion from './paginas/CrearPublicacion';
import DetallePublicacion from './paginas/DetallePublicacion';
import Explorar from './paginas/Explorar';
import Guardados from './paginas/Guardados';

// componente para proteger rutas
const RutaProtegida = ({ children }) => {
  const { autenticado, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return autenticado ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ProveedorAutenticacion>
        <Routes>
          {/* rutas publicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/perfil/:nombreUsuario" element={<Perfil />} />
          <Route path="/publicacion/:id" element={<DetallePublicacion />} />

          {/* rutas protegidas */}
          <Route
            path="/crear"
            element={
              <RutaProtegida>
                <CrearPublicacion />
              </RutaProtegida>
            }
          />
          <Route
            path="/guardados"
            element={
              <RutaProtegida>
                <Guardados />
              </RutaProtegida>
            }
          />

          {/* ruta 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ProveedorAutenticacion>
    </Router>
  );
}

export default App;