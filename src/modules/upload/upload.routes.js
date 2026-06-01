const express = require('express');
const multer = require('multer');
const { requireAuth } = require('../../shared/security/auth-middleware');
const { uploadUserImageHandler } = require('./upload.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = express.Router();

// POST /upload/user-image
// Body: multipart/form-data, campo "image"
// Requiere: Authorization: Bearer <token>
router.post('/user-image', requireAuth, upload.single('image'), uploadUserImageHandler);

module.exports = router;
