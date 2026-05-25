const express = require('express');
const { list } = require('./service-category.controller');
const { create } = require('./service.controller');

const router = express.Router();

router.post('/', create);
router.get('/categories', list);

module.exports = router;
