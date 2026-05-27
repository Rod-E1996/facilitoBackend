const {
  listDetailedServiceCatsByServiceId,
  listServiceCategories,
} = require('./service-category.service');

async function list(_req, res, next) {
  try {
    const result = await listServiceCategories();

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      categories: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function listDetailedByServiceId(req, res, next) {
  try {
    const result = await listDetailedServiceCatsByServiceId(req.query.service_id);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      detailedCategories: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listDetailedByServiceId,
  list,
};
