const express = require('express');
const horoscopeController = require('../controllers/horoscopeController');

const router = express.Router();

// GET /api/horoscope
router.get('/', horoscopeController.getAllHoroscopes);

router.get('/daily-prediction', horoscopeController.getDailyPrediction);

module.exports = router;