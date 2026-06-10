import Order from '../Models/OrderSchema.js';
import Product from '../Models/ProductSchema.js';
import { verifyPaymentIntent } from './StripeController.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { customer, items, paymentMethod, stripePaymentIntentId, subtotal, shipping, total, couponCode, discount } = req.body;

        // Basic verification
        if (!customer || !customer.name || !customer.phone || !customer.email || !customer.address || !customer.city) {
            return res.status(400).json({ success: false, message: 'Missing shipping details.' });
        }
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty.' });
        }

        // Generate Order ID ORD-YYYYMMDD-XXXX
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const orderId = `ORD-${dateStr}-${randomNum}`;

        let maskedCardDetails;
        let paymentStatus = paymentMethod === 'cod' ? 'pending' : 'pending';
        let verifiedPaymentIntentId;

        if (paymentMethod === 'card') {
            if (!stripePaymentIntentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Stripe payment is required for card payments.'
                });
            }

            const existingPaidOrder = await Order.findOne({ stripePaymentIntentId });
            if (existingPaidOrder) {
                return res.status(400).json({
                    success: false,
                    message: 'This payment has already been used for an order.'
                });
            }

            try {
                const { cardDetails } = await verifyPaymentIntent(stripePaymentIntentId, total);
                maskedCardDetails = cardDetails;
                paymentStatus = 'paid';
                verifiedPaymentIntentId = stripePaymentIntentId;
            } catch (paymentError) {
                return res.status(400).json({
                    success: false,
                    message: paymentError.message || 'Payment verification failed.'
                });
            }
        }

        // Create new order instance
        const order = new Order({
            orderId,
            customer,
            items,
            paymentMethod,
            cardDetails: maskedCardDetails,
            stripePaymentIntentId: verifiedPaymentIntentId,
            paymentStatus,
            subtotal,
            shipping,
            total,
            couponCode,
            discount,
            status: 'Pending'
        });

        // Deduct products inventory stock
        for (const item of items) {
            if (item.product) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock_quantity: -item.quantity }
                });
            }
        }

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully!',
            order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: error.message || 'Error processing order.' });
    }
};

// Get all orders (Admin function, or filtered by customer email)
export const getOrders = async (req, res) => {
    try {
        const { email } = req.query;
        const query = email ? { 'customer.email': email } : {};
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: error.message || 'Error fetching orders.' });
    }
};

// Update order status (Admin function)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid order status.' });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully!',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: error.message || 'Error updating status.' });
    }
};
