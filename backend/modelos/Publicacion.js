const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Publicacion = sequelize.define('Publicacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imagenes: {
      type: DataTypes.JSON, // Array de URLs
      allowNull: true,
      defaultValue: []
    },
    etiquetas: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }, 
    vistas: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'publicaciones',
    timestamps: true
  });

  return Publicacion;
};

// intentar la conexion