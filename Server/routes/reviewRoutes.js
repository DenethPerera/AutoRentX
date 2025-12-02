const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');


router.post('/add', auth, reviewController.addReview);

router.get('/:carId', reviewController.getCarReviews);

module.exports = router;