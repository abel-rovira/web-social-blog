const db = require('../modelos');
const { validarActualizacionPerfil, validarCambioContrasena } = require('../utilidades/validadores');

/**
 * obtener perfil de usuario por nombre de usuario
 * get /api/usuarios/:nombreUsuario
 */
exports.obtenerPerfil = async (req, res) => {
  try {
    const { nombreUsuario } = req.params;
    const usuarioActualId = req.usuario?.id;

    const usuario = await db.Usuario.findOne({
      where: { nombreUsuario },
      attributes: { exclude: ['contrasena'] },
      include: [
        {
          model: db.Seguidor,
          as: 'seguidoresRelaciones',
          attributes: ['seguidorId']
        },
        {
          model: db.Seguidor,
          as: 'siguiendoRelaciones',
          attributes: ['seguidoId']
        },
        {
          model: db.Publicacion,
          as: 'publicaciones',
          where: { esBorrador: false },
          required: false,
          attributes: ['id', 'titulo', 'imagenes', 'fechaCreacion'],
          limit: 9,
          order: [['fechaCreacion', 'DESC']]
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // verificar si el usuario actual sigue a este perfil
    let sigueAlUsuario = false;
    if (usuarioActualId) {
      const seguimiento = await db.Seguidor.findOne({
        where: {
          seguidorId: usuarioActualId,
          seguidoId: usuario.id
        }
      });
      sigueAlUsuario = !!seguimiento;
    }

    res.json({
      exito: true,
      datos: {
        ...usuario.toJSON(),
        totalSeguidores: usuario.seguidoresRelaciones?.length || 0,
        totalSiguiendo: usuario.siguiendoRelaciones?.length || 0,
        totalPublicaciones: usuario.publicaciones?.length || 0,
        sigueAlUsuario,
        esPerfilPropio: usuarioActualId === usuario.id
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener perfil de usuario'
    });
  }
};

/**
 * actualizar perfil de usuario
 * put /api/usuarios/perfil
 */
exports.actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nombreUsuario, biografia, enlaces, correo } = req.body;

    // validar datos
    const validacion = validarActualizacionPerfil(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    // verificar si el nuevo nombre de usuario ya existe
    if (nombreUsuario) {
      const usuarioExistente = await db.Usuario.findOne({
        where: {
          nombreUsuario,
          id: { [db.Sequelize.Op.ne]: usuarioId }
        }
      });

      if (usuarioExistente) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Este nombre de usuario ya está en uso'
        });
      }
    }

    // verificar si el nuevo correo ya existe
    if (correo) {
      const correoExistente = await db.Usuario.findOne({
        where: {
          correo,
          id: { [db.Sequelize.Op.ne]: usuarioId }
        }
      });

      if (correoExistente) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Este correo electrónico ya está en uso'
        });
      }
    }

    // actualizar usuario
    const datosActualizacion = {};
    if (nombreUsuario) datosActualizacion.nombreUsuario = nombreUsuario;
    if (biografia !== undefined) datosActualizacion.biografia = biografia;
    if (enlaces) datosActualizacion.enlaces = enlaces;
    if (correo) datosActualizacion.correo = correo;

    // si hay avatar en el archivo subido
    if (req.file) {
      datosActualizacion.avatar = `/uploads/${req.file.filename}`;
    }

    await db.Usuario.update(datosActualizacion, {
      where: { id: usuarioId }
    });

    // obtener usuario actualizado
    const usuarioActualizado = await db.Usuario.findByPk(usuarioId, {
      attributes: { exclude: ['contrasena'] }
    });

    res.json({
      exito: true,
      mensaje: 'Perfil actualizado exitosamente',
      datos: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar perfil'
    });
  }
};

/**
 * cambiar contrasena
 * put /api/usuarios/cambiar-contrasena
 */
exports.cambiarContrasena = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { contrasenaActual, nuevaContrasena } = req.body;

    // validar datos
    const validacion = validarCambioContrasena(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    // obtener usuario con contrasena
    const usuario = await db.Usuario.findByPk(usuarioId);

    // verificar contrasena actual
    const contrasenaValida = await usuario.compararContrasena(contrasenaActual);
    if (!contrasenaValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'La contraseña actual es incorrecta'
      });
    }

    // actualizar contrasena
    usuario.contrasena = nuevaContrasena;
    await usuario.save();

    res.json({
      exito: true,
      mensaje: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cambiar contraseña'
    });
  }
};

/**
 * buscar usuarios
 * get /api/usuarios/buscar?termino=...
 */
exports.buscarUsuarios = async (req, res) => {
  try {
    const { termino, pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;

    if (!termino || termino.trim() === '') {
      return res.status(400).json({
        exito: false,
        mensaje: 'Debe proporcionar un término de búsqueda'
      });
    }

    const usuarios = await db.Usuario.findAndCountAll({
      where: {
        [db.Sequelize.Op.or]: [
          { nombreUsuario: { [db.Sequelize.Op.like]: `%${termino}%` } },
          { biografia: { [db.Sequelize.Op.like]: `%${termino}%` } }
        ]
      },
      attributes: ['id', 'nombreUsuario', 'avatar', 'biografia'],
      limit: parseInt(limite),
      offset: parseInt(offset)
    });

    res.json({
      exito: true,
      datos: usuarios.rows,
      total: usuarios.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(usuarios.count / limite)
    });
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al buscar usuarios'
    });
  }
};