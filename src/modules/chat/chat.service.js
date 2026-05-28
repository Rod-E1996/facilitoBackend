const mongoose = require('mongoose');
const Chat = require('./chat.model');
const ChatMessages = require('./chat-message.model');
const ServiceRequest = require('../requests/service-request.model');
const Business = require('../business/business.model');
const User = require('../users/user.model');

async function getUserChatScope(userId) {
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

  const [serviceRequests, businesses] = await Promise.all([
    ServiceRequest.find({ customer_id: userId }).select('_id').lean(),
    Business.find({ user_id: userId }).select('_id').lean(),
  ]);

  return {
    ok: true,
    serviceRequestIds: serviceRequests.map((item) => item._id),
    businessIds: businesses.map((item) => item._id),
  };
}

async function listChats(userId) {
  const scope = await getUserChatScope(userId);
  if (!scope.ok) return scope;

  const chats = await Chat.find({
    $or: [
      { service_request_id: { $in: scope.serviceRequestIds } },
      { business_id: { $in: scope.businessIds } },
    ],
  })
    .populate({
      path: 'service_request_id',
      populate: [
        { path: 'customer_id', select: '-password' },
        {
          path: 'service_id',
          populate: { path: 'business_id' },
        },
      ],
    })
    .populate({
      path: 'business_id',
      populate: { path: 'user_id', select: '-password' },
    })
    .sort({ _id: -1 });

  return {
    ok: true,
    status: 200,
    data: chats,
  };
}

async function validateUserChatAccess(userId, chatId, userFieldLabel = 'user_id') {
  if (!userId) {
    return {
      ok: false,
      status: 400,
      error: `Debes enviar ${userFieldLabel}.`,
    };
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      ok: false,
      status: 400,
      error: `El ${userFieldLabel} no es un ObjectId válido.`,
    };
  }

  if (!chatId) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar chat_id.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return {
      ok: false,
      status: 400,
      error: 'El chat_id no es un ObjectId válido.',
    };
  }

  const chat = await Chat.findById(chatId).select('service_request_id business_id').lean();

  if (!chat) {
    return {
      ok: false,
      status: 404,
      error: 'Chat no encontrado.',
    };
  }

  const [serviceRequest, business] = await Promise.all([
    ServiceRequest.findById(chat.service_request_id).select('customer_id').lean(),
    Business.findById(chat.business_id).select('user_id').lean(),
  ]);

  const isCustomerInChat =
    serviceRequest?.customer_id && String(serviceRequest.customer_id) === String(userId);
  const isBusinessOwnerInChat = business?.user_id && String(business.user_id) === String(userId);

  if (!isCustomerInChat && !isBusinessOwnerInChat) {
    return {
      ok: false,
      status: 403,
      error: 'No tienes permisos para acceder a este chat.',
    };
  }

  return {
    ok: true,
    status: 200,
    chat,
  };
}

async function listChatMessages(chatId, userId) {
  if (!chatId) {
    return {
      ok: false,
      status: 400,
      error: 'Debes enviar el query param chat_id.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return {
      ok: false,
      status: 400,
      error: 'El chat_id no es un ObjectId válido.',
    };
  }

  const access = await validateUserChatAccess(userId, chatId, 'user_id');
  if (!access.ok) return access;

  const messages = await ChatMessages.find({ chat_id: chatId })
    .populate({
      path: 'chat_id',
      populate: [
        {
          path: 'service_request_id',
          populate: [
            { path: 'customer_id', select: '-password' },
            { path: 'service_id', populate: { path: 'business_id' } },
          ],
        },
        {
          path: 'business_id',
          populate: { path: 'user_id', select: '-password' },
        },
      ],
    })
    .populate({ path: 'sender_id', select: '-password' })
    .sort({ time_sent: -1 });

  return {
    ok: true,
    status: 200,
    data: messages,
  };
}

async function createChatMessage(payload, authenticatedUserId) {
  const requiredFields = ['chat_id', 'message_content'];
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

  if (!mongoose.Types.ObjectId.isValid(payload.chat_id)) {
    return {
      ok: false,
      status: 400,
      error: 'El chat_id no es un ObjectId válido.',
    };
  }

  if (!mongoose.Types.ObjectId.isValid(authenticatedUserId)) {
    return {
      ok: false,
      status: 400,
      error: 'El usuario autenticado no es un ObjectId válido.',
    };
  }

  const access = await validateUserChatAccess(authenticatedUserId, payload.chat_id, 'user_id');
  if (!access.ok) return access;

  const sender = await User.findById(authenticatedUserId).lean();

  if (!sender) {
    return {
      ok: false,
      status: 404,
      error: 'Usuario sender no encontrado.',
    };
  }

  const timeSent = payload.time_sent ? new Date(payload.time_sent) : new Date();
  if (Number.isNaN(timeSent.getTime())) {
    return {
      ok: false,
      status: 400,
      error: 'El time_sent no tiene un formato de fecha válido.',
    };
  }

  const message = await ChatMessages.create({
    chat_id: payload.chat_id,
    sender_id: authenticatedUserId,
    message_content: String(payload.message_content).trim(),
    is_sent: payload.is_sent === undefined ? true : Boolean(payload.is_sent),
    is_read: payload.is_read === undefined ? false : Boolean(payload.is_read),
    time_sent: timeSent,
  });

  const populatedMessage = await ChatMessages.findById(message._id)
    .populate({ path: 'sender_id', select: '-password' })
    .populate('chat_id');

  return {
    ok: true,
    status: 201,
    data: populatedMessage,
  };
}

module.exports = {
  listChats,
  listChatMessages,
  createChatMessage,
  validateUserChatAccess,
};
