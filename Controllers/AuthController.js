import User from '../Models/UserSchema.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,

        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Forgot password - send 6-digit code
// @route   POST /auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash code and store
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetCode)
            .digest('hex');

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // HTML email template
        const htmlMessage = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0b; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
            <div style="background: linear-gradient(135deg, #ff4d94, #4df3ff); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🔒 Password Reset</h1>
            </div>
            <div style="padding: 32px; text-align: center;">
                <p style="color: #a1a1aa; font-size: 15px; margin-bottom: 24px;">
                    You requested a password reset for your SkinCare account. Use the verification code below:
                </p>
                <div style="background: #1a1a1d; border: 2px solid #ff4d94; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff;">${resetCode}</span>
                </div>
                <p style="color: #71717a; font-size: 13px;">
                    This code expires in <strong style="color: #ff4d94;">10 minutes</strong>
                </p>
                <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
                <p style="color: #52525b; font-size: 12px;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        </div>`;

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
                to: user.email,
                subject: 'SkinCare - Password Reset Code',
                html: htmlMessage,
            });

            res.status(200).json({ success: true, message: 'Verification code sent to your email' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, message: 'Email could not be sent', error: err.message });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Verify reset code
// @route   POST /auth/verify-code
// @access  Public
export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const hashedCode = crypto
            .createHash('sha256')
            .update(code.toString())
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken: hashedCode,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        res.status(200).json({ success: true, message: 'Code verified successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Reset password with code
// @route   POST /auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;

        const hashedCode = crypto
            .createHash('sha256')
            .update(code.toString())
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken: hashedCode,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
