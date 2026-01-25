const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configurar conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Importar modelos
const Usuario = require('./Usuario')(sequelize);
const Publicacion = require('./Publicacion')(sequelize);
const Comentario = require('./Comentario')(sequelize);
const Seguidor = require('./Seguidor')(sequelize);
const MeGusta = require('./MeGusta')(sequelize);
const Guardado = require('./Guardado')(sequelize);

// Relaciones entre modelos

// Usuario - Publicacion (1:N)
Usuario.hasMany(Publicacion, {
  foreignKey: 'usuarioId',
  as: 'publicaciones',
  onDelete: 'CASCADE'
});
Publicacion.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// Publicacion - Comentario (1:N)
Publicacion.hasMany(Comentario, {
  foreignKey: 'publicacionId',
  as: 'comentarios',
  onDelete: 'CASCADE'
});
Comentario.belongsTo(Publicacion, {
  foreignKey: 'publicacionId',
  as: 'publicacion'
});

// Usuario - Comentario (1:N)
Usuario.hasMany(Comentario, {
  foreignKey: 'usuarioId',
  as: 'comentarios',
  onDelete: 'CASCADE'
});
Comentario.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// Seguidores (N:M auto-referencial)
Usuario.belongsToMany(Usuario, {
  through: Seguidor,
  as: 'seguidores',
  foreignKey: 'siguiendoId',
  otherKey: 'seguidorId'
});

Usuario.belongsToMany(Usuario, {
  through: Seguidor,
  as: 'siguiendo',
  foreignKey: 'seguidorId',
  otherKey: 'siguiendoId'
});

// Me gusta (N:M)
Usuario.belongsToMany(Publicacion, {
  through: MeGusta,
  as: 'publicacionesGustadas',
  foreignKey: 'usuarioId',
  otherKey: 'publicacionId'
});

Publicacion.belongsToMany(Usuario, {
  through: MeGusta,
  as: 'usuariosQueLesGusta',
  foreignKey: 'publicacionId',
  otherKey: 'usuarioId'
});

// Guardados (N:M)
Usuario.belongsToMany(Publicacion, {
  through: Guardado,
  as: 'publicacionesGuardadas',
  foreignKey: 'usuarioId',
  otherKey: 'publicacionId'
});

Publicacion.belongsToMany(Usuario, {
  through: Guardado,
  as: 'usuariosQueGuardaron',
  foreignKey: 'publicacionId',
  otherKey: 'usuarioId'
});

// Función para sincronizar base de datos
const sincronizarBaseDatos = async (opciones = {}) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida correctamente');
    
    await sequelize.sync(opciones);
    console.log('Modelos sincronizados con la base de datos');
    
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Usuario,
  Publicacion,
  Comentario,
  Seguidor,
  MeGusta,
  Guardado,
  sincronizarBaseDatos
};