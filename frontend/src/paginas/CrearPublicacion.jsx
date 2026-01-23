import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, X, Send, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { publicacionesAPI } from '../servicios/api';
import BarraNavegacion from '../componentes/comunes/BarraNavegacion';

const CrearPublicacion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    etiquetas: ''
  });
  const [imagenes, setImagenes] = useState([]);
  const [previsualizaciones, setPrevisualizaciones] = useState([]);
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarImagenes = (e) => {
    const archivos = Array.from(e.target.files);
    
    if (archivos.length + imagenes.length > 10) {
      setError('Máximo 10 imágenes por publicación');
      return;
    }

    setImagenes([...imagenes, ...archivos]);

    // crear previsualizaciones
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
      setError('El título es obligatorio');
      return false;
    }
    if (!formData.contenido.trim()) {
      setError('El contenido es obligatorio');
      return false;
    }
    return true;
  };

  const manejarPublicar = async (esBorrador = false) => {
    if (!validarFormulario()) return;

    setCargando(true);
    setError('');

    try {
      const etiquetasArray = formData.etiquetas
        .split(',')
        .map(e => e.trim())
        .filter(e => e);

      await publicacionesAPI.crear({
        titulo: formData.titulo,
        contenido: formData.contenido,
        etiquetas: etiquetasArray,
        imagenes,
        esBorrador
      });

      navigate('/');
    } catch (err) {
      console.error('Error al crear publicación:', err);
      setError(err.response?.data?.mensaje || 'Error al crear publicación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* cabecera */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Crear Publicación</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setVistaPrevia(!vistaPrevia)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {vistaPrevia ? 'Editar' : 'Vista Previa'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!vistaPrevia ? (
            <>
              {/* titulo */}
              <input
                type="text"
                name="titulo"
                placeholder="Título de tu publicación..."
                value={formData.titulo}
                onChange={manejarCambio}
                className="w-full text-4xl font-bold border-none outline-none mb-6 placeholder-gray-300 focus:placeholder-gray-400"
                disabled={cargando}
              />

              {/* subir imagenes */}
              <div className="mb-6">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors w-fit">
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

                {/* previsualizaciones */}
                {previsualizaciones.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {previsualizaciones.map((prev, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={prev}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
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

              {/* editor markdown */}
              <textarea
                name="contenido"
                placeholder="Escribe tu historia... (usa Markdown para dar formato)"
                value={formData.contenido}
                onChange={manejarCambio}
                className="w-full h-96 p-4 border border-gray-200 rounded-lg resize-none outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                disabled={cargando}
              />

              {/* etiquetas */}
              <input
                type="text"
                name="etiquetas"
                placeholder="Etiquetas (separadas por comas): tecnología, viajes, comida"
                value={formData.etiquetas}
                onChange={manejarCambio}
                className="w-full mt-4 px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                disabled={cargando}
              />

              {/* botones de accion */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => manejarPublicar(true)}
                  disabled={cargando}
                  className="px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar borrador
                </button>
                <button
                  onClick={() => manejarPublicar(false)}
                  disabled={cargando}
                  className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
            /* vista previa */
            <div>
              <h1 className="text-4xl font-bold mb-4">{formData.titulo || 'Título de ejemplo'}</h1>
              {previsualizaciones.length > 0 && (
                <img
                  src={previsualizaciones[0]}
                  alt="Preview"
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              )}
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{formData.contenido || '*Escribe algo para ver la vista previa*'}</ReactMarkdown>
              </div>
              {formData.etiquetas && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {formData.etiquetas.split(',').map((etiqueta, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                    >
                      #{etiqueta.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* guia de markdown */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Guía rápida de Markdown</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><code># Título</code> → Encabezado principal</p>
            <p><code>## Subtítulo</code> → Encabezado secundario</p>
            <p><code>**negrita**</code> → <strong>negrita</strong></p>
            <p><code>*cursiva*</code> → <em>cursiva</em></p>
            <p><code>[texto](url)</code> → enlace</p>
            <p><code>- item</code> → lista con viñetas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPublicacion;