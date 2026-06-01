const User = require('../users/user.model');
const { hashPassword, verifyPassword } = require('../../shared/security/password');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  decodeToken,
} = require('../../shared/security/jwt');
const RefreshToken = require('./refresh-token.model');
const crypto = require('node:crypto');

function sanitizeUser(userDoc) {
  const user = userDoc.toObject();
  delete user.password;
  return user;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createSessionTokens(user) {
  const tokenId = crypto.randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, tokenId);
  const decodedRefreshToken = decodeToken(refreshToken);

  await RefreshToken.create({
    user_id: user._id,
    token_hash: hashToken(refreshToken),
    expires_at: new Date(decodedRefreshToken.exp * 1000),
  });

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
  };
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
    address:
      Object.prototype.hasOwnProperty.call(payload, 'address') && payload.address !== null
        ? String(payload.address).trim()
        : payload.address,
    profile_img_url:
      Object.prototype.hasOwnProperty.call(payload, 'profile_img_url') &&
      payload.profile_img_url !== null
        ? String(payload.profile_img_url).trim()
        : payload.profile_img_url,
    dui: payload.dui.trim(),
    password: hashPassword(payload.password),
  });

  const sanitizedUser = sanitizeUser(user);
  const sessionTokens = await createSessionTokens(user);

  return {
    ok: true,
    status: 201,
    data: {
      user: sanitizedUser,
      ...sessionTokens,
    },
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

  const sanitizedUser = sanitizeUser(user);
  const sessionTokens = await createSessionTokens(user);

  return {
    ok: true,
    status: 200,
    data: {
      user: sanitizedUser,
      ...sessionTokens,
    },
  };
}

async function refreshSession(payload) {
  if (!payload.refreshToken) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar refreshToken.',
    };
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(payload.refreshToken);
  } catch (_error) {
    return {
      ok: false,
      status: 401,
      error: 'Refresh token inválido o expirado.',
    };
  }

  const tokenHash = hashToken(payload.refreshToken);
  const storedToken = await RefreshToken.findOne({ token_hash: tokenHash });

  if (!storedToken || storedToken.revoked_at || storedToken.expires_at <= new Date()) {
    return {
      ok: false,
      status: 401,
      error: 'Refresh token inválido o revocado.',
    };
  }

  if (String(storedToken.user_id) !== String(decoded.sub)) {
    return {
      ok: false,
      status: 401,
      error: 'Refresh token inválido para este usuario.',
    };
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    return {
      ok: false,
      status: 401,
      error: 'Usuario no válido para renovar sesión.',
    };
  }

  storedToken.revoked_at = new Date();
  await storedToken.save();

  const sessionTokens = await createSessionTokens(user);

  return {
    ok: true,
    status: 200,
    data: sessionTokens,
  };
}

async function logoutSession(payload) {
  if (!payload.refreshToken) {
    return {
      ok: true,
      status: 200,
      data: null,
    };
  }

  const tokenHash = hashToken(payload.refreshToken);
  await RefreshToken.updateOne(
    { token_hash: tokenHash, revoked_at: null },
    { $set: { revoked_at: new Date() } }
  );

  return {
    ok: true,
    status: 200,
    data: null,
  };
}

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutSession,
};
