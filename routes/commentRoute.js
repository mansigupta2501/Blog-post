const express = require('express');
const passport = require('passport');

const app = express()

app.use(express.urlencoded({ extended: false }));
const Comment = require('../models/comment');

// Create Comment
app.post('/comments/add', passport.authenticate('jwt', { session: false }), async (req, res,next ) => {
    try {
        const { postId, text } = req.body;
        const comment = new Comment({ postId, text });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read Comments for a Post
app.get('/comments/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Comment
app.put('/comments/:commentId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, { text }, { new: true });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Comment
app.delete('/comments/:commentId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
