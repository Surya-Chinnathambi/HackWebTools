import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Protect routes - require authentication
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Also check cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists or is inactive'
            });
        }

        // Update last login and streak
        user.lastLogin = new Date();
        user.updateStreak();
        user.resetDailyUsage();
        await user.save();

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

/**
 * Require specific tier
 */
export const requireTier = (...tiers) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (!tiers.includes(req.user.tier)) {
            return res.status(403).json({
                success: false,
                message: `This feature requires ${tiers.join(' or ')} tier`,
                requiredTier: tiers
            });
        }

        next();
    };
};

/**
 * Require admin role
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    next();
};

/**
 * Optional auth - attach user if token exists, but don't require it
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (token) {
            const decoded = verifyToken(token);
            if (decoded) {
                const user = await User.findById(decoded.id).select('-password');
                if (user && user.isActive) {
                    req.user = user;
                }
            }
        }

        next();
    } catch (error) {
        // Ignore errors and continue without auth
        next();
    }
};

/**
 * Check usage limits
 */
export const checkUsageLimit = (limitType) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Reset daily usage if needed
        req.user.resetDailyUsage();

        const limits = {
            free: {
                scans: 10,
                apiCalls: 50,
                labs: 3
            },
            pro: {
                scans: -1, // unlimited
                apiCalls: 10000,
                labs: -1
            },
            enterprise: {
                scans: -1,
                apiCalls: -1,
                labs: -1
            }
        };

        const userLimits = limits[req.user.tier];
        const limit = userLimits[limitType];

        // -1 means unlimited
        if (limit === -1) {
            return next();
        }

        const usageKey = `${limitType}${limitType === 'labs' ? 'ThisMonth' : 'Today'}`;
        const currentUsage = req.user.usage[usageKey];

        if (currentUsage >= limit) {
            return res.status(429).json({
                success: false,
                message: `Daily limit reached for ${limitType}`,
                limit,
                currentUsage,
                upgradeRequired: true
            });
        }

        // Increment usage
        req.user.usage[usageKey] += 1;
        await req.user.save();

        next();
    };
};
