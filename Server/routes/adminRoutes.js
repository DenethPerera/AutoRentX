const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Get Dashboard Stats
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCars = await Car.countDocuments();
        const totalBookings = await Booking.countDocuments();
        res.json({ totalUsers, totalCars, totalBookings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a User (and their cars)
router.delete('/user/:id', [auth, admin], async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Car.deleteMany({ owner: req.params.id });
        res.json({ message: 'User and their cars deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;