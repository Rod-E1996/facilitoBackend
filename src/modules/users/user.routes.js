const express = require('express');
const { getRoleCatalog, getById, patchById, patchPasswordById } = require('./user.controller');

const router = express.Router();

router.get('/roles/catalog', getRoleCatalog);
router.get('/:id', getById);
router.patch('/:id', patchById);
router.patch('/:id/password', patchPasswordById);

module.exports = router;
