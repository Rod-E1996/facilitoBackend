const { createServiceRequest, listServiceRequests } = require('./service-request.service');

async function list(req, res, next) {
  try {
    const result = await listServiceRequests(req.query.customer_id);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      requests: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await createServiceRequest(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Service request creada correctamente.',
      request: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
};
