const db = require('../modelos');
const { validarPublicacion } = require('../utilidades/validadores');
const { normalizarEtiquetas } = require('../utilidades/validadores');
const { Op } = require('sequelize');

/**
 * obtener todas las publicaciones (feed global)
 * get /api/publicaciones
 */
exports.obtenerTodasPublicaciones = async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;
    const usuarioId = req.usuario?.id;

    const publicaciones = await db.Publicacion.findAndCountAll({
      where: { esBorrador: false },
      include: [
        {
          model: db.Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar']
        },
        {
          model: db.Etiqueta,
          as: 'etiquetas',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        },
        {
          model: db.MeGusta,
          as: 'meGustas',
          attributes: ['id', 'usuarioId']
        },
        {
          model: db.Comentario,
          as: 'comentarios',
          attributes: ['id']
        }
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']],
      distinct: true
    });

    const publicacionesFormateadas = publicaciones.rows.map(pub => {
      const leGusta = usuarioId ? pub.meGustas.some(mg => mg.usuarioId === usuarioId) : false;
      
      return {
        ...pub.toJSON(),
        totalMeGustas: pub.meGustas.length,
        totalComentarios: pub.comentarios.length,
        leGusta
      };
    });

    res.json({
      exito: true,
      datos: publicacionesFormateadas,
      total: publicaciones.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(publicaciones.count / limite)
    });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener publicaciones'
    });
  }
};

/**
 * obtener feed personalizado
 * get /api/publicaciones/feed
 */
exports.obtenerFeedPersonalizado = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;

    // obtener usuarios que sigue
    const seguimientos = await db.Seguidor.findAll({
      where: { seguidorId: usuarioId },
      attributes: ['seguidoId']
    });

    const idsUsuariosSeguidos = seguimientos.map(s => s.seguidoId);

    // incluir tambien las publicaciones propias
    idsUsuariosSeguidos.push(usuarioId);

    const publicaciones = await db.Publicacion.findAndCountAll({
      where: {
        esBorrador: false,
        usuarioId: { [Op.in]: idsUsuariosSeguidos }
      },
      include: [
        {
          model: db.Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar']
        },
        {
          model: db.Etiqueta,
          as: 'etiquetas',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        },
        {
          model: db.MeGusta,
          as: 'meGustas',
          attributes: ['id', 'usuarioId']
        },
        {
          model: db.Comentario,
          as: 'comentarios',
          attributes: ['id']
        }
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']],
      distinct: true
    });

    const publicacionesFormateadas = publicaciones.rows.map(pub => {
      const leGusta = pub.meGustas.some(mg => mg.usuarioId === usuarioId);
      
      return {
        ...pub.toJSON(),
        totalMeGustas: pub.meGustas.length,
        totalComentarios: pub.comentarios.length,
        leGusta
      };
    });

    res.json({
      exito: true,
      datos: publicacionesFormateadas,
      total: publicaciones.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(publicaciones.count / limite)
    });
  } catch (error) {
    console.error('Error al obtener feed personalizado:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener feed personalizado'
    });
  }
};

/**
 * obtener publicacion por id
 * get /api/publicaciones/:id
 */
exports.obtenerPublicacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?.id;

    const publicacion = await db.Publicacion.findByPk(id, {
      include: [
        {
          model: db.Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar', 'biografia']
        },
        {
          model: db.Etiqueta,
          as: 'etiquetas',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        },
        {
          model: db.MeGusta,
          as: 'meGustas',
          attributes: ['id', 'usuarioId']
        },
        {
          model: db.Comentario,
          as: 'comentarios',
          include: [
            {
              model: db.Usuario,
              as: 'usuario',
              attributes: ['id', 'nombreUsuario', 'avatar']
            }
          ],
          order: [['fechaCreacion', 'DESC']]
        }
      ]
    });

    if (!publicacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Publicación no encontrada'
      });
    }

    // verificar si es borrador y si el usuario tiene permiso
    if (publicacion.esBorrador && publicacion.usuarioId !== usuarioId) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permiso para ver este borrador'
      });
    }

    const leGusta = usuarioId ? publicacion.meGustas.some(mg => mg.usuarioId === usuarioId) : false;

    res.json({
      exito: true,
      datos: {
        ...publicacion.toJSON(),
        totalMeGustas: publicacion.meGustas.length,
        totalComentarios: publicacion.comentarios.length,
        leGusta
      }
    });
  } catch (error) {
    console.error('Error al obtener publicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener publicación'
    });
  }
};

/**
 * crear publicacion
 * post /api/publicaciones
 */
exports.crearPublicacion = async (req, res) => {
  try {
    const { titulo, contenido, etiquetas, esBorrador } = req.body;
    const usuarioId = req.usuario.id;

    // validar datos
    const validacion = validarPublicacion(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    // procesar imagenes subidas
    const imagenes = req.files?.map(file => `/uploads/${file.filename}`) || [];

    // crear publicacion
    const publicacion = await db.Publicacion.create({
      usuarioId,
      titulo,
      contenido,
      imagenes,
      esBorrador: esBorrador === 'true' || esBorrador === true
    });

    // procesar etiquetas
    if (etiquetas) {
      let etiquetasArray = [];
      
      // si es string json, parsearlo
      if (typeof etiquetas === 'string') {
        try {
          etiquetasArray = JSON.parse(etiquetas);
        } catch {
          etiquetasArray = etiquetas.split(',').map(e => e.trim());
        }
      } else if (Array.isArray(etiquetas)) {
        etiquetasArray = etiquetas;
      }

      // normalizar etiquetas
      const etiquetasNormalizadas = normalizarEtiquetas(etiquetasArray);

      for (const nombreEtiqueta of etiquetasNormalizadas) {
        const [etiqueta] = await db.Etiqueta.findOrCreate({
          where: { nombre: nombreEtiqueta.toLowerCase() }
        });
        await publicacion.addEtiqueta(etiqueta);
      }
    }

    // obtener publicacion completa
    const publicacionCompleta = await db.Publicacion.findByPk(publicacion.id, {
      include: [
        { model: db.Usuario, as: 'autor', attributes: ['id', 'nombreUsuario', 'avatar'] },
        { model: db.Etiqueta, as: 'etiquetas', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ]
    });

    res.status(201).json({
      exito: true,
      mensaje: esBorrador ? 'Borrador guardado' : 'Publicación creada',
      datos: publicacionCompleta
    });
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear publicación'
    });
  }
};

/**
 * actualizar publicacion
 * put /api/publicaciones/:id
 */
exports.actualizarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, etiquetas, esBorrador } = req.body;
    const usuarioId = req.usuario.id;
    
    const publicacion = await db.Publicacion.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Publicación no encontrada'
      });
    }

    // verificar que sea el autor
    if (publicacion.usuarioId !== usuarioId) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permiso para editar esta publicación'
      });
    }

    // validar datos
    const validacion = validarPublicacion(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    // procesar nuevas imagenes
    let imagenesActualizadas = publicacion.imagenes || [];
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = req.files.map(file => `/uploads/${file.filename}`);
      imagenesActualizadas = [...imagenesActualizadas, ...nuevasImagenes];
    }

    // actualizar publicacion
    await publicacion.update({
      titulo,
      contenido,
      imagenes: imagenesActualizadas,
      esBorrador: esBorrador === 'true' || esBorrador === true
    });

    // actualizar etiquetas
    if (etiquetas) {
      let etiquetasArray = [];
      
      if (typeof etiquetas === 'string') {
        try {
          etiquetasArray = JSON.parse(etiquetas);
        } catch {
          etiquetasArray = etiquetas.split(',').map(e => e.trim());
        }
      } else if (Array.isArray(etiquetas)) {
        etiquetasArray = etiquetas;
      }

      const etiquetasNormalizadas = normalizarEtiquetas(etiquetasArray);

      // eliminar etiquetas actuales
      await publicacion.setEtiquetas([]);

      // agregar nuevas etiquetas
      for (const nombreEtiqueta of etiquetasNormalizadas) {
        const [etiqueta] = await db.Etiqueta.findOrCreate({
          where: { nombre: nombreEtiqueta.toLowerCase() }
        });
        await publicacion.addEtiqueta(etiqueta);
      }
    }

    // obtener publicacion actualizada
    const publicacionActualizada = await db.Publicacion.findByPk(id, {
      include: [
        { model: db.Usuario, as: 'autor', attributes: ['id', 'nombreUsuario', 'avatar'] },
        { model: db.Etiqueta, as: 'etiquetas', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ]
    });

    res.json({
      exito: true,
      mensaje: 'Publicación actualizada exitosamente',
      datos: publicacionActualizada
    });

  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar publicación'
    });
  }
};