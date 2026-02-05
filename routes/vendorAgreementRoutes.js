const express = require('express');
const router = express.Router();
const VendorAgreement = require('../models/vendorAgreementModel');
const Vendor = require('../models/schemas/vendorSchema');
const adminAuth = require('../middleware/adminAuth');
const PDFDocument = require('pdfkit');

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
        
        // Strip HTML tags for plain text PDF
        const stripHtml = (html) => {
            return html
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<li>/gi, '• ')
                .replace(/<\/li>/gi, '\n')
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .trim();
        };

        const textContent = stripHtml(personalizedContent);
        
        // Create safe filename from vendor name
        const safeVendorName = vendor.name.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Astrovaani_Vendor_Agreement_${safeVendorName}.pdf`;
        
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        });
        
        // Pipe PDF to response
        doc.pipe(res);
        
        // Add logo (optional - uncomment if you have logo file)
        // try {
        //     doc.image('./assets/logo.png', 50, 50, { width: 150 });
        //     doc.moveDown(3);
        // } catch (e) {
        //     // Logo not found, skip
        // }
        
        // Add title
        doc.fontSize(20).font('Helvetica-Bold').text('VENDOR AGREEMENT', {
            align: 'center'
        });
        doc.moveDown(1);
        
        // Add vendor details
        doc.fontSize(12).font('Helvetica-Bold').text(`Vendor: ${vendor.name}`, {
            align: 'left'
        });
        doc.fontSize(10).font('Helvetica').text(`Email: ${vendor.email || 'N/A'}`);
        doc.text(`Mobile: ${vendor.mobile || 'N/A'}`);
        doc.text(`Category: ${vendor.category || 'Astrologer'}`);
        doc.text(`Date: ${agreementDate}`);
        doc.moveDown(1.5);
        
        // Add horizontal line
        doc.strokeColor('#000000')
           .lineWidth(1)
           .moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke();
        
        doc.moveDown(1);
        
        // Add agreement content
        const lines = textContent.split('\n');
        doc.fontSize(11).font('Helvetica');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                // Check if line starts with bullet
                if (trimmedLine.startsWith('•')) {
                    doc.text(trimmedLine, {
                        indent: 20,
                        align: 'justify'
                    });
                } else if (trimmedLine.includes('VENDOR') || trimmedLine.includes('ASTROVAANI') || trimmedLine.includes('AGREEMENT')) {
                    // Make section headers bold
                    doc.font('Helvetica-Bold').text(trimmedLine, {
                        align: 'justify'
                    });
                    doc.font('Helvetica');
                } else {
                    doc.text(trimmedLine, {
                        align: 'justify'
                    });
                }
            } else {
                doc.moveDown(0.5);
            }
        });
        
        // Add signature section at the end
        doc.moveDown(2);
        doc.strokeColor('#000000')
           .lineWidth(1)
           .moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke();
        
        doc.moveDown(1);
        doc.fontSize(10).font('Helvetica-Bold').text('SIGNATURES', { align: 'center' });
        doc.moveDown(1);
        
        const midPoint = doc.page.width / 2;
        doc.font('Helvetica');
        
        // Left side - Vendor signature
        doc.text('Vendor:', 50, doc.y);
        doc.text(`${vendor.name}`, 50, doc.y + 40);
        doc.text(`Date: ${agreementDate}`, 50, doc.y + 20);
        
        // Right side - Company signature
        doc.text('For Astrovaani:', midPoint, doc.y - 80);
        doc.text('Authorized Signatory', midPoint, doc.y + 40);
        doc.text(`Date: ${agreementDate}`, midPoint, doc.y + 20);
        
        // Finalize PDF
        doc.end();
        
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
