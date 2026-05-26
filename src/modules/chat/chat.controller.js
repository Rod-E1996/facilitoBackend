const { listChats, listChatMessages } = require('./chat.service');

async function list(_req, res, next) {
  try {
    const result = await listChats();

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

async function listMessages(_req, res, next) {
  try {
    const result = await listChatMessages();

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

module.exports = {
  list,
  listMessages,
};
