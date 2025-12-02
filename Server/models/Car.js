const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    capacity: { type: Number, required: true }, 
    transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
    location: { type: String, required: true }, 
    imageUrl: { type: String, required: true },
    description: { type: String },
    available: { type: Boolean, default: true },

    // 👇 THIS IS THE CRITICAL PART 👇
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }

}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);