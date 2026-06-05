import express from 'express';
import { register, login, forgotPassword, verifyCode, resetPassword, verifyUser } from '../Controllers/AuthController.js';
import upload from '../Middleware/Upload.js';

const router = express.Router();

router.post('/register', upload.single('image'), register);
router.post('/verify-user', verifyUser);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

export default router;
