const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombreUsuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'Este nombre de usuario ya está en uso'
      },
      validate: {
        len: {
          args: [3, 50],
          msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres'
        }
      },
      field: 'nombre_usuario'
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Este correo ya está registrado'
      },
      validate: {
        isEmail: {
          msg: 'Debe ser un correo electrónico válido'
        }
      },
      field: 'correo'
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'La contraseña debe tener al menos 6 caracteres'
        }
      },
      field: 'contrasena'
    },
    avatar: {
      type: DataTypes.STRING(255),
      defaultValue: 'https://via.placeholder.com/150',
      field: 'avatar'
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'La biografía no puede superar los 500 caracteres'
        }
      },
      field: 'biografia'
    },
    enlaces: {
      type: DataTypes.JSON,
      defaultValue: [],
      field: 'enlaces'
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
      // encriptar contraseña antes de crear usuario
      beforeCreate: async (usuario) => {
        if (usuario.contrasena) {
          const sal = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, sal);
        }
      },
      // encriptar contraseña antes de actualizar si cambió
      beforeUpdate: async (usuario) => {
        if (usuario.changed('contrasena')) {
          const sal = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, sal);
        }
      }
    }
  });

  // metodo para comparar contraseñas
  Usuario.prototype.compararContrasena = async function(contrasenaIngresada) {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
  };

  // metodo para obtener usuario sin contraseña
  Usuario.prototype.toJSON = function() {
    const valores = { ...this.get() };
    delete valores.contrasena;
    return valores;
  };

  return Usuario;
};