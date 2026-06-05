import User from '../Models/UserSchema.js';
import nodemailer from 'nodemailer';

// Helper function to send email via nodemailer
const sendVerificationEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            if (userExists.verifystatus) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            } else {
                // Delete unverified user to allow re-registration
                await User.deleteOne({ _id: userExists._id });
            }
        }

        // Generate 6-digit verify code
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

        // Get image URL if uploaded
        const image = req.file ? req.file.path : '';

        // Create user (unverified by default)
        const user = await User.create({
            name,
            email,
            phone,
            password,
            image,
            urole: 'user',
            verifystatus: false,
            verifycode
        });

        // HTML email template for registration code
        const htmlMessage = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0b; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
            <div style="background: linear-gradient(135deg, #ff4d94, #4df3ff); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">✨ Welcome to SkinCare</h1>
            </div>
            <div style="padding: 32px; text-align: center;">
                <p style="color: #a1a1aa; font-size: 15px; margin-bottom: 24px;">
                    Thank you for signing up! Please use the verification code below to verify your email address:
                </p>
                <div style="background: #1a1a1d; border: 2px solid #ff4d94; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff;">${verifycode}</span>
                </div>
                <p style="color: #71717a; font-size: 13px;">
                    Please enter this code on the verification screen to complete your registration.
                </p>
                <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
                <p style="color: #52525b; font-size: 12px;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        </div>`;

        try {
            await sendVerificationEmail({
                email: user.email,
                subject: 'SkinCare - Email Verification Code',
                html: htmlMessage
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful. Verification code has been sent to your email.'
            });
        } catch (err) {
            console.error('Email sending failed:', err);
            // Delete user if email fails to prevent orphaned unverified users
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ success: false, message: 'Email could not be sent. Registration cancelled.', error: err.message });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Verify registered user
// @route   POST /api/auth/verify-user
// @access  Public
export const verifyUser = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ success: false, message: 'Please provide email and verification code' });
        }

        const user = await User.findOne({ email, verifycode: code.toString() });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid verification code or email' });
        }

        user.verifystatus = true;
        user.verifycode = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now login.'
        });
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

        // Check if email is verified
        if (!user.verifystatus) {
            return res.status(401).json({ success: false, message: 'Please verify your email first' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Forgot password - send 6-digit code
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide email' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        // Generate 6-digit forgot passcode
        const forgotpasscode = Math.floor(100000 + Math.random() * 900000).toString();

        user.forgotpasscode = forgotpasscode;
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
                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff;">${forgotpasscode}</span>
                </div>
                <p style="color: #71717a; font-size: 13px;">
                    This code can be used to reset your password.
                </p>
                <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
                <p style="color: #52525b; font-size: 12px;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        </div>`;

        try {
            await sendVerificationEmail({
                email: user.email,
                subject: 'SkinCare - Password Reset Code',
                html: htmlMessage,
            });

            res.status(200).json({ success: true, message: 'Verification code sent to your email' });
        } catch (err) {
            console.error(err);
            user.forgotpasscode = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, message: 'Email could not be sent', error: err.message });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Verify reset code
// @route   POST /api/auth/verify-code
// @access  Public
export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ success: false, message: 'Please provide email and code' });
        }

        const user = await User.findOne({
            email,
            forgotpasscode: code.toString()
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
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;

        if (!email || !code || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email, code, and new password' });
        }

        const user = await User.findOne({
            email,
            forgotpasscode: code.toString()
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        // Set new password
        user.password = password;
        user.forgotpasscode = undefined;
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
            urole: user.urole
        }
    });
};
