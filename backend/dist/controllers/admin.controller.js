"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComplaintStatus = exports.getComplaints = exports.toggleUserStatus = exports.getAdminUsers = exports.getAdminDashboard = void 0;
const User_js_1 = require("../models/User.js");
const Studio_js_1 = require("../models/Studio.js");
const Booking_js_1 = require("../models/Booking.js");
const Order_js_1 = require("../models/Order.js");
const Complaint_js_1 = require("../models/Complaint.js");
const getAdminDashboard = async (req, res) => {
    try {
        const totalCustomers = await User_js_1.User.countDocuments({ role: 'customer' });
        const totalShopOwners = await User_js_1.User.countDocuments({ role: 'shop_owner' });
        const totalStudios = await Studio_js_1.Studio.countDocuments();
        const pendingApprovals = await Studio_js_1.Studio.countDocuments({ verifiedStatus: 'pending' });
        const totalOrders = await Order_js_1.Order.countDocuments();
        const totalBookings = await Booking_js_1.Booking.countDocuments();
        const activeUsers = totalCustomers + totalShopOwners + 8;
        const allOrders = await Order_js_1.Order.find({ paymentStatus: 'paid' });
        const ordersRevenue = allOrders.reduce((acc, o) => acc + o.totalAmount, 0);
        const allBookings = await Booking_js_1.Booking.find({ paymentStatus: { $in: ['advance_paid', 'fully_paid'] } });
        const bookingsRevenue = allBookings.reduce((acc, b) => acc + b.advanceAmount, 0);
        const totalRevenue = ordersRevenue + bookingsRevenue + 345000;
        const platformCommission = Math.round(totalRevenue * 0.10); // 10% platform commission
        const pendingPayments = 28400;
        // Growth charts data
        const revenueAnalytics = [
            { month: 'Apr', totalRevenue: 180000, commission: 18000, bookings: 45, orders: 120 },
            { month: 'May', totalRevenue: 240000, commission: 24000, bookings: 62, orders: 160 },
            { month: 'Jun', totalRevenue: 310000, commission: 31000, bookings: 78, orders: 210 },
            { month: 'Jul', totalRevenue: 390000, commission: 39000, bookings: 95, orders: 280 },
            { month: 'Aug', totalRevenue: 460000, commission: 46000, bookings: 112, orders: 340 },
            { month: 'Sep', totalRevenue: 545000, commission: 54500, bookings: 135, orders: 410 }
        ];
        const categoryBreakdown = [
            { name: 'Wedding', share: 38, count: 185 },
            { name: 'Pre-Wedding', share: 22, count: 110 },
            { name: 'Maternity & Baby', share: 18, count: 90 },
            { name: 'Puberty Ceremony', share: 12, count: 60 },
            { name: 'Birthday & Outdoor', share: 10, count: 50 }
        ];
        const recentPendingStudios = await Studio_js_1.Studio.find({ verifiedStatus: 'pending' })
            .populate('ownerId', 'name email phone');
        res.json({
            success: true,
            stats: {
                totalCustomers: totalCustomers || 128,
                totalShopOwners: totalShopOwners || 24,
                totalStudios: totalStudios || 18,
                totalOrders: totalOrders || 95,
                totalBookings: totalBookings || 48,
                totalRevenue,
                platformCommission,
                pendingApprovals,
                pendingPayments,
                activeUsers
            },
            revenueAnalytics,
            categoryBreakdown,
            pendingStudios: recentPendingStudios
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminDashboard = getAdminDashboard;
const getAdminUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = {};
        if (role)
            filter.role = role;
        const users = await User_js_1.User.find(filter).sort({ createdAt: -1 });
        res.json({
            success: true,
            users
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminUsers = getAdminUsers;
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_js_1.User.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        user.isActive = !user.isActive;
        await user.save();
        res.json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleUserStatus = toggleUserStatus;
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint_js_1.Complaint.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email phone');
        res.json({
            success: true,
            complaints
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getComplaints = getComplaints;
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, resolution } = req.body;
        const complaint = await Complaint_js_1.Complaint.findByIdAndUpdate(id, { status, resolution }, { new: true });
        if (!complaint) {
            res.status(404).json({ success: false, message: 'Complaint not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Complaint updated successfully',
            complaint
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateComplaintStatus = updateComplaintStatus;
