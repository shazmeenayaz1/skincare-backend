import express from 'express';
import { register, login, forgotPassword, verifyCode, resetPassword } from '../Controllers/AuthController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

export default router;
