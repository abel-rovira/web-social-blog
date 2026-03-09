import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { LogIn } from 'lucide-react';

const IniciarSesion = () => {
  const navigate = useNavigate();
  const { login } = useAutenticacion();
  
  const [formData, setFormData] = useState({
    identificador: '',
    contrasena: ''
  });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.identificador || !formData.contrasena) {
      return;
    }

    setCargando(true);
    
    const resultado = await login(formData);
    
    if (resultado.exito) {
      navigate('/');
    }
    
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-gray-900 mb-2">Bienvenido de nuevo</h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario o email
            </label>
            <input
              type="text"
              name="identificador"
              value={formData.identificador}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              className="input-moderno"
              disabled={cargando}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-moderno"
              disabled={cargando}
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {cargando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Iniciando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-amber-600 hover:text-amber-700 font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default IniciarSesion;