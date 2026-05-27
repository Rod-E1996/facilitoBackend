const mongoose = require('mongoose');
const ServiceCategory = require('./service-category.model');
const DetailedServiceCat = require('./detailed-service-cat.model');

async function listServiceCategories() {
  const categories = await ServiceCategory.find({}).sort({ service_category_name: 1 });

  return {
    ok: true,
    status: 200,
    data: categories,
  };
}

async function listDetailedServiceCatsByServiceId(serviceId) {
  if (!serviceId) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar el query param service_id.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    return {
      ok: false,
      status: 400,
      error: 'El service_id no es un ObjectId válido.',
    };
  }

  const detailedCategories = await DetailedServiceCat.find({ service_id: serviceId })
    .populate({ path: 'service_id' })
    .populate({ path: 'service_category_id' })
    .sort({ _id: -1 });

  return {
    ok: true,
    status: 200,
    data: detailedCategories,
  };
}

module.exports = {
  listDetailedServiceCatsByServiceId,
  listServiceCategories,
};
