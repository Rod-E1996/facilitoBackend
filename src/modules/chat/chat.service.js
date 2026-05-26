const Chat = require('./chat.model');
const ChatMessages = require('./chat-message.model');

async function listChats() {
  const chats = await Chat.find({})
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

async function listChatMessages() {
  const messages = await ChatMessages.find({})
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
