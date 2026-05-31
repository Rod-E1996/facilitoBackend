const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const { CLIENT_ORIGIN, SOCKET_PATH, REDIS_URL } = require('../config/env');
const { getChatRoom, registerChatSocketHandlers } = require('./chat.socket');
const { verifyAccessToken } = require('../shared/security/jwt');
const { getBearerToken } = require('../shared/security/auth-middleware');

let io;

async function setupRedisAdapter(socketServer) {
  if (!REDIS_URL) {
    return;
  }

  let pubClient;
  let subClient;

  try {
    pubClient = createClient({ url: REDIS_URL });
    subClient = pubClient.duplicate();
  } catch (error) {
    console.warn(`REDIS_URL inválida, se omite Redis adapter: ${error.message}`);
    return;
  }

  pubClient.on('error', (error) => {
    console.error('Redis pub client error:', error.message);
  });

  subClient.on('error', (error) => {
    console.error('Redis sub client error:', error.message);
  });

  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    socketServer.adapter(createAdapter(pubClient, subClient));
    console.log('Socket.IO Redis adapter habilitado.');
  } catch (error) {
    console.warn(`No se pudo conectar a Redis, se continúa sin adapter: ${error.message}`);
  }
}

async function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    path: SOCKET_PATH,
    cors: {
      origin: CLIENT_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const authToken = socket.handshake.auth?.token;
      const headerToken = getBearerToken(socket.handshake.headers?.authorization);
      const token = authToken || headerToken;

      if (!token) {
        return next(new Error('No autorizado. Debes enviar token en handshake.auth.token.'));
      }

      const decoded = verifyAccessToken(token);
      socket.user = {
        id: decoded.sub,
        email: decoded.email,
        roleId: decoded.roleId,
      };

      return next();
    } catch (error) {
      return next(new Error('Token inválido o expirado.'));
    }
  });

  io.on('connection', (socket) => {
    registerChatSocketHandlers(io, socket);
  });

  await setupRedisAdapter(io);

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO no fue inicializado.');
  }

  return io;
}

function emitToChatRoom(chatId, eventName, payload) {
  if (!chatId || !io) return;
  getIO().to(getChatRoom(chatId)).emit(eventName, payload);
}

module.exports = {
  initSocketServer,
  getIO,
  emitToChatRoom,
};
