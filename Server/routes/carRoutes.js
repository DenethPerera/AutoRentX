const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/add", auth, upload.single("image"), carController.addCar);

router.get("/all", carController.getAllCars);
router.post("/add", auth, carController.addCar);
router.delete("/delete/:id", auth, carController.deleteCar);
router.put('/status/:id', auth, carController.toggleAvailability);
router.get('/my-cars', auth, carController.getMyCars);

router.get("/:id", carController.getCarById);

module.exports = router;
