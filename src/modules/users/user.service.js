const mongoose = require('mongoose');
const User = require('./user.model');
const UserRole = require('./user-role.model');
const { hashPassword, verifyPassword } = require('../../shared/security/password');

function sanitizeUser(userDoc) {
  const user = userDoc.toObject();
  delete user.password;
  return user;
}

async function getUserById(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      ok: false,
      status: 400,
      error: 'El id de usuario no es válido.',
    };
  }

  const user = await User.findById(userId);

  if (!user) {
    return {
      ok: false,
      status: 404,
      error: 'Usuario no encontrado.',
    };
  }

  return {
    ok: true,
    status: 200,
    data: sanitizeUser(user),
  };
}

async function updateUserById(userId, payload) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      ok: false,
      status: 400,
      error: 'El id de usuario no es válido.',
    };
  }

  const allowedFields = ['name', 'last_name', 'telephone', 'address', 'profile_img_url', 'dui', 'email'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      updates[field] = payload[field];
    }
  });

  if (!Object.keys(updates).length) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar al menos un campo válido para actualizar.',
    };
  }

  if (updates.email) {
    updates.email = updates.email.toLowerCase().trim();
  }

  if (updates.dui) {
    updates.dui = updates.dui.trim();
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'address') && updates.address !== null) {
    updates.address = String(updates.address).trim();
  }

  if (
    Object.prototype.hasOwnProperty.call(updates, 'profile_img_url') &&
    updates.profile_img_url !== null
  ) {
    updates.profile_img_url = String(updates.profile_img_url).trim();
  }

  const user = await User.findById(userId);

  if (!user) {
    return {
      ok: false,
      status: 404,
      error: 'Usuario no encontrado.',
    };
  }

  if (updates.email) {
    const existingByEmail = await User.findOne({
      email: updates.email,
      _id: { $ne: userId },
    });

    if (existingByEmail) {
      return {
        ok: false,
        status: 409,
        error: 'El correo ya está en uso por otro usuario.',
      };
    }
  }

  if (updates.dui) {
    const existingByDui = await User.findOne({
      dui: updates.dui,
      _id: { $ne: userId },
    });

    if (existingByDui) {
      return {
        ok: false,
        status: 409,
        error: 'El DUI ya está en uso por otro usuario.',
      };
    }
  }

  Object.assign(user, updates);
  await user.save();

  return {
    ok: true,
    status: 200,
    data: sanitizeUser(user),
  };
}

async function updateUserPasswordById(userId, payload) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      ok: false,
      status: 400,
      error: 'El id de usuario no es válido.',
    };
  }

  const { currentPassword, newPassword, confirmNewPassword } = payload;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar currentPassword, newPassword y confirmNewPassword.',
    };
  }

  if (newPassword !== confirmNewPassword) {
    return {
      ok: false,
      status: 400,
      error: 'La confirmación de contraseña no coincide.',
    };
  }

  if (String(newPassword).length < 8) {
    return {
      ok: false,
      status: 400,
      error: 'La nueva contraseña debe tener al menos 8 caracteres.',
    };
  }

  const user = await User.findById(userId);

  if (!user) {
    return {
      ok: false,
      status: 404,
      error: 'Usuario no encontrado.',
    };
  }

  if (!verifyPassword(currentPassword, user.password)) {
    return {
      ok: false,
      status: 401,
      error: 'La contraseña actual es incorrecta.',
    };
  }

  if (verifyPassword(newPassword, user.password)) {
    return {
      ok: false,
      status: 400,
      error: 'La nueva contraseña no puede ser igual a la actual.',
    };
  }

  user.password = hashPassword(newPassword);
  await user.save();

  return {
    ok: true,
    status: 200,
    data: sanitizeUser(user),
  };
}

async function getUserRoleCatalog() {
  const roles = await UserRole.find({}).sort({ user_role_name: 1 });

  return {
    ok: true,
    status: 200,
    data: roles,
  };
}

module.exports = {
  getUserById,
  updateUserById,
  updateUserPasswordById,
  getUserRoleCatalog,
};
