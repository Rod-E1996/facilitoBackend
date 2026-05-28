const app = require('./app');
const { PORT } = require('./config/env');
const { connectDatabase } = require('./config/database');
const { createServer } = require('node:http');
const { initSocketServer } = require('./socket');

async function bootstrap() {
  try {
    await connectDatabase();

    const httpServer = createServer(app);
    await initSocketServer(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API:', error.message);
    process.exit(1);
  }
}

bootstrap();
