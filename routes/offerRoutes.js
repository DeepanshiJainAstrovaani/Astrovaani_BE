/**
 * Offer Routes
 * 
 * API routes for managing promotional offers
 */

const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// Get all offers
router.get('/', offerController.getAllOffers);

// Get active offers only
router.get('/active', offerController.getActiveOffers);

// Get offer by code
router.get('/code/:offerCode', offerController.getOfferByCode);

// Get offers by mobile
router.get('/mobile/:mobile', offerController.getOffersByMobile);

// Get single offer by ID
router.get('/:id', offerController.getOfferById);

// Create new offer
router.post('/', offerController.createOffer);

// Update offer
router.put('/:id', offerController.updateOffer);

// Delete offer
router.delete('/:id', offerController.deleteOffer);

module.exports = router;
