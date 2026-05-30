const { createService, listServices } = require('./service.service');

async function list(req, res, next) {
  try {
    const result = await listServices();

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      services: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await createService(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Servicio creado correctamente.',
      service: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
};
