const express = require('express');
const { create, list, update } = require('./business.controller');

const router = express.Router();

router.get('/', list);
router.post('/', create);
router.patch('/:business_id', update);

module.exports = router;
