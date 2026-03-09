require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./modelos'); 

const app = express();

// middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servir archivos estaticos (imagenes subidas)
// CORREGIDO: ahora apunta a ./uploads (dentro de backend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// rutas
app.use('/api/autenticacion', require('./rutas/autenticacion'));
app.use('/api/usuarios', require('./rutas/usuarios'));
app.use('/api/publicaciones', require('./rutas/publicaciones'));
app.use('/api/comentarios', require('./rutas/comentarios'));
app.use('/api/seguidores', require('./rutas/seguidores'));

// ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de NS - Red Social Blog',
    version: '1.0.0',
    endpoints: {
      autenticacion: '/api/autenticacion',
      usuarios: '/api/usuarios',
      publicaciones: '/api/publicaciones',
      comentarios: '/api/comentarios',
      seguidores: '/api/seguidores'
    }
  });
});

// manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada'
  });
});

// manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor'
  });
});

// puerto
const PORT = process.env.PORT || 5000;

// sincronizar base de datos e iniciar servidor
db.sincronizarBaseDatos({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Base de datos: ${db.sequelize.config.database}`);
      console.log(`API lista para recibir peticiones`);
    });
  })
  .catch(error => {
    console.error('Error al iniciar servidor:', error);
    process.exit(1);
  });

module.exports = app;