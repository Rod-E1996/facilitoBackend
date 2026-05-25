const express = require('express');
const { list } = require('./service-request.controller');

const router = express.Router();

router.get('/', list);

module.exports = router;
