const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Etiqueta = sequelize.define('Etiqueta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre de la etiqueta no puede estar vacío'
        },
        len: {
          args: [2, 50],
          msg: 'La etiqueta debe tener entre 2 y 50 caracteres'
        },
        is: {
          args: /^[a-z0-9_-]+$/i,
          msg: 'La etiqueta solo puede contener letras, números, guiones y guiones bajos'
        }
      },
      field: 'nombre'
    }
  }, {
    tableName: 'etiquetas',
    timestamps: false,
    hooks: {
      beforeCreate: (etiqueta) => {
        etiqueta.nombre = etiqueta.nombre.toLowerCase().trim();
      },
      beforeUpdate: (etiqueta) => {
        etiqueta.nombre = etiqueta.nombre.toLowerCase().trim();
      }
    }
  });

  return Etiqueta;
};