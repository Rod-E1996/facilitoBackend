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

module.exports = {
  listBusinesses,
  createBusiness,
};
