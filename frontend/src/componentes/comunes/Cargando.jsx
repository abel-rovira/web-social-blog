import React from 'react';

const Cargando = ({ texto = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{texto}</p>
    </div>
  );
};

export default Cargando;