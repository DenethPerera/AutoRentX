const Car = require("../models/Car");




exports.addCar = async (req, res) => {
    try {
        
        console.log("------------------------------------------------");
        console.log("📥 RECEIVED REQUEST");
        console.log("Body:", JSON.stringify(req.body, null, 2));
        console.log("File:", req.file); 
        console.log("------------------------------------------------");

        const imageUrl = req.file ? req.file.path : null;
        if (!imageUrl) {
            console.error("❌ ERROR: Image file is missing in req.file");
            return res.status(400).json({ message: "Image upload failed. Check Cloudinary keys." });
        }

        
        const lat = parseFloat(req.body.lat);
        const lng = parseFloat(req.body.lng);

        console.log(`📍 Parsed Coords: Lat=${lat}, Lng=${lng}`);

        if (isNaN(lat) || isNaN(lng)) {
            console.error("❌ ERROR: Coordinates are NaN");
            return res.status(400).json({ message: "Invalid Location Coordinates." });
        }

        const Car = require('../models/Car'); 
        
        const newCar = new Car({
            ...req.body,
            imageUrl: imageUrl,
            owner: req.user.id,
            coordinates: {
                lat: lat,
                lng: lng
            }
        });
        
        await newCar.save();
        console.log("✅ SUCCESS: Car saved to database!");
        res.status(201).json(newCar);

    } catch (error) {
       
        console.error("❌ CRASH DETAILS:", JSON.stringify(error, null, 2));
        
        
        console.error(error.stack); 

        res.status(500).json({ error: error.message });
    }
};
exports.getAllCars = async (req, res) => {
  try {
    const { location, brand, minPrice, maxPrice, fuelType } = req.query;
    let query = { available: true };
    
    if (location) query.location = { $regex: location, $options: "i" };
    if (brand) query.brand = { $regex: brand, $options: "i" };
    if (fuelType) query.fuelType = fuelType;

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("owner", "username email phone");
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        
        if (!car) return res.status(404).json({ message: 'Car not found' });

        if (car.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this car' });
        }

        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleAvailability = async (req, res) => {
    try {
        console.log(`🔄 Toggling status for Car ID: ${req.params.id}`);

        const Car = require('../models/Car');
        const car = await Car.findById(req.params.id);
        
        if (!car) {
            console.log("❌ Car not found");
            return res.status(404).json({ message: "Car not found" });
        }

        // --- 🔒 SAFETY CHECK START ---
        // 1. Check if car has an owner
        if (!car.owner) {
            console.log("❌ CRITICAL: This car has no owner in the database!");
            // Optional: Allow admin to fix it, or just block it.
            return res.status(500).json({ message: "Data Error: Car has no owner." });
        }

        // 2. Safe ID Extraction
        // Handle if populated (object) or unpopulated (string)
        const carOwnerId = car.owner._id 
            ? car.owner._id.toString() 
            : car.owner.toString();
        
        // 3. Check if User ID exists (Middleware check)
        if (!req.user || !req.user.id) {
            console.log("❌ No User ID in request");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;

        // 4. Compare
        if (carOwnerId !== userId) {
            console.log(`⛔ Blocked: Owner ${carOwnerId} vs Requestor ${userId}`);
            return res.status(401).json({ message: "Not authorized to edit this car" });
        }
        // --- SAFETY CHECK END ---

        // Toggle
        car.available = !car.available;
        await car.save();
        
        console.log(`✅ Success. New Status: ${car.available}`);
        res.json({ message: "Car status updated", car });

    } catch (error) {
        // Detailed Error Logging
        console.error("❌ TOGGLE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.getMyCars = async (req, res) => {
    try {
        const cars = await Car.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};