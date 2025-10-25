const blogModel = require('../models/blogModel');

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const results = await blogModel.getAllBlogs();
    res.json(results);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ error: 'Database error', message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel.getBlogById(blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ error: 'Database error', message: error.message });
  }
};
