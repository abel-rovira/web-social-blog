import React, { useState } from 'react';
import { Image, X, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const EditorPublicacion = ({ 
  titulo, 
  contenido, 
  etiquetas, 
  imagenes, 
  onTituloChange, 
  onContenidoChange, 
  onEtiquetasChange,
  onImagenesChange,
  onEliminarImagen 
}) => {
  const [vistaPrevia, setVistaPrevia] = useState(false);

  const manejarSubidaImagen = (e) => {
    const archivos = Array.from(e.target.files);
    
    if (archivos.length + imagenes.length > 10) {
      alert('Máximo 10 imágenes por publicación');
      return;
    }

    onImagenesChange(archivos);
  };

  return (
    <div>
      {/* controles */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editor de Publicación</h1>
        <button
          onClick={() => setVistaPrevia(!vistaPrevia)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {vistaPrevia ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {vistaPrevia ? 'Editar' : 'Vista Previa'}
        </button>
      </div>

      {!vistaPrevia ? (
        <>
          {/* titulo */}
          <input
            type="text"
            placeholder="Título de tu publicación..."
            value={titulo}
            onChange={(e) => onTituloChange(e.target.value)}
            className="w-full text-4xl font-bold border-none outline-none mb-6 placeholder-gray-300 focus:placeholder-gray-400"
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
                onChange={manejarSubidaImagen}
                className="hidden"
              />
            </label>

            {/* previsualizaciones */}
            {imagenes.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imagenes.map((imagen, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={typeof imagen === 'string' ? imagen : URL.createObjectURL(imagen)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => onEliminarImagen(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
            placeholder="Escribe tu historia... (usa Markdown para dar formato)"
            value={contenido}
            onChange={(e) => onContenidoChange(e.target.value)}
            className="w-full h-96 p-4 border border-gray-200 rounded-lg resize-none outline-none focus:border-blue-500 transition-colors font-mono text-sm"
          />

          {/* etiquetas */}
          <input
            type="text"
            placeholder="Etiquetas (separadas por comas): tecnología, viajes, comida"
            value={etiquetas}
            onChange={(e) => onEtiquetasChange(e.target.value)}
            className="w-full mt-4 px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
          />
        </>
      ) : (
        /* vista previa */
        <div>
          <h1 className="text-4xl font-bold mb-4">{titulo || 'Título de ejemplo'}</h1>
          {imagenes.length > 0 && (
            <img
              src={typeof imagenes[0] === 'string' ? imagenes[0] : URL.createObjectURL(imagenes[0])}
              alt="Preview"
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{contenido || '*Escribe algo para ver la vista previa*'}</ReactMarkdown>
          </div>
          {etiquetas && (
            <div className="flex flex-wrap gap-2 mt-6">
              {etiquetas.split(',').map((etiqueta, index) => (
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
  );
};

export default EditorPublicacion;