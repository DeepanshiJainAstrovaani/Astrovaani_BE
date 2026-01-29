const express = require('express');
const router = express.Router();
const VendorAgreement = require('../models/vendorAgreementModel');
const { verifyAdminToken } = require('../middleware/auth');

// GET: Fetch vendor agreement content
router.get('/vendor-agreement', async (req, res) => {
    try {
        let agreement = await VendorAgreement.findOne();
        
        // If no agreement exists, create one with default content
        if (!agreement) {
            agreement = new VendorAgreement({});
            await agreement.save();
        }
        
        res.json({
            success: true,
            data: {
                content: agreement.content,
                updatedAt: agreement.updatedAt,
                updatedBy: agreement.updatedBy
            }
        });
    } catch (error) {
        console.error('Error fetching vendor agreement:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor agreement',
            error: error.message
        });
    }
});

// PUT: Update vendor agreement content (Admin only)
router.put('/vendor-agreement', verifyAdminToken, async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Agreement content cannot be empty'
            });
        }
        
        let agreement = await VendorAgreement.findOne();
        
        if (!agreement) {
            // Create new agreement if it doesn't exist
            agreement = new VendorAgreement({
                content,
                updatedBy: req.admin?.email || 'Admin'
            });
        } else {
            // Update existing agreement
            agreement.content = content;
            agreement.updatedBy = req.admin?.email || 'Admin';
            agreement.updatedAt = new Date();
        }
        
        await agreement.save();
        
        res.json({
            success: true,
            message: 'Vendor agreement updated successfully',
            data: {
                content: agreement.content,
                updatedAt: agreement.updatedAt,
                updatedBy: agreement.updatedBy
            }
        });
    } catch (error) {
        console.error('Error updating vendor agreement:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vendor agreement',
            error: error.message
        });
    }
});

module.exports = router;
