const express = require('express');
const { list } = require('./business.controller');

const router = express.Router();

router.get('/', list);

module.exports = router;
