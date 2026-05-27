const mongoose = require('mongoose');
const ServiceRequest = require('./service-request.model');
const User = require('../users/user.model');
const Service = require('../services/service.model');

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

async function createServiceRequest(payload) {
  const requiredFields = ['customer_id', 'service_id', 'service_request_description'];
  const missingFields = requiredFields.filter(
    (field) => payload[field] === undefined || payload[field] === null || payload[field] === ''
  );

  if (missingFields.length) {
    return {
      ok: false,
      status: 400,
      error: `Campos requeridos faltantes: ${missingFields.join(', ')}`,
    };
  }

  if (!mongoose.Types.ObjectId.isValid(payload.customer_id)) {
    return {
      ok: false,
      status: 400,
      error: 'El customer_id no es un ObjectId válido.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(payload.service_id)) {
    return {
      ok: false,
      status: 400,
      error: 'El service_id no es un ObjectId válido.',
    };
  }

  const [customer, service] = await Promise.all([
    User.findById(payload.customer_id).lean(),
    Service.findById(payload.service_id).lean(),
  ]);

  if (!customer) {
    return {
      ok: false,
      status: 404,
      error: 'Usuario customer no encontrado.',
    };
  }

  if (!service) {
    return {
      ok: false,
      status: 404,
      error: 'Servicio no encontrado.',
    };
  }

  const requestDate = payload.service_request_date
    ? new Date(payload.service_request_date)
    : new Date();

  if (Number.isNaN(requestDate.getTime())) {
    return {
      ok: false,
      status: 400,
      error: 'El service_request_date no tiene un formato de fecha válido.',
    };
  }

  const request = await ServiceRequest.create({
    customer_id: payload.customer_id,
    service_id: payload.service_id,
    service_request_description: String(payload.service_request_description).trim(),
    service_request_date: requestDate,
  });

  const populatedRequest = await ServiceRequest.findById(request._id)
    .populate({ path: 'customer_id', select: '-password' })
    .populate({ path: 'service_id' });

  return {
    ok: true,
    status: 201,
    data: populatedRequest,
  };
}

module.exports = {
  createServiceRequest,
  listServiceRequests,
};
