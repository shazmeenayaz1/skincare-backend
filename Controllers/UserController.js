import User from '../Models/UserSchema.js';

// @desc    Get current logged in user
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {};
        if (req.body.name) fieldsToUpdate.name = req.body.name;
        if (req.body.phone) fieldsToUpdate.phone = req.body.phone;
        if (req.file) fieldsToUpdate.image = req.file.path; // Image uploaded via Cloudinary middleware

        // Email cannot be updated (restricted as per instructions)
        if (req.body.email) {
            return res.status(400).json({
                success: false,
                message: 'Email address cannot be updated'
            });
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update password
// @route   PUT /api/users/updatepassword
// @access  Private
export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({ success: false, message: 'Password is incorrect' });
        }

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const addUserAdmin = async (req, res) => {
    try {
        const { name, email, phone, password, role, status } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Map role to urole
        let urole = 'user';
        if (role && role.toLowerCase() === 'admin') {
            urole = 'admin';
        }

        // Map status to verifystatus
        const verifystatus = (status === 'Active' || status === true);

        const user = await User.create({
            name,
            email,
            phone: phone || '0000000000',
            password: password || 'password123',
            urole,
            verifystatus
        });

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update user details & role/status (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserAdmin = async (req, res) => {
    try {
        const { name, email, phone, role, status } = req.body;

        // Map role to urole
        let urole = 'user';
        if (role && role.toLowerCase() === 'admin') {
            urole = 'admin';
        }

        // Map status to verifystatus
        const verifystatus = (status === 'Active' || status === true);

        const fieldsToUpdate = {
            name,
            email,
            urole,
            verifystatus
        };

        if (phone) {
            fieldsToUpdate.phone = phone;
        }

        const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
