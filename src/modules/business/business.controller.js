const { listBusinesses } = require('./business.service');

async function list(_req, res, next) {
  try {
    const result = await listBusinesses();

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

module.exports = {
  list,
};
