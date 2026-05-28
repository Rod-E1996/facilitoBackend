const { createChatMessage, listChats, listChatMessages } = require('./chat.service');
const { emitToChatRoom } = require('../../socket');

async function list(req, res, next) {
  try {
    const result = await listChats(req.user.id);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      chats: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function listMessages(req, res, next) {
  try {
    const result = await listChatMessages(req.query.chat_id, req.user.id);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    return res.status(result.status).json({
      ok: true,
      messages: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

async function createMessage(req, res, next) {
  try {
    const result = await createChatMessage(req.body, req.user.id);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

    emitToChatRoom(result.data.chat_id?._id || result.data.chat_id, 'chat:new-message', {
      chatId: result.data.chat_id?._id || result.data.chat_id,
      chatMessage: result.data,
    });

    return res.status(result.status).json({
      ok: true,
      message: 'Mensaje de chat creado correctamente.',
      chatMessage: result.data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  listMessages,
  createMessage,
};
