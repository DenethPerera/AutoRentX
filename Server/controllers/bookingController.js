const Booking = require('../models/Booking');
const Car = require('../models/Car');

exports.createBooking = async (req, res) => {
    try {
        const { carId, startDate, endDate } = req.body;

        const car = await Car.findById(carId);
        if (!car) return res.status(404).json({ message: "Car not found" });

        const start = new Date(startDate);
        const end = new Date(endDate);
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const diffDays = Math.round(Math.abs((end - start) / oneDay));

        if (diffDays <= 0) {
            return res.status(400).json({ message: "End date must be after start date" });
        }

        const totalAmount = diffDays * car.pricePerDay;

        const newBooking = new Booking({
            car: carId,
            user: req.user.id, // From Auth Middleware (The Renter)
            owner: car.owner,  // From the Car details
            startDate: start,
            endDate: end,
            totalPrice: totalAmount,
            status: 'pending' // Default status
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking Request Sent!", booking: newBooking });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await require('../models/Booking').find({ user: req.user.id })
            .populate({
                path: 'car',
                select: 'brand model imageUrl location pricePerDay'
            })
            .populate({
                path: 'owner',
                select: 'username email phone' // We explicitly ask for phone & email here
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ owner: req.user.id })
            .populate('user', 'username email') // See who wants to rent
            .populate('car', 'brand model')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const booking = await Booking.findById(req.params.id).populate('car');
        
        if (booking.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};