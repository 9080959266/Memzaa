import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Delivery } from '../models/Delivery.js';
import { Order } from '../models/Order.js';

export const getDeliveryByOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    let delivery = await Delivery.findOne({ orderId }).populate('orderId');

    if (!delivery) {
      // Find order to auto-generate delivery tracking if not yet created
      const order = await Order.findById(orderId);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      delivery = await Delivery.create({
        orderId: order._id,
        trackingNumber: `MEM-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        courierName: 'Blue Dart Air Express',
        senderAddress: {
          name: 'MEMORA Hub Chennai',
          phone: '+91 98400 11223',
          street: '42, Industrial Estate, Guindy',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600032',
        },
        deliveryAddress: {
          fullName: order.shippingAddress.fullName,
          phone: order.shippingAddress.phone,
          street: order.shippingAddress.street,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode,
        },
        estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: order.currentStatus === 'DELIVERED' ? 'delivered' : 'in_transit',
        trackingTimeline: [
          {
            stage: 'Order Confirmed',
            location: 'Chennai Central Hub',
            description: 'Order confirmed and registered for courier dispatch.',
            timestamp: new Date(order.createdAt),
          },
          {
            stage: 'Quality Checked & Packed',
            location: 'Guindy Production Facility',
            description: 'Custom keepsake framed, inspected, and bubble wrapped.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          {
            stage: 'Picked Up by Blue Dart',
            location: 'Guindy Hub, Chennai',
            description: 'Airway bill generated and handover completed.',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          },
          {
            stage: 'In Transit',
            location: 'Regional Sorting Facility',
            description: 'Package en route to local delivery facility.',
            timestamp: new Date(),
          },
        ],
      });
    }

    res.json({
      success: true,
      delivery,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeliveryByTrackingNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trackingNumber } = req.params;
    const delivery = await Delivery.findOne({ trackingNumber }).populate('orderId');

    if (!delivery) {
      res.status(404).json({ success: false, message: 'Tracking number not found.' });
      return;
    }

    res.json({
      success: true,
      delivery,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDeliveryStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, stage, location, description } = req.body;

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      res.status(404).json({ success: false, message: 'Delivery record not found.' });
      return;
    }

    if (status) delivery.status = status;
    if (stage && location) {
      delivery.trackingTimeline.push({
        stage,
        location,
        description: description || `Status updated to ${stage}`,
        timestamp: new Date(),
      });
    }

    await delivery.save();

    res.json({
      success: true,
      message: 'Delivery status updated',
      delivery,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
