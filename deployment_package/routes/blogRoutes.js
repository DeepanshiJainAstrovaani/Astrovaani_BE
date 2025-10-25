const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// GET all blogs
router.get('/', blogController.getAllBlogs);

router.get("/:id", blogController.getBlogById);

module.exports = router;
