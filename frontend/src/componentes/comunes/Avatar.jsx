import React from 'react';

const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  const tamanos = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  // Generar avatar por defecto si no hay imagen
  const avatarSrc = src || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt || 'Usuario')}&background=random&size=150`;

  return (
    <img
      src={avatarSrc}
      alt={alt}
      className={`${tamanos[size]} rounded-full object-cover border-2 border-gray-200 ${className}`}
    />
  );
};

export default Avatar;