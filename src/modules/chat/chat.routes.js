const express = require('express');
const { createMessage, list, listMessages } = require('./chat.controller');
const { requireAuth } = require('../../shared/security/auth-middleware');

const router = express.Router();

router.get('/', requireAuth, list);
router.get('/messages', requireAuth, listMessages);
router.post('/messages', requireAuth, createMessage);

module.exports = router;
