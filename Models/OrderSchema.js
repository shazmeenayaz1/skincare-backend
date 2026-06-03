import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        name: {
            type: String,
            required: [true, 'Customer name is required']
        },
        phone: {
            type: String,
            required: [true, 'Customer phone number is required']
        },
        email: {
            type: String,
            required: [true, 'Customer email is required']
        },
        address: {
            type: String,
            required: [true, 'Customer address is required']
        },
        city: {
            type: String,
            required: [true, 'Customer city is required']
        }
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        image: {
            type: String
        }
    }],
    paymentMethod: {
        type: String,
        enum: ['cod', 'card'],
        default: 'cod'
    },
    cardDetails: {
        name: String,
        number: String,
        expiry: String
    },
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
