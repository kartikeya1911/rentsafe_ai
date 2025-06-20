import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import propertyRoutes from './routes/properties.js';
import agreementRoutes from './routes/agreements.js';
import reviewRoutes from './routes/reviews.js';
import notificationRoutes from './routes/notifications.js';
import aiRoutes from './routes/ai.js';
import blockchainRoutes from './routes/blockchain.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agreements', authenticateToken, agreementRoutes);
app.use('/api/reviews', authenticateToken, reviewRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/api/blockchain', authenticateToken, blockchainRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// MongoDB connection with error handling
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rentsafe_ai', {
      serverSelectionTimeoutMS: 5050, // Timeout after 5s instead of 30s
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.log('📝 Server will continue running without database connection');
    console.log('💡 To fix this: Ensure MongoDB is running or provide a valid MONGODB_URI in .env');
  }
};

connectToMongoDB();

// Schedule rent due notifications (runs daily at 9 AM)
cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Running daily rent notification check...');
  // This would check for upcoming rent due dates and send notifications
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});