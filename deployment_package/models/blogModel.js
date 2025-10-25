const db = require('../config/db');

// Fetch all blog posts
exports.getAllBlogs = (callback) => {
    const query = 'SELECT * FROM blog';
    db.query(query, callback);
};

// Get a blog by ID
exports.getBlogById = (id, callback) => {
    const query = 'SELECT * FROM blog WHERE id = ?';
    db.query(query, [id], callback);
};