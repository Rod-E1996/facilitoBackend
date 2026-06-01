const {
  getUserById,
  getUserRoleCatalog,
  updateUserById,
  updateUserPasswordById,
} = require('./user.service');

async function getRoleCatalog(_req, res, next) {
  try {
    const result = await getUserRoleCatalog();

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      roles: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const result = await getUserById(req.params.id);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      user: {
        ...result.data,
        profile_img_url:
          Object.prototype.hasOwnProperty.call(result.data, 'profile_img_url') &&
          result.data.profile_img_url !== undefined
            ? result.data.profile_img_url
            : null,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function patchById(req, res, next) {
  try {
    const result = await updateUserById(req.params.id, req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Usuario actualizado correctamente.',
      user: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function patchPasswordById(req, res, next) {
  try {
    const result = await updateUserPasswordById(req.params.id, req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Contrasena actualizada correctamente.',
      user: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRoleCatalog,
  getById,
  patchById,
  patchPasswordById,
};
