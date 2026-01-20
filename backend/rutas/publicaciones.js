const express = require('express');
const router = express.Router();
const publicacionControlador = require('../controladores/publicacionControlador');
const autenticacion = require('../middlewares/autenticacion');
const { autenticacionOpcional } = require('../middlewares/autenticacion');
const upload = require('../middlewares/subirArchivos');

// get /api/publicaciones/feed (feed personalizado - requiere autenticacion)
router.get('/feed', autenticacion, publicacionControlador.obtenerFeedPersonalizado);

// get /api/publicaciones/explorar (trending)
router.get('/explorar', publicacionControlador.obtenerTrending);

// get /api/publicaciones/buscar
router.get('/buscar', autenticacionOpcional, publicacionControlador.buscarPublicaciones);

// get /api/publicaciones (feed global)
router.get('/', autenticacionOpcional, publicacionControlador.obtenerTodasPublicaciones);

// get /api/publicaciones/:id
router.get('/:id', autenticacionOpcional, publicacionControlador.obtenerPublicacionPorId);

// post /api/publicaciones
router.post('/', autenticacion, upload.array('imagenes', 10), publicacionControlador.crearPublicacion);

// put /api/publicaciones/:id
router.put('/:id', autenticacion, upload.array('imagenes', 10), publicacionControlador.actualizarPublicacion);

// delete /api/publicaciones/:id
router.delete('/:id', autenticacion, publicacionControlador.eliminarPublicacion);

// post /api/publicaciones/:id/me-gusta
router.post('/:id/me-gusta', autenticacion, publicacionControlador.darMeGusta);

// post /api/publicaciones/:id/guardar
router.post('/:id/guardar', autenticacion, publicacionControlador.guardarPublicacion);

module.exports = router;