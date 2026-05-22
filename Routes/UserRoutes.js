import express from 'express';
import { getProfile, updateProfile, updatePassword } from '../Controllers/UserController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all routes in this router

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/updatepassword', updatePassword);

export default router;
