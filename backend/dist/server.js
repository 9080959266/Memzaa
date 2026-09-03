"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_js_1 = require("./config/db.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const User_js_1 = require("./models/User.js");
const seed_js_1 = require("./seeds/seed.js");
// Route Imports
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const studio_routes_js_1 = __importDefault(require("./routes/studio.routes.js"));
const category_routes_js_1 = __importDefault(require("./routes/category.routes.js"));
const package_routes_js_1 = __importDefault(require("./routes/package.routes.js"));
const booking_routes_js_1 = __importDefault(require("./routes/booking.routes.js"));
const product_routes_js_1 = __importDefault(require("./routes/product.routes.js"));
const cart_routes_js_1 = __importDefault(require("./routes/cart.routes.js"));
const order_routes_js_1 = __importDefault(require("./routes/order.routes.js"));
const photojob_routes_js_1 = __importDefault(require("./routes/photojob.routes.js"));
const proof_routes_js_1 = __importDefault(require("./routes/proof.routes.js"));
const payment_routes_js_1 = __importDefault(require("./routes/payment.routes.js"));
const review_routes_js_1 = __importDefault(require("./routes/review.routes.js"));
const coupon_routes_js_1 = __importDefault(require("./routes/coupon.routes.js"));
const wishlist_routes_js_1 = __importDefault(require("./routes/wishlist.routes.js"));
const notification_routes_js_1 = __importDefault(require("./routes/notification.routes.js"));
const invoice_routes_js_1 = __importDefault(require("./routes/invoice.routes.js"));
const upload_routes_js_1 = __importDefault(require("./routes/upload.routes.js"));
const shopowner_routes_js_1 = __importDefault(require("./routes/shopowner.routes.js"));
const admin_routes_js_1 = __importDefault(require("./routes/admin.routes.js"));
dotenv_1.default.config();
const uploadsDir = path_1.default.resolve(process.cwd(), 'uploads');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Initialize DB and Auto-Seed if empty
const startServer = async () => {
    await (0, db_js_1.connectDB)();
    // Auto-seed demo data if empty
    const userCount = await User_js_1.User.countDocuments();
    if (userCount === 0) {
        console.log('📦 Database is empty. Auto-populating rich Indian photography marketplace demo data...');
        await (0, seed_js_1.seedDatabase)();
    }
    // Middleware
    app.use((0, cors_1.default)({
        origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
        credentials: true
    }));
    app.use(express_1.default.json({ limit: '30mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '30mb' }));
    app.use((0, morgan_1.default)('dev'));
    // Static uploads folder
    const uploadsPath = path_1.default.join(process.cwd(), 'uploads');
    app.use('/uploads', express_1.default.static(uploadsPath));
    // API Routes
    app.use('/api/auth', auth_routes_js_1.default);
    app.use('/api/studios', studio_routes_js_1.default);
    app.use('/api/categories', category_routes_js_1.default);
    app.use('/api/packages', package_routes_js_1.default);
    app.use('/api/bookings', booking_routes_js_1.default);
    app.use('/api/products', product_routes_js_1.default);
    app.use('/api/cart', cart_routes_js_1.default);
    app.use('/api/orders', order_routes_js_1.default);
    app.use('/api/photo-jobs', photojob_routes_js_1.default);
    app.use('/api/proofs', proof_routes_js_1.default);
    app.use('/api/payments', payment_routes_js_1.default);
    app.use('/api/reviews', review_routes_js_1.default);
    app.use('/api/coupons', coupon_routes_js_1.default);
    app.use('/api/wishlist', wishlist_routes_js_1.default);
    app.use('/api/notifications', notification_routes_js_1.default);
    app.use('/api/invoices', invoice_routes_js_1.default);
    app.use('/api/upload', upload_routes_js_1.default);
    app.use('/api/seller', shopowner_routes_js_1.default);
    app.use('/api/admin', admin_routes_js_1.default);
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
    app.use(errorHandler_js_1.errorHandler);
    app.listen(PORT, () => {
        console.log(`🚀 MEMORA Server running on http://localhost:${PORT}`);
        console.log(`📸 Tagline: "Capture Moments. Create Memories."`);
    });
};
startServer().catch(err => {
    console.error('Failed to start server:', err);
});
exports.default = app;
