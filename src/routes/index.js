const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');

const router = express.Router();

router.get('/status', (_req, res) => {
  res.json({ ok: true, message: 'API online' });
});

router.use('/auth', authRoutes);

module.exports = router;
