const express = require('express');
const { create } = require('./review.controller');

const router = express.Router();

router.post('/', create);

module.exports = router;
