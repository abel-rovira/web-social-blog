import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAutenticacion } from './contexto/ContextoAutenticacion';

// paginas
import Inicio from './paginas/Inicio';
import IniciarSesion from './paginas/IniciarSesion';
import Registro from './paginas/Registro';

function App() {
  return (
    <Router>
      <ProveedorAutenticacion>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ProveedorAutenticacion>
    </Router>
  );
}

export default App;