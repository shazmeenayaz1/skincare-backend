import Order from '../Models/OrderSchema.js';
import Product from '../Models/ProductSchema.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { customer, items, paymentMethod, cardDetails, subtotal, shipping, total, couponCode, discount } = req.body;

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

        // Mask Card number if it was credit card payment
        let maskedCardDetails = undefined;
        if (paymentMethod === 'card' && cardDetails) {
            const num = cardDetails.number || '';
            const last4 = num.replace(/\s/g, '').slice(-4);
            maskedCardDetails = {
                name: cardDetails.name,
                number: last4 ? `**** **** **** ${last4}` : '',
                expiry: cardDetails.expiry
            };
        }

        // Create new order instance
        const order = new Order({
            orderId,
            customer,
            items,
            paymentMethod,
            cardDetails: maskedCardDetails,
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

// Get all orders (Admin function)
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
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
