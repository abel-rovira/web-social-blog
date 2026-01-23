import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAutenticacion } from '../contexto/ContextoAutenticacion';

const Registro = () => {
  const navigate = useNavigate();
  const { registro, autenticado } = useAutenticacion();
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [errores, setErrores] = useState({});
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
    // limpiar error del campo
    setErrores({
      ...errores,
      [e.target.name]: ''
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // validar nombre de usuario
    if (!formData.nombreUsuario) {
      nuevosErrores.nombreUsuario = 'El nombre de usuario es obligatorio';
    } else if (formData.nombreUsuario.length < 3) {
      nuevosErrores.nombreUsuario = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.nombreUsuario)) {
      nuevosErrores.nombreUsuario = 'Solo letras, números y guiones bajos';
    }

    // validar correo
    if (!formData.correo) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.correo = 'Correo electrónico inválido';
    }

    // validar contrasena
    if (!formData.contrasena) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria';
    } else if (formData.contrasena.length < 6) {
      nuevosErrores.contrasena = 'Debe tener al menos 6 caracteres';
    }

    // validar confirmacion
    if (formData.contrasena !== formData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCargando(true);

    try {
      const resultado = await registro({
        nombreUsuario: formData.nombreUsuario,
        correo: formData.correo,
        contrasena: formData.contrasena
      });

      if (resultado.exito) {
        navigate('/');
      } else {
        setErrores({ general: resultado.mensaje || 'Error al registrarse' });
      }
    } catch (err) {
      setErrores({ general: 'Error al conectar con el servidor' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">NS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600">Únete a nuestra comunidad</p>
        </div>

        {/* formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {errores.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {errores.general}
            </div>
          )}

          <form onSubmit={manejarSubmit} className="space-y-5">
            {/* nombre de usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={manejarCambio}
                placeholder="juanperez"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errores.nombreUsuario ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={cargando}
              />
              {errores.nombreUsuario && (
                <p className="mt-1 text-sm text-red-600">{errores.nombreUsuario}</p>
              )}
            </div>

            {/* correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={manejarCambio}
                placeholder="juan@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errores.correo ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={cargando}
              />
              {errores.correo && (
                <p className="mt-1 text-sm text-red-600">{errores.correo}</p>
              )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errores.contrasena ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={cargando}
              />
              {errores.contrasena && (
                <p className="mt-1 text-sm text-red-600">{errores.contrasena}</p>
              )}
            </div>

            {/* confirmar contrasena */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={manejarCambio}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errores.confirmarContrasena ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={cargando}
              />
              {errores.confirmarContrasena && (
                <p className="mt-1 text-sm text-red-600">{errores.confirmarContrasena}</p>
              )}
            </div>

            {/* boton submit */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
            >
              {cargando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear cuenta
                </>
              )}
            </button>
          </form>

          {/* enlace a login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* texto legal */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Al registrarte, aceptas nuestros{' '}
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

export default Registro;