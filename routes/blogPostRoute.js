const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const app = express();

const BlogPost = require('../models/blogpost');

app.use(express.urlencoded({ extended: false }));

// Generate a random JWT secret key
const generateJwtSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// JWT secret key for token authentication
const jwtSecret = generateJwtSecretKey();
console.log("Generated JWT Secret Key:", jwtSecret);
//
// Create blog post
app.post('/add',  passport.authenticate('jwt', { session: true }), async (req, res) => {
    
    try {
        const blogPost = new BlogPost({
            title: req.body.title,
            content: req.body.content,
            userId: req.user._id,   
        });
        await blogPost.save();
        return res.status(201).json(blogPost);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Read blog posts (with pagination and sorting)
app.get('/get', async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (pageNumber - 1) * pageSize;
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const totalCount = await BlogPost.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);
        const posts = await BlogPost.find().sort({ [sortField]: sortOrder }).skip(skip).limit(pageSize);
        return res.json({ posts, totalPages, totalCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update blog post
app.put('/edit/:postId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(req.params.postId, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        return res.json(updatedPost);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete blog post
app.delete('/delete/:postId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(req.params.postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        return res.json(deletedPost);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/search', async (req, res) => {
    const query = req.query.q; // Get search query from query parameters
    try {
      const results = await BlogPost.find({ $or: [{ title: new RegExp(query, 'i') }, { content: new RegExp(query, 'i') }] });
      res.json(results);
    } catch (error) {
      console.error('Error searching posts:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
  });

module.exports = app;
