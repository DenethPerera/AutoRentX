const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

// ALL routes here require you to be logged in
router.post('/create', auth, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getMyBookings); // For Renters
router.get('/owner-bookings', auth, bookingController.getOwnerBookings); // For Owners
router.put('/:id/status', auth, bookingController.updateBookingStatus);

module.exports = router;