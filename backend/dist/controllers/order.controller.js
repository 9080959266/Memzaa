"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrdersAdmin = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const Order_js_1 = require("../models/Order.js");
const Cart_js_1 = require("../models/Cart.js");
const Invoice_js_1 = require("../models/Invoice.js");
const PhotoJob_js_1 = require("../models/PhotoJob.js");
const Studio_js_1 = require("../models/Studio.js");
const Notification_js_1 = require("../models/Notification.js");
const ORDER_STAGES = [
    { status: 'ORDER_PLACED', title: 'Order Placed', description: 'Order received and logged in system' },
    { status: 'PAYMENT_CONFIRMED', title: 'Payment Confirmed', description: 'Payment verified via Razorpay / UPI' },
    { status: 'PHOTOS_UPLOADED', title: 'Photos Uploaded', description: 'Customer uploaded high-resolution assets' },
    { status: 'EDITING', title: 'Editing & Retouching', description: 'Color grading, cropping & layout setup' },
    { status: 'PROOF_READY', title: 'Proof Ready for Review', description: 'Digital draft generated for client review' },
    { status: 'CUSTOMER_APPROVED', title: 'Proof Approved', description: 'Customer approved digital proof' },
    { status: 'PRINTING', title: 'Printing & Framing', description: 'High-definition archival printing & framing' },
    { status: 'QUALITY_CHECK', title: 'Quality Inspection (QC)', description: '300 DPI, color fidelity & packaging check' },
    { status: 'READY', title: 'Ready for Dispatch', description: 'Secure packaging complete with invoice' },
    { status: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', description: 'Dispatched via express courier partner' },
    { status: 'DELIVERED', title: 'Delivered', description: 'Package handed over to recipient' }
];
const createOrder = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Please login to checkout' });
            return;
        }
        const { shippingAddress, paymentMethod = 'razorpay', transactionId } = req.body;
        let cart = await Cart_js_1.Cart.findOne({ userId: req.user.id })
            .populate('items.productId')
            .populate({
            path: 'items.packageId',
            populate: [
                { path: 'studioId', select: 'name city logoImage rating address' },
                { path: 'categoryId', select: 'name slug' }
            ]
        });
        let orderItems = [];
        let subtotal = 0;
        let discount = 0;
        let couponCode = undefined;
        let shippingFee = 0;
        let totalAmount = 0;
        if (cart && cart.items.length > 0) {
            orderItems = cart.items.map((item) => {
                if (item.itemType === 'package' || item.packageId) {
                    const pkg = item.packageId;
                    return {
                        itemType: 'package',
                        packageId: pkg?._id || item.packageId,
                        studioId: pkg?.studioId?._id || item.studioId,
                        title: pkg?.title || item.title || 'Photoshoot Package',
                        category: pkg?.categoryId?.name || pkg?.category || 'Photoshoot Package',
                        thumbnail: pkg?.bannerImage || pkg?.thumbnail || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
                        quantity: item.quantity || 1,
                        price: item.unitPrice || pkg?.discountPrice || pkg?.price || 4999,
                        customization: item.customization,
                        itemTotal: item.itemTotal || ((item.unitPrice || 4999) * (item.quantity || 1))
                    };
                }
                else {
                    const p = item.productId;
                    return {
                        itemType: 'product',
                        productId: p?._id || item.productId,
                        title: p?.title || item.title || 'Personalized Keepsake',
                        category: p?.category || 'Frames',
                        thumbnail: p?.thumbnail || item.thumbnail || item.customization?.uploadedPhoto || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
                        quantity: item.quantity || 1,
                        price: item.unitPrice || p?.discountPrice || p?.basePrice || 999,
                        customization: item.customization,
                        itemTotal: item.itemTotal || ((item.unitPrice || 999) * (item.quantity || 1))
                    };
                }
            });
            subtotal = cart.subtotal;
            discount = cart.discount;
            couponCode = cart.couponCode;
            shippingFee = cart.deliveryFee;
            totalAmount = cart.total;
        }
        else if (req.body.items && req.body.items.length > 0) {
            orderItems = req.body.items.map((item) => ({
                itemType: item.itemType || (item.packageId ? 'package' : 'product'),
                productId: item.productId || (!item.packageId ? item._id : undefined),
                packageId: item.packageId,
                studioId: item.studioId,
                title: item.title || item.name || 'Order Item',
                category: item.category || (item.packageId ? 'Photoshoot Package' : 'Frames'),
                thumbnail: item.thumbnail || item.image || item.customization?.uploadedPhoto || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
                quantity: item.quantity || 1,
                price: item.price || item.unitPrice || 999,
                customization: item.customization,
                itemTotal: (item.price || item.unitPrice || 999) * (item.quantity || 1)
            }));
            subtotal = orderItems.reduce((acc, i) => acc + i.itemTotal, 0);
            discount = req.body.discount || 0;
            shippingFee = subtotal > 1500 ? 0 : 99;
            totalAmount = subtotal - discount + shippingFee;
        }
        else {
            res.status(400).json({ success: false, message: 'Your cart is empty. Please add items to checkout.' });
            return;
        }
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
            res.status(400).json({ success: false, message: 'Complete shipping address is required' });
            return;
        }
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderId = `MEM-ORD-${randomSuffix}`;
        // Initialize full timeline
        const timeline = ORDER_STAGES.map((stage, idx) => ({
            status: stage.status,
            title: stage.title,
            description: stage.description,
            timestamp: idx <= 1 ? new Date() : new Date(Date.now() + idx * 86400000),
            completed: idx <= 1,
            updatedBy: idx <= 1 ? 'System' : undefined
        }));
        const order = await Order_js_1.Order.create({
            orderId,
            customerId: req.user.id,
            items: orderItems,
            subtotal,
            discount,
            couponCode,
            shippingFee,
            totalAmount,
            paymentStatus: 'paid',
            paymentMethod,
            transactionId: transactionId || `TXN_${Date.now()}`,
            shippingAddress,
            currentStatus: 'PAYMENT_CONFIRMED',
            timeline,
            trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
            courierName: 'BlueDart Air Express',
            estimatedDelivery: new Date(Date.now() + 5 * 86400000).toDateString()
        });
        // Create Invoice
        const invSuffix = Math.floor(1000 + Math.random() * 9000);
        const invoice = await Invoice_js_1.Invoice.create({
            invoiceNumber: `MEM-INV-${invSuffix}`,
            orderId: order._id,
            userId: req.user.id,
            customerDetails: {
                name: shippingAddress.fullName,
                email: req.user.email,
                phone: shippingAddress.phone,
                address: shippingAddress.street,
                city: shippingAddress.city,
                pincode: shippingAddress.pincode
            },
            items: orderItems.map(i => ({
                description: `${i.title} (${i.category})`,
                quantity: i.quantity,
                unitPrice: i.price,
                taxRate: 18,
                total: i.itemTotal
            })),
            subtotal,
            discount,
            taxAmount: Math.round(subtotal * 0.18),
            grandTotal: totalAmount,
            paymentStatus: 'paid',
            paymentMethod: paymentMethod.toUpperCase(),
            paymentRef: transactionId || `TXN_${Date.now()}`
        });
        order.invoiceId = invoice._id;
        await order.save();
        // Create Photo Job for any customized photo products
        const defaultStudio = await Studio_js_1.Studio.findOne();
        const studioId = defaultStudio ? defaultStudio._id : undefined;
        if (studioId) {
            await PhotoJob_js_1.PhotoJob.create({
                jobId: `MEM-JOB-${Math.floor(1000 + Math.random() * 9000)}`,
                title: `Custom Photo Print Order - ${shippingAddress.fullName}`,
                orderId: order._id,
                studioId,
                customerId: req.user.id,
                stage: 'NEW_ORDER',
                priority: 'medium',
                photos: orderItems
                    .filter(i => i.customization?.uploadedPhoto)
                    .map(i => ({
                    url: i.customization.uploadedPhoto,
                    originalName: 'Customer Upload',
                    status: 'uploaded',
                    uploadedAt: new Date()
                })),
                notes: `Order #${orderId} with ${orderItems.length} items.`
            });
        }
        // Clear cart if it existed
        if (cart) {
            cart.items = [];
            cart.subtotal = 0;
            cart.discount = 0;
            cart.couponCode = undefined;
            cart.total = 0;
            await cart.save();
        }
        // Customer Notification
        await Notification_js_1.Notification.create({
            userId: req.user.id,
            title: 'Order Placed Successfully! 🎁',
            message: `Your order #${orderId} of ₹${order.totalAmount} has been placed. Track live progress anytime!`,
            type: 'order',
            link: `/orders/${order._id}`
        });
        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order,
            invoiceId: invoice._id
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const orders = await Order_js_1.Order.find({ customerId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('invoiceId');
        res.json({
            success: true,
            orders
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyOrders = getMyOrders;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order_js_1.Order.findById(id)
            .populate('customerId', 'name email phone')
            .populate('invoiceId');
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        res.json({
            success: true,
            order
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOrderById = getOrderById;
const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order_js_1.Order.find()
            .sort({ createdAt: -1 })
            .populate('customerId', 'name email phone');
        res.json({
            success: true,
            orders
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllOrdersAdmin = getAllOrdersAdmin;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = req.body.status || req.body.currentStatus;
        const { note } = req.body;
        const order = await Order_js_1.Order.findById(id);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        order.currentStatus = status;
        // Update timeline step
        const stepIndex = order.timeline.findIndex(t => t.status === status);
        if (stepIndex !== -1) {
            order.timeline[stepIndex].completed = true;
            order.timeline[stepIndex].timestamp = new Date();
            if (note)
                order.timeline[stepIndex].description = note;
            order.timeline[stepIndex].updatedBy = req.user?.name || 'Studio Staff';
            // Mark all previous steps as completed
            for (let i = 0; i <= stepIndex; i++) {
                order.timeline[i].completed = true;
            }
        }
        await order.save();
        // Customer Notification
        await Notification_js_1.Notification.create({
            userId: order.customerId,
            title: `Order Update: #${order.orderId}`,
            message: `Your order is now: ${status.replace(/_/g, ' ')}`,
            type: 'order',
            link: `/orders/${order._id}`
        });
        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
