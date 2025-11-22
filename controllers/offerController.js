/**
 * Offer Controller
 * 
 * Handles CRUD operations for promotional offers
 */

const Offer = require('../models/schemas/offerSchema');

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
    const {
      user,
      mobile,
      chatCall,
      validFor,
      expiryDate,
      amount,
      timing,
      promoText1,
      promoText2,
      isActive
    } = req.body;

    // Validate mobile number if provided
    if (mobile) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(mobile)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid 10-digit mobile number'
        });
      }
    }

    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Update fields
    if (user) offer.user = user;
    if (mobile) offer.mobile = mobile;
    if (chatCall) offer.chatCall = chatCall;
    if (validFor) offer.validFor = validFor;
    if (expiryDate) offer.expiryDate = expiryDate;
    if (amount) offer.amount = amount;
    if (timing) offer.timing = timing;
    if (promoText1 !== undefined) offer.promoText1 = promoText1;
    if (promoText2 !== undefined) offer.promoText2 = promoText2;
    if (isActive !== undefined) offer.isActive = isActive;

    await offer.save();

    console.log(`✅ Offer updated: ${offer.offerCode}`);

    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
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
