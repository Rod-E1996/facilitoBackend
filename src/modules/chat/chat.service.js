const mongoose = require('mongoose');
const Chat = require('./chat.model');
const ChatMessages = require('./chat-message.model');
const ServiceRequest = require('../requests/service-request.model');
const Business = require('../business/business.model');

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

async function listChatMessages(userId) {
  const scope = await getUserChatScope(userId);
  if (!scope.ok) return scope;

  const chats = await Chat.find({
    $or: [
      { service_request_id: { $in: scope.serviceRequestIds } },
      { business_id: { $in: scope.businessIds } },
    ],
  })
    .select('_id')
    .lean();

  const chatIds = chats.map((chat) => chat._id);

  const messages = await ChatMessages.find({ chat_id: { $in: chatIds } })
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

module.exports = {
  listChats,
  listChatMessages,
};
