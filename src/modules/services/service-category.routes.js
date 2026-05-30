const express = require('express');
const { list: listCategories, listDetailedByServiceId } = require('./service-category.controller');
const { create, list: listServices } = require('./service.controller');

const router = express.Router();

router.get('/', listServices);
router.post('/', create);
router.get('/categories', listCategories);
router.get('/detailed-categories', listDetailedByServiceId);

module.exports = router;
