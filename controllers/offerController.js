/**
 * Offer Controller
 * 
 * Handles CRUD operations for promotional offers
 */

const Offer = require('../models/schemas/offerSchema');
this
/**
 * Get all offers
 * @route GET /api/offers
 */
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    console.error('❌ Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers',
      error: error.message
    });
  }
};

/**
 * Get single offer by ID
 * @route GET /api/offers/:id
 */
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('❌ Error fetching offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offer',
      error: error.message
    });
  }
};

/**
 * Get offer by offer code
 * @route GET /api/offers/code/:offerCode
 */
exports.getOfferByCode = async (req, res) => {
  try {
    const offer = await Offer.findOne({ offerCode: req.params.offerCode });
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('❌ Error fetching offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offer',
      error: error.message
    });
  }
};

/**
 * Create new offer
 * @route POST /api/offers
 */
exports.createOffer = async (req, res) => {
  try {
    const {
      vendor,
      mobile,
      offerCode,
      offerText,
      chat,
      call,
      amount,
      timing,
      expiryDate,
      validFor,
      applicability
    } = req.body;

    // Validate required fields
    if (!vendor || !offerCode || !offerText || !chat || !call || !amount || !timing || !expiryDate || !validFor) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate mobile if provided
    if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    // Create offer
    const offer = await Offer.create({
      vendor,
      mobile,
      offerCode,
      offerText,
      chat,
      call,
      amount,
      timing,
      expiryDate,
      validFor,
      applicability: Array.isArray(applicability) ? applicability : [],
    });

    console.log(`✅ Offer created: ${offer.offerCode} for ${vendor}`);

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    console.error('❌ Error creating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create offer',
      error: error.message
    });
  }
};

/**
 * Update offer
 * @route PUT /api/offers/:id
 */
exports.updateOffer = async (req, res) => {
  try {
    // Validate mobile number if provided
    if (req.body.mobile) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(req.body.mobile)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid 10-digit mobile number'
        });
      }
    }

    // Use $set to update all provided fields
    const updateFields = { ...req.body };
    // Remove _id if present in payload
    delete updateFields._id;

    // Update and return the new document
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    console.log(`✅ Offer updated: ${updatedOffer.offerCode}`);

    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: updatedOffer
    });
  } catch (error) {
    console.error('❌ Error updating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update offer',
      error: error.message
    });
  }
};

/**
 * Delete offer
 * @route DELETE /api/offers/:id
 */
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    await offer.deleteOne();

    console.log(`✅ Offer deleted: ${offer.offerCode}`);

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete offer',
      error: error.message
    });
  }
};

/**
 * Get offers by mobile number
 * @route GET /api/offers/mobile/:mobile
 */
exports.getOffersByMobile = async (req, res) => {
  try {
    const offers = await Offer.find({ mobile: req.params.mobile }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    console.error('❌ Error fetching offers by mobile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers',
      error: error.message
    });
  }
};

/**
 * Get active offers
 * @route GET /api/offers/active
 */
exports.getActiveOffers = async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      expiryDate: { $gte: now }
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    console.error('❌ Error fetching active offers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active offers',
      error: error.message
    });
  }
};
