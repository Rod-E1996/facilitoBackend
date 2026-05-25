const { createReview } = require('./review.service');

async function create(req, res, next) {
  try {
    const result = await createReview(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Review creada correctamente.',
      review: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
};
