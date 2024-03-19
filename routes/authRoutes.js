const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
const router = express.Router();
const User = require('../models/user');

// Generate a random JWT secret key
const generateJwtSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// JWT secret key for token authentication
const jwtSecret = generateJwtSecretKey();
console.log("Generated JWT Secret Key:", jwtSecret); // Log the generated secret key to the console

// Login route
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  console.log("Request Body:", req.body);
  const token = jwt.sign({ sub: req.user._id }, jwtSecret);
  console.log("Request Body:", req.body);
  res.json({ token });
});

// Registration route
router.post('/register', async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { username, password } = req.body;
    console.log("Request Body:", req.body);
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Number of salt rounds: 10
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


module.exports = router;