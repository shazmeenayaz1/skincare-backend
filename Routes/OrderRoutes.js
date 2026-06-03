import express from 'express';
import {
    createOrder,
    getOrders,
    updateOrderStatus
} from '../Controllers/OrderController.js';

const router = express.Router();

// Public route to place orders (so guests can purchase items)
router.post('/post', createOrder);

// Public routes (authorization checks removed for testing/access)
router.get('/get', getOrders);
router.put('/update-status/:id', updateOrderStatus);

export default router;
