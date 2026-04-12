require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');

// Import Routes
const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const destinationRoutes = require('./routes/destinations');
const enquiryRoutes = require('./routes/enquiries');
const pageRoutes = require('./routes/pages');
const uploadRoutes = require('./routes/uploads');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const toolRoutes = require('./routes/tools');
const settingsRoutes = require('./routes/settings');
const searchRoutes = require('./routes/search');
const homepageRoutes = require('./routes/homepage');
const analyticsRoutes = require('./routes/analytics');
const seoToolsRoutes = require('./routes/seo-tools');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Proxy for Cloudflare/Nginx
app.set('trust proxy', 1);

// CRITICAL SECURITY CHECK
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in .env');
  process.exit(1);
}

// Initializations
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://yatravi.com',
  'https://www.yatravi.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(cookieParser());

// Custom Logger / Live Sync Header
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// API Routes
app.get('/api/debug-ping', (req, res) => res.json({ message: 'Pong! Server is active and updated.', timestamp: new Date() }));

// Brute Force Search Route (Directly in index.js to avoid router issues)
app.get('/api/packages-search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ packages: [], destinations: [] });
    const Package = require('./models/Package');
    const Destination = require('./models/Destination');
    const regex = new RegExp(query, 'i');
    const [packages, destinations] = await Promise.all([
      Package.find({ status: 'published', $or: [{ title: regex }, { location: regex }] }).limit(10).lean(),
      Destination.find({ $or: [{ name: regex }, { tagline: regex }] }).limit(10).lean()
    ]);
    res.json({ packages, destinations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/search', searchRoutes);
app.get('/api/test-search', (req, res) => res.json({ message: 'Search route is reachable' }));
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/upload', uploadRoutes); 
app.use('/api/images', uploadRoutes); 
app.use('/api/admin/seo-tools', seoToolsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', toolRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/analytics', analyticsRoutes);

// API 404 Handler (Enforce JSON)
app.use('/api', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    path: req.originalUrl,
    message: 'The requested API endpoint does not exist on this server.'
  });
});

// Root Route (JSON)
app.get('/', (req, res) => {
  res.json({ message: 'Yatravi API is active', status: 'ready', version: '1.2.0' });
});

// Global Error Handler (JSON)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    status: err.status || 500
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});