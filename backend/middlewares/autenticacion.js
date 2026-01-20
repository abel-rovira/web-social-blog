const jwt = require('jsonwebtoken');
const configuracionJWT = require('../configuracion/jwt');
const db = require('../modelos');

/**
 * middleware de autenticacion jwt
 */
const autenticacion = async (req, res, next) => {
  try {
    // obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Acceso denegado. No se proporcionó token de autenticación'
      });
    }

    // verificar token
    const decodificado = jwt.verify(token, configuracionJWT.secreto);

    // buscar usuario
    const usuario = await db.Usuario.findByPk(decodificado.id, {
      attributes: { exclude: ['contrasena'] }
    });

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido. Usuario no encontrado'
      });
    }

    // agregar usuario a la peticion
    req.usuario = usuario;
    req.token = token;

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token expirado. Por favor, inicia sesión nuevamente'
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: 'Error en la autenticación'
    });
  }
};

/**
 * middleware opcional de autenticacion (no bloquea si no hay token)
 */
const autenticacionOpcional = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decodificado = jwt.verify(token, configuracionJWT.secreto);
      const usuario = await db.Usuario.findByPk(decodificado.id, {
        attributes: { exclude: ['contrasena'] }
      });

      if (usuario) {
        req.usuario = usuario;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // si hay error, simplemente continua sin usuario
    next();
  }
};

module.exports = autenticacion;
module.exports.autenticacionOpcional = autenticacionOpcional;