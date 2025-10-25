const blogModel = require('../models/blogModel');

// Get all blog posts
exports.getAllBlogs = (req, res) => {
    blogModel.getAllBlogs((err, results) => {
        if (err) {
            console.error('Error fetching blogs:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
};

exports.getBlogById = (req, res) => {
    const blogId = req.params.id;
    blogModel.getBlogById(blogId, (err, results) => {
        if (err) {
            console.error("Error fetching blog by ID:", err);
            res.status(500).send('Database error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Contact not found');
            return;
        }
        res.json(results[0]);
    });
};
