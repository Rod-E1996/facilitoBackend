const express = require('express');
const { list, listDetailedByServiceId } = require('./service-category.controller');
const { create } = require('./service.controller');

const router = express.Router();

router.post('/', create);
router.get('/categories', list);
router.get('/detailed-categories', listDetailedByServiceId);

module.exports = router;
