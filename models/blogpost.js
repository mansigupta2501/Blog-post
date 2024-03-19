const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    content: String,
    author: String,
    keywords: [String],
    tags: [String],
    createdAt: { type: Date, default: Date.now },
});
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;