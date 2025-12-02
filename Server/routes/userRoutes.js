const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// PUT /api/users/update
router.put('/update', auth, userController.updateProfile);

module.exports = router;