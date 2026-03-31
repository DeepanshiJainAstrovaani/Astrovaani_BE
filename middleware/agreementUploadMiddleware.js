const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

// Configure Cloudinary storage for agreement PDFs
const agreementStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vendor_agreements',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw', // Use 'raw' for PDFs and documents so they're stored properly
    api_key: process.env.CLOUDINARY_API_KEY,
  }
});

// Create multer upload instance for agreements
const agreementUpload = multer({
  storage: agreementStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for documents
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF and document files
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed!'), false);
    }
  }
});

module.exports = agreementUpload;
