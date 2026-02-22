import express from 'express';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateToken, protect, requireAdmin } from '../middleware/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';

const router = express.Router();

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/register
 * User registration with email verification
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, name and password are required'
            });
        }

        // Check password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password,
            name,
            tier: 'free',
            verificationToken,
            verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            achievements: [{
                id: 'welcome',
                name: 'Welcome Aboard!',
                description: 'Created your HackTools account',
                icon: '🎉',
                unlockedAt: new Date()
            }]
        });

        // Send verification email (async, don't wait)
        sendVerificationEmail(user.email, user.name, verificationToken).catch(err => {
            console.error('Failed to send verification email:', err);
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Check your email for verification.',
            token,
            user: user.toSafeObject()
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/login
 * User login with email and password
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user and include password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account has been deactivated'
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update login info
        user.lastLogin = new Date();
        user.loginHistory.push({
            timestamp: new Date(),
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        // Keep only last 10 login records
        if (user.loginHistory.length > 10) {
            user.loginHistory = user.loginHistory.slice(-10);
        }

        // Update streak
        user.updateStreak();
        user.resetDailyUsage();

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: user.toSafeObject()
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/google
 * Google OAuth login/registration
 */
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: 'Google credential required'
            });
        }

        // Verify Google token
        let payload;
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            payload = ticket.getPayload();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Google token'
            });
        }

        const { sub: googleId, email, name, picture } = payload;

        // Find or create user
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
            }

            // Update avatar if changed
            if (picture && picture !== user.avatar) {
                user.avatar = picture;
            }

            user.lastLogin = new Date();
            user.updateStreak();
            user.resetDailyUsage();
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                email,
                name,
                googleId,
                avatar: picture,
                tier: 'free',
                emailVerified: true, // Google emails are pre-verified
                achievements: [{
                    id: 'welcome',
                    name: 'Welcome Aboard!',
                    description: 'Created your HackTools account',
                    icon: '🎉',
                    unlockedAt: new Date()
                }]
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Google login successful',
            token,
            user: user.toSafeObject()
        });

    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error: error.message
        });
    }
});

/**
 * GET /api/auth/verify/:token
 * Verify email address
 */
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        // Award achievement
        if (!user.achievements.find(a => a.id === 'verified')) {
            user.achievements.push({
                id: 'verified',
                name: 'Email Verified',
                description: 'Verified your email address',
                icon: '✅',
                unlockedAt: new Date()
            });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully!'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/resend-verification
 * Resend verification email
 */
router.post('/resend-verification', protect, async (req, res) => {
    try {
        const user = req.user;

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
        }

        // Generate new token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        // Send email
        await sendVerificationEmail(user.email, user.name, verificationToken);

        res.json({
            success: true,
            message: 'Verification email sent'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send verification email',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email required'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        // Don't reveal if user exists
        if (!user) {
            return res.json({
                success: true,
                message: 'If that email exists, a reset link has been sent'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        // Send email
        await sendPasswordResetEmail(user.email, user.name, resetToken);

        res.json({
            success: true,
            message: 'If that email exists, a reset link has been sent'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process request',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/reset-password/:token
 * Reset password with token
 */
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset failed',
            error: error.message
        });
    }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user.toSafeObject()
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user data',
            error: error.message
        });
    }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, avatar, settings } = req.body;
        const user = req.user;

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (settings) {
            user.settings = { ...user.settings, ...settings };
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user.toSafeObject()
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Profile update failed',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal mainly)
 */
router.post('/logout', protect, (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

export default router;
