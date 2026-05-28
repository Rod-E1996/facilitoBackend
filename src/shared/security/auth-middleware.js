const { verifyAccessToken } = require('./jwt');

function getBearerToken(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') return null;

  const [scheme, token] = authHeader.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'No autorizado. Debes enviar un token Bearer válido.',
      });
    }

    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      roleId: decoded.roleId,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado.',
    });
  }
}

module.exports = {
  requireAuth,
  getBearerToken,
};
