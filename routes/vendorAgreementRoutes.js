const express = require('express');
const router = express.Router();
const VendorAgreement = require('../models/vendorAgreementModel');
const Vendor = require('../models/schemas/vendorSchema');
const adminAuth = require('../middleware/adminAuth');
// const htmlPdf = require('html-pdf-node'); // COMMENTED OUT - Module not available in deployment
// PDF generation handled separately if needed

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

// GET: Download vendor agreement as PDF (Public access)
router.get('/agreement/:vendorId', async (req, res) => {
    try {
        const { vendorId } = req.params;
        
        // Fetch the agreement template
        let agreement = await VendorAgreement.findOne();
        
        if (!agreement) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Agreement Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #d32f2f; }
                        p { color: #666; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <h1>Agreement Template Not Found</h1>
                    <p>The vendor agreement template is not configured. Please contact support.</p>
                </body>
                </html>
            `);
        }
        
        // Fetch vendor details
        const vendor = await Vendor.findById(vendorId);
        
        if (!vendor) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Vendor Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #d32f2f; }
                        p { color: #666; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <h1>Vendor Not Found</h1>
                    <p>The vendor ID provided is invalid. Please check the link and try again.</p>
                </body>
                </html>
            `);
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
        
        // Create HTML document for PDF - use content directly from database with its own styling
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Vendor Agreement - ${vendor.name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    .container-fluid {
                        width: 100%;
                    }
                    .col {
                        padding: 0;
                    }
                    .white {
                        background-color: white;
                    }
                    .basebox {
                        padding: 20px;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                    p {
                        margin: 12px 0;
                        line-height: 1.6;
                        font-size: 14px;
                    }
                    b {
                        font-weight: bold;
                    }
                    ul {
                        margin: 12px 0;
                        padding-left: 30px;
                    }
                    li {
                        margin: 8px 0;
                        font-size: 14px;
                    }
                    .inul {
                        list-style-type: circle;
                        padding-left: 20px;
                    }
                    @page {
                        margin: 20mm;
                    }
                </style>
            </head>
            <body>
                ${personalizedContent}
            </body>
            </html>
        `;
        
        // Create safe filename from vendor name
        const safeVendorName = vendor.name.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Astrovaani_Vendor_Agreement_${safeVendorName}.pdf`;
        
        // PDF generation options
        const options = { 
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        };
        
        const file = { content: htmlContent };
        
        // Return HTML directly (PDF generation not available in this environment)
        // For PDF download, use browser print-to-PDF feature
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename.replace('.pdf', '.html')}"`);
        res.send(htmlContent);
        
    } catch (error) {
        console.error('Error generating vendor agreement PDF:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #d32f2f; }
                    p { color: #666; font-size: 18px; }
                </style>
            </head>
            <body>
                <h1>Error Generating Agreement</h1>
                <p>An error occurred while generating the PDF. Please try again later or contact support.</p>
                <p style="color: #999; font-size: 14px;">${error.message}</p>
            </body>
            </html>
        `);
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
