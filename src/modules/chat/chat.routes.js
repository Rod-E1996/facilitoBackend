const express = require('express');
const { createMessage, list, listMessages } = require('./chat.controller');

const router = express.Router();

router.get('/', list);
router.get('/messages', listMessages);
router.post('/messages', createMessage);

module.exports = router;
