import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { UserPlus } from 'lucide-react';

const Registro = () => {
  const navigate = useNavigate();
  const { registro } = useAutenticacion();
  
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error del campo
    setErrores({
      ...errores,
      [e.target.name]: ''
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreUsuario || formData.nombreUsuario.length < 3) {
      nuevosErrores.nombreUsuario = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.correo || !/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.correo = 'Email inválido';
    }

    if (!formData.contrasena || formData.contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    
    const resultado = await registro({
      nombreUsuario: formData.nombreUsuario,
      correo: formData.correo,
      contrasena: formData.contrasena
    });
    
    if (resultado.exito) {
      navigate('/');
    }
    
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-gray-900 mb-2">Crear cuenta</h1>
          <p className="text-gray-600">Únete a la comunidad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              placeholder="usuario123"
              className={`input-moderno ${errores.nombreUsuario ? 'border-red-500' : ''}`}
              disabled={cargando}
              required
            />
            {errores.nombreUsuario && (
              <p className="mt-1 text-sm text-red-600">{errores.nombreUsuario}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              className={`input-moderno ${errores.correo ? 'border-red-500' : ''}`}
              disabled={cargando}
              required
            />
            {errores.correo && (
              <p className="mt-1 text-sm text-red-600">{errores.correo}</p>
            )}
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
              className={`input-moderno ${errores.contrasena ? 'border-red-500' : ''}`}
              disabled={cargando}
              required
            />
            {errores.contrasena && (
              <p className="mt-1 text-sm text-red-600">{errores.contrasena}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              placeholder="••••••••"
              className={`input-moderno ${errores.confirmarContrasena ? 'border-red-500' : ''}`}
              disabled={cargando}
              required
            />
            {errores.confirmarContrasena && (
              <p className="mt-1 text-sm text-red-600">{errores.confirmarContrasena}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {cargando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Registrarse
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;