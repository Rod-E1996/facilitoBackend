const { loginUser, registerUser } = require('./auth.service');

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
      user: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(_req, res, next) {
  try {
    return res.status(200).json({
      ok: true,
      message: 'Sesion cerrada correctamente.',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
};
