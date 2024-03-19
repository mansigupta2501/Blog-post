const express = require('express');
const session = require('express-session');
const passport = require('./config/passport-config');
const authRoutes = require('./routes/authRoutes');
const commentRoute = require('./routes/commentRoute');
const blogPostRoute = require('./routes/blogPostRoute');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');

const corsOptions = {
  origin: "http://localhost:3000",
};

// Connect to MongoDB
mongoose.connect("mongodb+srv://mansigupta:mansi123@clusterm.tw7v5sj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterM", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.use('/auth', authRoutes);

app.use('/api', commentRoute)

app.use('/api/posts', blogPostRoute)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
