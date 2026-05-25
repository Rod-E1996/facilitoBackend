const express = require('express');
const { create } = require('./service.controller');

const router = express.Router();

router.post('/', create);

module.exports = router;
