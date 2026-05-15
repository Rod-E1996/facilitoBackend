const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');

const router = express.Router();

router.get('/status', (_req, res) => {
  res.json({ ok: true, message: 'API online' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;
