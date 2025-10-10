const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const socialAuthRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');
const videoRoutes = require('./routes/videoRoutes');
const profileRoutes = require('./routes/profile');


dotenv.config();
const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const videosDir = path.join(__dirname, 'uploads', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}


// Single CORS configuration
const corsOptions = {
  origin: '*', // Allow both ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: '*',
};


// Increase request size limits for video uploads
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Increase timeout for large uploads
app.use((req, res, next) => {
  // Set timeout to 10 minutes for all requests
  req.setTimeout(600000);
  res.setTimeout(600000);
  next();
});

const app5000 = express();
app5000.use(cors(corsOptions));
app5000.use(express.json({ limit: '500mb' }));
app5000.use(express.urlencoded({ extended: true, limit: '500mb' }));

const signupRoutes = require('./routes/SignupRoutes');

// Apply CORS once (remove duplicate CORS)
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', signupRoutes);
app.use('/api', adminRoutes);
app.use('/api', videoRoutes);
app.use('/api', profileRoutes);


// Remove this duplicate CORS line
// app.use(cors());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve .well-known directory for SSL certificate verification
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

app.use('/', socialAuthRoutes);


require('./routes/passport'); // Assuming you have a separate config for passport

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const templateRoutes = require('./routes/templateRoutes');
const jsonRoutes = require('./routes/jsonRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboard');  
const passport = require('passport');

require('./config/passport'); // ⬅️ Important

app.use(passport.initialize());

// Use auth routes
app.use('/', authRoutes);


// Use routes with /api prefix
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
// app5000.use('/api/users', userRoutes);           //me//
app.use('/api/templates', templateRoutes);
app.use('/api', jsonRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', adminRoutes);

app.use('/api/dashboard', dashboardRoutes);
 
 
 
// app.use('/', categoryRoutes);




// Serve static frontend (React build)
app.use(express.static(path.join(__dirname, 'views', 'build')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/build', 'index.html'));
});

// Optional: Handle missing uploaded files
app.use((req, res, next) => {
  if (req.url.startsWith('/uploads/') && !fs.existsSync(path.join(__dirname, req.url))) {
    return res.status(404).json({ message: 'File not found' });
  }
  next();
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

