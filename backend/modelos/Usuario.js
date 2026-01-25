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
      unique: true,
      validate: {
        len: [3, 50],
        isAlphanumeric: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombreCompleto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '/uploads/avatars/default.png'
    },
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.contrasena) {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('contrasena')) {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }
      }
    }
  });

  // Método para comparar contraseñas
  Usuario.prototype.compararContrasena = async function(contrasenaIngresada) {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
  };

  return Usuario;
};