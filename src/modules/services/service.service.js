const mongoose = require('mongoose');
const Service = require('./service.model');
const Business = require('../business/business.model');

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
  createService,
};
