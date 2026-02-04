import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { createWebSocketServer } from './config/websocket.js';

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

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

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
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

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
            console.log(`🚀 HackWebTools Backend running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
        });

        // Initialize WebSocket server
        createWebSocketServer(server);
        console.log('🔌 WebSocket server initialized');

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
