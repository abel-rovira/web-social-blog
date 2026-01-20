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
      },
      onDelete: 'CASCADE',
      field: 'usuario_id'
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título no puede estar vacío'
        },
        len: {
          args: [3, 200],
          msg: 'El título debe tener entre 3 y 200 caracteres'
        }
      },
      field: 'titulo'
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El contenido no puede estar vacío'
        },
        len: {
          args: [10, 50000],
          msg: 'El contenido debe tener al menos 10 caracteres'
        }
      },
      field: 'contenido'
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: [],
      field: 'imagenes'
    },
    esBorrador: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'es_borrador'
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_actualizacion'
    }
  }, {
    tableName: 'publicaciones',
    timestamps: false,
    hooks: {
      beforeUpdate: (publicacion) => {
        publicacion.fechaActualizacion = new Date();
      }
    }
  });

  return Publicacion;
};