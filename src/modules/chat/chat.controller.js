const { createChatMessage, listChats, listChatMessages } = require('./chat.service');

async function list(req, res, next) {
  try {
    const result = await listChats(req.query.user_id);

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
    const result = await listChatMessages(req.query.user_id);

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
    const result = await createChatMessage(req.body);

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, message: result.error });
    }

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
