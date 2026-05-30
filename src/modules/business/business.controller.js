const { createBusiness, listBusinesses, updateBusiness } = require('./business.service');

async function list(req, res, next) {
  try {
    const result = await listBusinesses(req.query.user_id);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      businesses: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await createBusiness(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Business creado correctamente.',
      business: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await updateBusiness(req.params.business_id, req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Business actualizado correctamente.',
      business: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  update,
};
