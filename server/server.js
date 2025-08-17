const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// In-memory user storage (replace with database in production)
const users = [];
const posts = [];
const JWT_SECRET = 'your-secret-key'; // Use environment variable in production

// Input validation middleware
const validateInput = (req, res, next) => {
  const { email, password, username } = req.body;
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password validation
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Username validation for signup
  if (req.path === '/api/auth/signup') {
    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
  }

  next();
};

// Signup endpoint
app.post('/api/auth/signup', validateInput, async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: users.length + 1,
      email,
      username,
      password: hashedPassword
    };
    users.push(user);

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login endpoint
app.post('/api/auth/login', validateInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Update profile endpoint
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const userId = req.user.id;

    // Find and update user
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username is taken by another user
    if (username !== user.username && users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Update user information
    user.username = username;
    user.email = email;
    user.bio = bio;

    // Generate new token with updated info
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username, bio: user.bio }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Post endpoints
app.post('/api/posts', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { caption, hashtags, location } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    
    const post = {
      id: posts.length + 1,
      userId: req.user.id,
      username: req.user.username,
      fileUrl,
      fileType,
      caption,
      hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [],
      location,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    posts.push(post);
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Get all posts
app.get('/api/posts', authenticateToken, (req, res) => {
  try {
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Get user's posts
app.get('/api/posts/user/:userId', authenticateToken, (req, res) => {
  try {
    const userPosts = posts
      .filter(post => post.userId === parseInt(req.params.userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
    res.json({ 
      posts: userPosts,
      totalPosts: userPosts.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts' });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
