const mongoose = require('mongoose');
const Service = require('./service.model');
const Business = require('../business/business.model');

async function listServices(userId) {
  const query = {};

  if (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        ok: false,
        status: 400,
        error: 'El userid no es un ObjectId válido.',
      };
    }

    const businesses = await Business.find({ user_id: userId }).select('_id');
    query.business_id = { $in: businesses.map((business) => business._id) };
  }

  const services = await Service.find(query)
    .populate({
      path: 'business_id',
      populate: {
        path: 'user_id',
        select: '-password',
      },
    })
    .sort({ _id: -1 });

  return {
    ok: true,
    status: 200,
    data: services,
  };
}

async function createService(payload) {
  const requiredFields = ['service_name', 'service_description', 'business_id'];
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

  if (!mongoose.Types.ObjectId.isValid(payload.business_id)) {
    return {
      ok: false,
      status: 400,
      error: 'El business_id no es un ObjectId válido.',
    };
  }

  const business = await Business.findById(payload.business_id);

  if (!business) {
    return {
      ok: false,
      status: 404,
      error: 'Negocio no encontrado.',
    };
  }

  const service = await Service.create({
    service_name: String(payload.service_name).trim(),
    service_description: String(payload.service_description).trim(),
    business_id: payload.business_id,
  });

  return {
    ok: true,
    status: 201,
    data: service,
  };
}

module.exports = {
  listServices,
  createService,
};
