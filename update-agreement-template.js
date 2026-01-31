const mongoose = require('mongoose');
require('dotenv').config();

const VendorAgreement = require('./models/vendorAgreementModel');

const updateAgreementTemplate = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/astro', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Delete existing agreement
        await VendorAgreement.deleteMany({});
        console.log('Deleted old agreement template');

        // Create new agreement with placeholders
        const newAgreement = new VendorAgreement({});
        await newAgreement.save();
        
        console.log('✅ New agreement template created with dynamic placeholders!');
        console.log('Placeholders: {{VENDOR_NAME}}, {{VENDOR_EMAIL}}, {{VENDOR_MOBILE}}, {{VENDOR_CATEGORY}}, {{AGREEMENT_DATE}}');
        
        process.exit(0);
    } catch (error) {
        console.error('Error updating agreement template:', error);
        process.exit(1);
    }
};

updateAgreementTemplate();
