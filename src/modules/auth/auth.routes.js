const express = require('express');
const { login, logout, refresh, register } = require('./auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
