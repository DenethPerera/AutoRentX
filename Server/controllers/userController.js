const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { username, phone } = req.body;
        
        // Find user by ID (from the token) and update
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, phone },
            { new: true, runValidators: true } // Return the updated document
        ).select('-password'); // Don't send back the password

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};