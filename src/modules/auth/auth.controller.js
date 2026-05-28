const { loginUser, logoutSession, refreshSession, registerUser } = require('./auth.service');

async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Usuario registrado correctamente.',
      user: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Inicio de sesión correcto.',
      user: result.data.user,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      tokenType: result.data.tokenType,
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const result = await logoutSession(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(200).json({
      ok: true,
      message: 'Sesion cerrada correctamente.',
    });
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const result = await refreshSession(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      message: 'Sesion renovada correctamente.',
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      tokenType: result.data.tokenType,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
};
