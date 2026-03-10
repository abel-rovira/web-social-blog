import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { publicacionesAPI } from '../servicios/api';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';
import EditorEnriquecido from '../componentes/publicaciones/EditorEnriquecido';
import { Image, X, Send, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const CrearPublicacion = () => {
  const { id } = useParams(); // Para edición
  const navigate = useNavigate();
  const { autenticado } = useAutenticacion();

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    etiquetas: ''
  });
  const [imagenes, setImagenes] = useState([]);
  const [previsualizaciones, setPrevisualizaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modoVistaPrevia, setModoVistaPrevia] = useState(false);

  // Redirigir si no está autenticado
  React.useEffect(() => {
    if (!autenticado) {
      navigate('/login');
    }
  }, [autenticado, navigate]);

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarContenido = (contenido) => {
    setFormData({
      ...formData,
      contenido
    });
  };

  const manejarImagenes = (e) => {
    const archivos = Array.from(e.target.files);
    
    if (archivos.length + imagenes.length > 10) {
      toast.error('Máximo 10 imágenes por publicación');
      return;
    }

    setImagenes([...imagenes, ...archivos]);

    archivos.forEach(archivo => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrevisualizaciones(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(archivo);
    });
  };

  const eliminarImagen = (index) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
    setPrevisualizaciones(previsualizaciones.filter((_, i) => i !== index));
  };

  const validarFormulario = () => {
    if (!formData.titulo.trim()) {
      toast.error('El título es obligatorio');
      return false;
    }
    if (!formData.contenido.trim()) {
      toast.error('El contenido es obligatorio');
      return false;
    }
    return true;
  };

  const manejarPublicar = async (esBorrador = false) => {
    if (!validarFormulario()) return;

    setCargando(true);

    try {
      const etiquetasArray = formData.etiquetas
        .split(',')
        .map(e => e.trim())
        .filter(e => e);

      const datos = {
        titulo: formData.titulo,
        contenido: formData.contenido,
        etiquetas: etiquetasArray,
        imagenes,
        esBorrador
      };

      let respuesta;
      if (id) {
        // Editar publicación existente
        respuesta = await publicacionesAPI.actualizar(id, datos);
      } else {
        // Crear nueva publicación
        respuesta = await publicacionesAPI.crear(datos);
      }

      if (respuesta.data.exito) {
        toast.success(esBorrador ? 'Borrador guardado' : 'Publicación creada');
        navigate(`/publicacion/${respuesta.data.datos.id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.mensaje || 'Error al guardar la publicación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="container-pixara py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Cabecera */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              {id ? 'Editar Publicación' : 'Crear Nueva Publicación'}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setModoVistaPrevia(!modoVistaPrevia)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {modoVistaPrevia ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Editar
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Vista Previa
                  </>
                )}
              </button>
            </div>
          </div>

          {!modoVistaPrevia ? (
            <>
              {/* Título */}
              <input
                type="text"
                name="titulo"
                placeholder="Título de tu historia..."
                value={formData.titulo}
                onChange={manejarCambio}
                className="w-full text-3xl font-serif font-bold border-none outline-none mb-6 placeholder-gray-300"
                disabled={cargando}
              />

              {/* Subir imágenes */}
              <div className="mb-6">
                <label className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors w-fit">
                  <Image className="w-5 h-5" />
                  <span className="font-medium">Añadir imágenes</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={manejarImagenes}
                    className="hidden"
                    disabled={cargando}
                  />
                </label>

                {/* Previsualizaciones */}
                {previsualizaciones.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {previsualizaciones.map((prev, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={prev}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => eliminarImagen(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={cargando}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Editor enriquecido */}
              <EditorEnriquecido
                value={formData.contenido}
                onChange={manejarContenido}
                placeholder="Escribe tu historia... (puedes usar negrita, listas, enlaces, etc.)"
                altura={400}
              />

              {/* Etiquetas */}
              <div className="mt-20">
                <input
                  type="text"
                  name="etiquetas"
                  placeholder="Etiquetas (separadas por comas): escritura, viajes, tecnología"
                  value={formData.etiquetas}
                  onChange={manejarCambio}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  disabled={cargando}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => manejarPublicar(true)}
                  disabled={cargando}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Guardar borrador
                </button>
                <button
                  onClick={() => manejarPublicar(false)}
                  disabled={cargando}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Publicar
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Vista previa */
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-serif font-bold">
                {formData.titulo || 'Título de ejemplo'}
              </h1>
              
              {previsualizaciones.length > 0 && (
                <img
                  src={previsualizaciones[0]}
                  alt="Preview"
                  className="w-full h-96 object-cover rounded-lg my-6"
                />
              )}
              
              <div dangerouslySetInnerHTML={{ 
                __html: formData.contenido || '<p>Escribe algo para ver la vista previa...</p>' 
              }} />
              
              {formData.etiquetas && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {formData.etiquetas.split(',').map((etiqueta, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium"
                    >
                      #{etiqueta.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Guía rápida */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Guía rápida</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Puedes usar el editor para dar formato a tu texto</p>
            <p>• Añade hasta 10 imágenes por publicación</p>
            <p>• Las etiquetas ayudan a otros usuarios a encontrar tu contenido</p>
            <p>• Los borradores se guardan automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPublicacion;