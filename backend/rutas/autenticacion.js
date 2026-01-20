const express = require('express');
const router = express.Router();
const autenticacionControlador = require('../controladores/autenticacionControlador');
const autenticacion = require('../middlewares/autenticacion');

// post /api/autenticacion/registro
router.post('/registro', autenticacionControlador.registro);

// post /api/autenticacion/login
router.post('/login', autenticacionControlador.login);

// get /api/autenticacion/yo
router.get('/yo', autenticacion, autenticacionControlador.obtenerUsuarioActual);

module.exports = router;