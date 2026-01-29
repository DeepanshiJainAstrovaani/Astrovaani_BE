const express = require('express');
const router = express.Router();
const VendorAgreement = require('../models/vendorAgreementModel');
const Vendor = require('../models/vendorModel');
const adminAuth = require('../middleware/adminAuth');

// GET: Fetch vendor agreement content (template)
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

// GET: Fetch vendor agreement with dynamic vendor details
router.get('/vendor-agreement/:vendorId', async (req, res) => {
    try {
        const { vendorId } = req.params;
        
        // Fetch the agreement template
        let agreement = await VendorAgreement.findOne();
        
        if (!agreement) {
            agreement = new VendorAgreement({});
            await agreement.save();
        }
        
        // Fetch vendor details
        const vendor = await Vendor.findById(vendorId);
        
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }
        
        // Get current date in format "DD Month YYYY"
        const agreementDate = new Date().toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        // Replace placeholders with actual vendor data
        let personalizedContent = agreement.content
            .replace(/{{VENDOR_NAME}}/g, vendor.name || 'Vendor Name')
            .replace(/{{VENDOR_EMAIL}}/g, vendor.email || 'vendor@email.com')
            .replace(/{{VENDOR_MOBILE}}/g, vendor.mobile || 'N/A')
            .replace(/{{VENDOR_CATEGORY}}/g, vendor.category || 'Astrologer')
            .replace(/{{AGREEMENT_DATE}}/g, agreementDate);
        
        res.json({
            success: true,
            data: {
                content: personalizedContent,
                vendorInfo: {
                    name: vendor.name,
                    email: vendor.email,
                    mobile: vendor.mobile,
                    category: vendor.category
                },
                agreementDate: agreementDate
            }
        });
    } catch (error) {
        console.error('Error fetching personalized vendor agreement:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor agreement',
            error: error.message
        });
    }
});

// PUT: Update vendor agreement content (Admin only)
router.put('/vendor-agreement', adminAuth, async (req, res) => {
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
