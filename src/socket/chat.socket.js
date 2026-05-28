const { validateUserChatAccess } = require('../modules/chat/chat.service');

function getChatRoom(chatId) {
  return `chat:${chatId}`;
}

function registerChatSocketHandlers(io, socket) {
  socket.on('chat:join', async (payload = {}, ack) => {
    const { chatId } = payload;
    const access = await validateUserChatAccess(socket.user.id, chatId, 'user_id');

    if (!access.ok) {
      if (typeof ack === 'function') {
        ack({ ok: false, message: access.error });
      }
      return;
    }

    socket.join(getChatRoom(chatId));
    if (typeof ack === 'function') {
      ack({ ok: true });
    }
  });

  socket.on('chat:leave', ({ chatId }) => {
    if (!chatId) return;
    socket.leave(getChatRoom(chatId));
  });

  socket.on('chat:typing', async (payload = {}, ack) => {
    const { chatId, isTyping } = payload;
    const access = await validateUserChatAccess(socket.user.id, chatId, 'user_id');

    if (!access.ok) {
      if (typeof ack === 'function') {
        ack({ ok: false, message: access.error });
      }
      return;
    }

    socket.to(getChatRoom(chatId)).emit('chat:typing', {
      chatId,
      userId: socket.user.id,
      isTyping: Boolean(isTyping),
    });

    if (typeof ack === 'function') {
      ack({ ok: true });
    }
  });
}

module.exports = {
  getChatRoom,
  registerChatSocketHandlers,
};
