const { Sequelize } = require('sequelize');
const configuracion = require('../configuracion/baseDatos');

// crear instancia de Sequelize
const sequelize = new Sequelize(
  configuracion.base_datos,
  configuracion.usuario,
  configuracion.contrasena,
  {
    host: configuracion.host,
    dialect: 'mysql',
    logging: false, // cambiar a console.log para ver queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+01:00' // ajustar segun zona horaria
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ===============================
// IMPORTAR MODELOS
// ===============================

db.Usuario = require('./Usuario')(sequelize);
db.Publicacion = require('./Publicacion')(sequelize);
db.Comentario = require('./Comentario')(sequelize);
db.MeGusta = require('./MeGusta')(sequelize);
db.Seguidor = require('./Seguidor')(sequelize);
db.Etiqueta = require('./Etiqueta')(sequelize);
db.PublicacionGuardada = require('./PublicacionGuardada')(sequelize);

// ===============================
// DEFINIR RELACIONES
// ===============================

// ---------------------
// USUARIO -> PUBLICACIONES
// ---------------------
db.Usuario.hasMany(db.Publicacion, {
  foreignKey: 'usuarioId',
  as: 'publicaciones',
  onDelete: 'CASCADE'
});

db.Publicacion.belongsTo(db.Usuario, {
  foreignKey: 'usuarioId',
  as: 'autor'
});

// ---------------------
// USUARIO -> COMENTARIOS
// ---------------------
db.Usuario.hasMany(db.Comentario, {
  foreignKey: 'usuarioId',
  as: 'comentarios',
  onDelete: 'CASCADE'
});

db.Comentario.belongsTo(db.Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// ---------------------
// PUBLICACION -> COMENTARIOS
// ---------------------
db.Publicacion.hasMany(db.Comentario, {
  foreignKey: 'publicacionId',
  as: 'comentarios',
  onDelete: 'CASCADE'
});

db.Comentario.belongsTo(db.Publicacion, {
  foreignKey: 'publicacionId',
  as: 'publicacion'
});

// ---------------------
// PUBLICACION -> ME GUSTA
// ---------------------
db.Publicacion.hasMany(db.MeGusta, {
  foreignKey: 'publicacionId',
  as: 'meGustas',
  onDelete: 'CASCADE'
});

db.MeGusta.belongsTo(db.Publicacion, {
  foreignKey: 'publicacionId',
  as: 'publicacion'
});

// ---------------------
// USUARIO -> ME GUSTA
// ---------------------
db.Usuario.hasMany(db.MeGusta, {
  foreignKey: 'usuarioId',
  as: 'meGustas',
  onDelete: 'CASCADE'
});

db.MeGusta.belongsTo(db.Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// ---------------------
// SEGUIDORES (Relación muchos a muchos consigo mismo)
// ---------------------
db.Usuario.belongsToMany(db.Usuario, {
  through: db.Seguidor,
  as: 'seguidos',
  foreignKey: 'seguidorId',
  otherKey: 'seguidoId'
});

db.Usuario.belongsToMany(db.Usuario, {
  through: db.Seguidor,
  as: 'seguidores',
  foreignKey: 'seguidoId',
  otherKey: 'seguidorId'
});

// Relaciones directas para consultas más fáciles
db.Usuario.hasMany(db.Seguidor, {
  foreignKey: 'seguidorId',
  as: 'siguiendoRelaciones'
});

db.Usuario.hasMany(db.Seguidor, {
  foreignKey: 'seguidoId',
  as: 'seguidoresRelaciones'
});

// ---------------------
// PUBLICACIONES -> ETIQUETAS (Muchos a muchos)
// ---------------------
db.Publicacion.belongsToMany(db.Etiqueta, {
  through: 'publicaciones_etiquetas',
  foreignKey: 'publicacion_id',
  otherKey: 'etiqueta_id',
  as: 'etiquetas'
});

db.Etiqueta.belongsToMany(db.Publicacion, {
  through: 'publicaciones_etiquetas',
  foreignKey: 'etiqueta_id',
  otherKey: 'publicacion_id',
  as: 'publicaciones'
});

// ---------------------
// PUBLICACIONES GUARDADAS
// ---------------------
db.Usuario.hasMany(db.PublicacionGuardada, {
  foreignKey: 'usuarioId',
  as: 'publicacionesGuardadas',
  onDelete: 'CASCADE'
});

db.PublicacionGuardada.belongsTo(db.Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

db.Publicacion.hasMany(db.PublicacionGuardada, {
  foreignKey: 'publicacionId',
  as: 'guardadoPor',
  onDelete: 'CASCADE'
});

db.PublicacionGuardada.belongsTo(db.Publicacion, {
  foreignKey: 'publicacionId',
  as: 'publicacion'
});

// ===============================
// FUNCION PARA SINCRONIZAR BASE DE DATOS
// ===============================

db.sincronizarBaseDatos = async (opciones = {}) => {
  try {
    // Probar conexión
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente');

    // Sincronizar modelos
    // ADVERTENCIA: { force: true } eliminará todas las tablas y las recreará
    // Usar { alter: true } para modificar tablas existentes
    await sequelize.sync(opciones);
    
    if (opciones.force) {
      console.log('Base de datos reseteada y sincronizada');
    } else if (opciones.alter) {
      console.log('Base de datos actualizada y sincronizada');
    } else {
      console.log('Base de datos sincronizada');
    }

  } catch (error) {
    console.error('Error al sincronizar base de datos:', error);
    throw error;
  }
};

module.exports = db;