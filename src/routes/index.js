const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const businessRoutes = require('../modules/business/business.routes');
const chatRoutes = require('../modules/chat/chat.routes');
const userRoutes = require('../modules/users/user.routes');
const reviewRoutes = require('../modules/reviews/review.routes');
const serviceRequestRoutes = require('../modules/requests/service-request.routes');
const serviceCategoryRoutes = require('../modules/services/service-category.routes');

const router = express.Router();

router.get('/status', (_req, res) => {
  res.json({ ok: true, message: 'API online' });
});

router.use('/auth', authRoutes);
router.use('/business', businessRoutes);
router.use('/chat', chatRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/requests', serviceRequestRoutes);
router.use('/services', serviceCategoryRoutes);

module.exports = router;
