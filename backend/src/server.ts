import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { User } from './models/User.js';
import { seedDatabase } from './seeds/seed.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import studioRoutes from './routes/studio.routes.js';
import categoryRoutes from './routes/category.routes.js';
import packageRoutes from './routes/package.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import photojobRoutes from './routes/photojob.routes.js';
import proofRoutes from './routes/proof.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import shopownerRoutes from './routes/shopowner.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const uploadsDir = path.resolve(process.cwd(), 'uploads');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize DB and Auto-Seed if empty
const startServer = async () => {
  await connectDB();

  // Auto-seed demo data if empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('📦 Database is empty. Auto-populating rich Indian photography marketplace demo data...');
    await seedDatabase();
  }

  // Middleware
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
  }));
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));
  app.use(morgan('dev'));

  // Static uploads folder
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/studios', studioRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/photo-jobs', photojobRoutes);
  app.use('/api/proofs', proofRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/invoices', invoiceRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/seller', shopownerRoutes);
  app.use('/api/admin', adminRoutes);

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      appName: 'MEMORA API',
      tagline: 'Capture Moments. Create Memories.',
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀 MEMORA Server running on http://localhost:${PORT}`);
    console.log(`📸 Tagline: "Capture Moments. Create Memories."`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

export default app;
