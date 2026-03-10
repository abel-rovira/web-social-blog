import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Estilos del editor

// Módulos de configuración del editor
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
    [{ color: [] }, { background: [] }],
  ],
};

// Formatos permitidos
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'align',
  'link', 'image',
  'color', 'background',
];

const EditorEnriquecido = ({ value, onChange, placeholder, altura = 300 }) => {
  const [contenido, setContenido] = useState(value || '');

  const handleChange = (nuevoContenido) => {
    setContenido(nuevoContenido);
    onChange(nuevoContenido);
  };

  return (
    <div className="editor-container">
      <ReactQuill
        theme="snow"
        value={contenido}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: altura, marginBottom: 50 }}
      />
      
      {/* Vista previa simple */}
      {contenido && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: contenido }}
          />
        </div>
      )}
    </div>
  );
};

export default EditorEnriquecido;