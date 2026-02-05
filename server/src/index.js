import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { createWebSocketServer } from './config/websocket.js';

// Import middleware
import { requestLogger, rateLimitLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler, setupUnhandledRejectionHandler, AppError } from './middleware/errorHandler.js';
import ssrfProtection from './middleware/ssrfProtection.js';

// Import routes
import cveRoutes from './routes/cve.js';
import exploitRoutes from './routes/exploits.js';
import scanRoutes from './routes/scan.js';
import sslRoutes from './routes/ssl.js';
import dnsRoutes from './routes/dns.js';
import threatRoutes from './routes/threat.js';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/report.js';
import subdomainRoutes from './routes/subdomain.js';

dotenv.config();
// MongoDB is now optional - see .env file

// Setup unhandled rejection handlers
setupUnhandledRejectionHandler();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (for Render, Heroku, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}));

// Request logging middleware (must be early)
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        error: 'Too many requests',
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        rateLimitLogger(req, res);
        res.status(429).json({
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: Math.ceil(req.rateLimit.resetTime.getTime() - Date.now()) / 1000
        });
    }
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            throw new AppError('Invalid JSON', 400);
        }
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        requestId: req.id
    });
});

// SSRF Protection middleware for routes that accept URLs
app.use('/api/scan', ssrfProtection);
app.use('/api/ssl', ssrfProtection);
app.use('/api/threat', ssrfProtection);

// API Routes
app.use('/api/cve', cveRoutes);
app.use('/api/exploits', exploitRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/ssl', sslRoutes);
app.use('/api/dns', dnsRoutes);
app.use('/api/threat', threatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/subdomain', subdomainRoutes);

// 404 handler
app.use('*', notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
    try {
        // Connect to MongoDB (optional - works without DB too)
        if (process.env.MONGODB_URI) {
            await connectDB();
            console.log('✅ MongoDB connected');
        } else {
            console.log('⚠️  Running without database (localStorage fallback)');
        }

        // Start HTTP server
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 HackWebTools Backend Server Started');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📡 Port: ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
            console.log(`❤️  Health: http://localhost:${PORT}/health`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        });

        // Initialize WebSocket server
        createWebSocketServer(server);
        console.log('🔌 WebSocket server initialized on /ws\n');

        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            server.close(() => {
                console.log('✅ HTTP server closed');
                process.exit(0);
            });

            // Force close after 10 seconds
            setTimeout(() => {
                console.error('⚠️  Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
