const Blog = require('./schemas/blogSchema');

// Fetch all blog posts
exports.getAllBlogs = async () => {
  try {
    return await Blog.find({}).sort({ createdAt: -1 }); // Sort by newest first
  } catch (error) {
    throw error;
  }
};

// Get a blog by ID
exports.getBlogById = async (id) => {
  try {
    // First try to find by the custom 'id' field (for migrated data)
    let blog = await Blog.findOne({ id: id });
    
    // If not found and id looks like ObjectId, try finding by _id
    if (!blog && id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    }
    
    return blog;
  } catch (error) {
    throw error;
  }
};