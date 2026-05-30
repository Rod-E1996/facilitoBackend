const mongoose = require('mongoose');
const Business = require('./business.model');
const User = require('../users/user.model');

async function listBusinesses(userId) {
  if (!userId) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar el query param user_id.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      ok: false,
      status: 400,
      error: 'El user_id no es un ObjectId válido.',
    };
  }

  const businesses = await Business.find({ user_id: userId })
    .populate({
      path: 'user_id',
      select: '-password',
      populate: { path: 'user_role_id' },
    })
    .sort({ _id: -1 });

  return {
    ok: true,
    status: 200,
    data: businesses,
  };
}

async function createBusiness(payload) {
  const requiredFields = ['business_name', 'business_description', 'business_pic_src', 'user_id'];
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

  if (!mongoose.Types.ObjectId.isValid(payload.user_id)) {
    return {
      ok: false,
      status: 400,
      error: 'El user_id no es un ObjectId válido.',
    };
  }

  const user = await User.findById(payload.user_id);
  if (!user) {
    return {
      ok: false,
      status: 404,
      error: 'Usuario no encontrado.',
    };
  }

  const business = await Business.create({
    business_name: String(payload.business_name).trim(),
    business_description: String(payload.business_description).trim(),
    business_pic_src: String(payload.business_pic_src).trim(),
    user_id: payload.user_id,
  });

  return {
    ok: true,
    status: 201,
    data: business,
  };
}

async function updateBusiness(businessId, payload) {
  if (!businessId) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar el business_id en la URL.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return {
      ok: false,
      status: 400,
      error: 'El business_id no es un ObjectId válido.',
    };
  }

  const allowedFields = ['business_name', 'business_description', 'business_pic_src', 'user_id'];
  const incomingFields = Object.keys(payload || {});

  if (!incomingFields.length) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar al menos un campo para actualizar.',
    };
  }

  const invalidFields = incomingFields.filter((field) => !allowedFields.includes(field));
  if (invalidFields.length) {
    return {
      ok: false,
      status: 400,
      error: `Campos no permitidos para actualización: ${invalidFields.join(', ')}`,
    };
  }

  const updateData = {};

  if (Object.prototype.hasOwnProperty.call(payload, 'business_name')) {
    updateData.business_name = String(payload.business_name).trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'business_description')) {
    updateData.business_description = String(payload.business_description).trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'business_pic_src')) {
    updateData.business_pic_src = String(payload.business_pic_src).trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'user_id')) {
    if (!mongoose.Types.ObjectId.isValid(payload.user_id)) {
      return {
        ok: false,
        status: 400,
        error: 'El user_id no es un ObjectId válido.',
      };
    }

    const user = await User.findById(payload.user_id);
    if (!user) {
      return {
        ok: false,
        status: 404,
        error: 'Usuario no encontrado.',
      };
    }

    updateData.user_id = payload.user_id;
  }

  const business = await Business.findByIdAndUpdate(businessId, updateData, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!business) {
    return {
      ok: false,
      status: 404,
      error: 'Business no encontrado.',
    };
  }

  return {
    ok: true,
    status: 200,
    data: business,
  };
}

module.exports = {
  listBusinesses,
  createBusiness,
  updateBusiness,
};
