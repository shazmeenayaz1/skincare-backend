import express from 'express';
import { getStripeConfig, createPaymentIntent } from '../Controllers/StripeController.js';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-payment-intent', createPaymentIntent);

export default router;
