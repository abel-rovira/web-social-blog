import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexto/ContextoAutenticacion';

// Páginas
import Inicio from './paginas/Inicio';
import IniciarSesion from './paginas/IniciarSesion';
import Registro from './paginas/Registro';
import CrearPublicacion from './paginas/CrearPublicacion';
import DetallePublicacion from './paginas/DetallePublicacion';
import Explorar from './paginas/Explorar';
import Perfil from './paginas/Perfil';
import Guardados from './paginas/Guardados';

// Componentes
import RutaProtegida from './componentes/RutaProtegida';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              icon: '✅',
              style: {
                background: '#10b981',
              },
            },
            error: {
              icon: '❌',
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/publicacion/:id" element={<DetallePublicacion />} />
          <Route path="/perfil/:nombreUsuario" element={<Perfil />} />
          
          {/* Rutas protegidas (requieren autenticación) */}
          <Route path="/crear" element={
            <RutaProtegida>
              <CrearPublicacion />
            </RutaProtegida>
          } />
          
          <Route path="/guardados" element={
            <RutaProtegida>
              <Guardados />
            </RutaProtegida>
          } />
          
          <Route path="/editar/:id" element={
            <RutaProtegida>
              <CrearPublicacion />
            </RutaProtegida>
          } />
          
          {/* Redirigir rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;