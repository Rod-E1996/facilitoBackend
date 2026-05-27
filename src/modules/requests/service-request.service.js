const mongoose = require('mongoose');
const ServiceRequest = require('./service-request.model');

async function listServiceRequests(customerId) {
  if (!customerId) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar el query param customer_id.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return {
      ok: false,
      status: 400,
      error: 'El customer_id no es un ObjectId válido.',
    };
  }

  const requests = await ServiceRequest.find({ customer_id: customerId })
    .populate({ path: 'customer_id', select: '-password' })
    .populate({
      path: 'service_id',
      populate: {
        path: 'business_id',
        populate: { path: 'user_id', select: '-password' },
      },
    })
    .sort({ service_request_date: -1 });

  return {
    ok: true,
    status: 200,
    data: requests,
  };
}

module.exports = {
  listServiceRequests,
};
