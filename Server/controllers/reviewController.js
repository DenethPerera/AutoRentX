const Review = require('../models/Review');
const Booking = require('../models/Booking');

// 1. Add a Review
exports.addReview = async (req, res) => {
    try {
        const { carId, rating, comment } = req.body;

        // --- 🔒 CHECK BOOKING LOGIC ---
        const hasBooking = await Booking.findOne({
            user: req.user.id,
            car: carId,
            // Allow 'approved' OR 'completed' bookings for easier testing
            status: { $in: ['approved', 'completed'] } 
        });

        // ⚠️ NOTE: Comment out this block if you want to test without booking first
        if (!hasBooking) {
            return res.status(403).json({ message: "You must rent this car first to leave a review." });
        }
        // ------------------------------

        const newReview = new Review({
            car: carId,
            user: req.user.id,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get Reviews for a Car (THIS WAS MISSING)
exports.getCarReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ car: req.params.carId })
            .populate('user', 'username') // Show who wrote it
            .sort({ createdAt: -1 }); // Newest first
        
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};