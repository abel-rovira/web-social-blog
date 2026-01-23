import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAutenticacion } from '../contexto/ContextoAutenticacion';

const IniciarSesion = () => {
  const navigate = useNavigate();
  const { login, autenticado } = useAutenticacion();
  const [formData, setFormData] = useState({
    identificador: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // si ya esta autenticado, redirigir
  React.useEffect(() => {
    if (autenticado) {
      navigate('/');
    }
  }, [autenticado, navigate]);

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    // validaciones basicas
    if (!formData.identificador || !formData.contrasena) {
      setError('Por favor completa todos los campos');
      setCargando(false);
      return;
    }

    try {
      const resultado = await login(formData);

      if (resultado.exito) {
        navigate('/');
      } else {
        setError(resultado.mensaje || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">NS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        {/* formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={manejarSubmit} className="space-y-6">
            {/* identificador */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario o correo electrónico
              </label>
              <input
                type="text"
                name="identificador"
                value={formData.identificador}
                onChange={manejarCambio}
                placeholder="juanperez o juan@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={cargando}
              />
            </div>

            {/* contrasena */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={manejarCambio}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={cargando}
              />
            </div>

            {/* boton submit */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          {/* enlace a registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-blue-600 hover:text-blue-700 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* texto legal */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Al iniciar sesión, aceptas nuestros{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
};

export default IniciarSesion;