const User = require('../users/user.model');
const { hashPassword, verifyPassword } = require('../../shared/security/password');

function sanitizeUser(userDoc) {
  const user = userDoc.toObject();
  delete user.password;
  return user;
}

async function registerUser(payload) {
  const requiredFields = [
    'name',
    'last_name',
    'telephone',
    'dui',
    'email',
    'password',
    'user_role_id',
  ];

  const missingFields = requiredFields.filter((field) => !payload[field]);
  if (missingFields.length) {
    return {
      ok: false,
      status: 400,
      error: `Campos requeridos faltantes: ${missingFields.join(', ')}`,
    };
  }

  const existingUser = await User.findOne({
    $or: [{ email: payload.email.toLowerCase().trim() }, { dui: payload.dui.trim() }],
  });

  if (existingUser) {
    return {
      ok: false,
      status: 409,
      error: 'Ya existe un usuario con ese correo o DUI.',
    };
  }

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase().trim(),
    dui: payload.dui.trim(),
    password: hashPassword(payload.password),
  });

  return {
    ok: true,
    status: 201,
    data: sanitizeUser(user),
  };
}

async function loginUser(payload) {
  if (!payload.email || !payload.password) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar email y password.',
    };
  }

  const user = await User.findOne({ email: payload.email.toLowerCase().trim() });

  if (!user || !verifyPassword(payload.password, user.password)) {
    return {
      ok: false,
      status: 401,
      error: 'Credenciales inválidas.',
    };
  }

  return {
    ok: true,
    status: 200,
    data: sanitizeUser(user),
  };
}

module.exports = {
  registerUser,
  loginUser,
};
