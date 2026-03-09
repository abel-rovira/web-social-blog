import React, { useState } from 'react';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import { usuariosAPI } from '../../servicios/api';
import { X, Camera, Save, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const EditarPerfil = ({ isOpen, onClose, onPerfilActualizado }) => {
  const { usuario, actualizarUsuario } = useAutenticacion();
  const [cargando, setCargando] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(usuario?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [formData, setFormData] = useState({
    nombreUsuario: usuario?.nombreUsuario || '',
    biografia: usuario?.biografia || '',
    correo: usuario?.correo || '',
    enlaces: usuario?.enlaces || ['', '', ''],
    usarAvatarPersonalizado: usuario?.avatarPersonalizado || false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEnlaceChange = (index, value) => {
    const nuevosEnlaces = [...formData.enlaces];
    nuevosEnlaces[index] = value;
    setFormData({
      ...formData,
      enlaces: nuevosEnlaces
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFormData({
        ...formData,
        usarAvatarPersonalizado: true
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const datosActualizar = {
        nombreUsuario: formData.nombreUsuario,
        biografia: formData.biografia,
        correo: formData.correo,
        enlaces: JSON.stringify(formData.enlaces.filter(e => e.trim() !== '')),
        usarAvatarPersonalizado: formData.usarAvatarPersonalizado
      };

      if (avatarFile) {
        datosActualizar.avatar = avatarFile;
      }

      const respuesta = await usuariosAPI.actualizarPerfil(datosActualizar);

      if (respuesta.data.exito) {
        actualizarUsuario(respuesta.data.datos);
        toast.success('Perfil actualizado correctamente');
        onPerfilActualizado?.(respuesta.data.datos);
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.mensaje || 'Error al actualizar perfil');
    } finally {
      setCargando(false);
    }
  };

  const handleVolverAvatarDefault = () => {
    setAvatarFile(null);
    setAvatarPreview(`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombreUsuario)}&background=random&size=150`);
    setFormData({
      ...formData,
      usarAvatarPersonalizado: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-gray-900">Editar Perfil</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.usarAvatarPersonalizado && (
                <button
                  type="button"
                  onClick={handleVolverAvatarDefault}
                  className="mt-2 text-sm text-gray-500 hover:text-amber-600 transition-colors"
                >
                  Volver al avatar por defecto
                </button>
              )}
            </div>

            {/* Nombre de usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                className="input-moderno"
                required
              />
            </div>

            {/* Correo electrónico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="input-moderno"
                required
              />
            </div>

            {/* Biografía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía
              </label>
              <textarea
                name="biografia"
                value={formData.biografia}
                onChange={handleChange}
                rows="4"
                className="input-moderno"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            {/* Enlaces */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlaces
              </label>
              <div className="space-y-3">
                {formData.enlaces.map((enlace, index) => (
                  <div key={index} className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={enlace}
                      onChange={(e) => handleEnlaceChange(index, e.target.value)}
                      placeholder={`https://ejemplo.com`}
                      className="input-moderno pl-10"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={cargando}
                className="btn-primary flex items-center gap-2"
              >
                {cargando ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfil;