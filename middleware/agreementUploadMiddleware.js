const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

// Configure Cloudinary storage for agreement PDFs
const agreementStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vendor_agreements', // Folder name in Cloudinary
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'auto' // Allow all file types
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
