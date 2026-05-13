const express = require('express');
const apiRouter = require('./routes');

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API de Facilito backend funcionando' });
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'facilito-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    message: 'Error interno del servidor.',
  });
});

module.exports = app;
