const mongoose = require('mongoose');
const Review = require('./review.model');

async function listReviewsByBusinessId(businessId) {
  if (!businessId) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar el query param business_id.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return {
      ok: false,
      status: 400,
      error: 'El business_id no es un ObjectId válido.',
    };
  }

  const reviews = await Review.find({ business_id: businessId })
    .populate({ path: 'reviewer_id', select: '-password' })
    .populate({ path: 'service_request_id' })
    .populate({ path: 'business_id' })
    .sort({ review_date: -1 });

  return {
    ok: true,
    status: 200,
    data: reviews,
  };
}

async function createReview(payload) {
  const requiredFields = [
    'service_request_id',
    'reviewer_id',
    'business_id',
    'review_comment',
    'rating',
  ];

  const missingFields = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === '');
  if (missingFields.length) {
    return {
      ok: false,
      status: 400,
      error: `Campos requeridos faltantes: ${missingFields.join(', ')}`,
    };
  }

  const objectIdFields = ['service_request_id', 'reviewer_id', 'business_id'];
  const invalidIdField = objectIdFields.find((field) => !mongoose.Types.ObjectId.isValid(payload[field]));

  if (invalidIdField) {
    return {
      ok: false,
      status: 400,
      error: `El campo ${invalidIdField} no es un ObjectId válido.`,
    };
  }

  const numericRating = Number(payload.rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return {
      ok: false,
      status: 400,
      error: 'El rating debe ser un numero entero entre 1 y 5.',
    };
  }

  let reviewDate = new Date();
  if (payload.review_date) {
    reviewDate = new Date(payload.review_date);

    if (Number.isNaN(reviewDate.getTime())) {
      return {
        ok: false,
        status: 400,
        error: 'El review_date no tiene un formato de fecha válido.',
      };
    }
  }

  const review = await Review.create({
    service_request_id: payload.service_request_id,
    reviewer_id: payload.reviewer_id,
    business_id: payload.business_id,
    review_comment: String(payload.review_comment).trim(),
    rating: numericRating,
    review_date: reviewDate,
  });

  return {
    ok: true,
    status: 201,
    data: review,
  };
}

module.exports = {
  createReview,
  listReviewsByBusinessId,
};
