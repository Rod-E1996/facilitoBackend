const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = require('../../config/env');

function signAccessToken(user) {
  const payload = {
    sub: String(user._id || user.id),
    email: user.email,
    roleId: user.user_role_id ? String(user.user_role_id) : null,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function signRefreshToken(user, tokenId) {
  const payload = {
    sub: String(user._id || user.id),
    tid: tokenId,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  decodeToken,
};
