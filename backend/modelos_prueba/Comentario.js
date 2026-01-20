const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comentario = sequelize.define('Comentario', {
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
      },
      onDelete: 'CASCADE',
      field: 'usuario_id'
    },
    publicacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publicaciones',
        key: 'id'
      },
      onDelete: 'CASCADE',
      field: 'publicacion_id'
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El comentario no puede estar vacío'
        },
        len: {
          args: [1, 1000],
          msg: 'El comentario debe tener entre 1 y 1000 caracteres'
        }
      },
      field: 'contenido'
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    }
  }, {
    tableName: 'comentarios',
    timestamps: false
  });

  return Comentario;
};