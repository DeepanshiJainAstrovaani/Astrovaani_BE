const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogid: {
    type: Number,
    trim: true
  },
  name: {
    type: String,
    trim: true,
    maxlength: 255
  },
  title: {
    type: String,
    trim: true,
    maxlength: 255
  },
  content: {
    type: String,
    trim: true
  },
  article: {
    type: String,
    trim: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  banner: {
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    trim: true,
    default: 'Admin',
    maxlength: 100
  },
  publishdate: {
    type: Number
  },
  is_published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'blog',
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      // If there's a numeric id field stored in the doc, keep it
      // Otherwise use _id as string
      if (typeof doc.id === 'number') {
        ret.id = doc.id.toString();
      } else if (ret.id !== undefined) {
        ret.id = ret.id.toString();
      } else if (ret._id) {
        ret.id = ret._id.toString();
      }
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      // If there's a numeric id field stored in the doc, keep it
      // Otherwise use _id as string
      if (typeof doc.id === 'number') {
        ret.id = doc.id.toString();
      } else if (ret.id !== undefined) {
        ret.id = ret.id.toString();
      } else if (ret._id) {
        ret.id = ret._id.toString();
      }
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
blogSchema.index({ is_published: 1 });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
