import express from 'express';
import { 
    getProfile, 
    updateProfile, 
    updatePassword, 
    getAllUsers, 
    addUserAdmin, 
    updateUserAdmin, 
    deleteUser 
} from '../Controllers/UserController.js';
import { protect, authorize } from '../Middleware/authMiddleware.js';
import upload from '../Middleware/Upload.js';

const router = express.Router();

router.use(protect); // Protect all routes in this router

// Profile routes (Any logged in user)
router.get('/profile', getProfile);
router.put('/profile', upload.single('image'), updateProfile);
router.put('/updatepassword', updatePassword);

// Administrative User Management routes (Admin only)
router.get('/', authorize('admin'), getAllUsers);
router.post('/', authorize('admin'), addUserAdmin);
router.put('/:id', authorize('admin'), updateUserAdmin);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
