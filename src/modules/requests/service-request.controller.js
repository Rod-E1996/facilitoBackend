const { listServiceRequests } = require('./service-request.service');

async function list(_req, res, next) {
  try {
    const result = await listServiceRequests();

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

module.exports = {
  list,
};
