const express = require('express');
const { list, listMessages } = require('./chat.controller');

const router = express.Router();

router.get('/', list);
router.get('/messages', listMessages);

module.exports = router;
