/**
 * Secure Error Handler Middleware
 * Prevents information leakage in production
 */

class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Sanitize error message to prevent information leakage
 */
const sanitizeErrorMessage = (error, env) => {
    // In production, hide detailed error messages
    if (env === 'production') {
        // Map specific errors to safe messages
        if (error.message.includes('ENOTFOUND')) {
            return 'Resource not found';
        }
        if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
            return 'Request timeout';
        }
        if (error.message.includes('ECONNREFUSED')) {
            return 'Service temporarily unavailable';
        }
        if (error.code === 'ECONNRESET' || error.code === 'EPIPE') {
            return 'Connection error';
        }

        return 'An error occurred while processing your request';
    }

    return error.message;
};

/**
 * Format error response
 */
const formatErrorResponse = (error, req, env) => {
    const statusCode = error.statusCode || 500;
    const isOperational = error.isOperational !== false;

    const response = {
        status: 'error',
        message: sanitizeErrorMessage(error, env),
        requestId: req.id || 'unknown',
        timestamp: new Date().toISOString()
    };

    // Add additional info in development
    if (env === 'development') {
        response.error = {
            message: error.message,
            stack: error.stack,
            code: error.code,
            ...error
        };
        response.request = {
            method: req.method,
            url: req.originalUrl,
            body: sanitizeRequestBody(req.body),
            query: req.query,
            params: req.params
        };
    }

    // Add operational error details (safe to expose)
    if (isOperational && error.details) {
        response.details = error.details;
    }

    return { statusCode, response };
};

/**
 * Sanitize request body for logging (remove sensitive data)
 */
const sanitizeRequestBody = (body) => {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization'];

    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    }

    return sanitized;
};

/**
 * Log error securely
 */
const logError = (error, req, env) => {
    const logData = {
        timestamp: new Date().toISOString(),
        requestId: req.id || 'unknown',
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        error: {
            message: error.message,
            stack: env === 'development' ? error.stack : undefined,
            code: error.code,
            statusCode: error.statusCode
        }
    };

    // In production, use proper logging service
    if (env === 'production') {
        // TODO: Send to logging service (e.g., Winston, Sentry, CloudWatch)
        console.error('[ERROR]', JSON.stringify(logData));
    } else {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ Error Details:');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error(`Time: ${logData.timestamp}`);
        console.error(`Request: ${logData.method} ${logData.url}`);
        console.error(`IP: ${logData.ip}`);
        console.error(`Message: ${error.message}`);
        if (error.stack) {
            console.error(`Stack:\n${error.stack}`);
        }
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    const env = process.env.NODE_ENV || 'development';

    // Log the error
    logError(err, req, env);

    // Format and send response
    const { statusCode, response } = formatErrorResponse(err, req, env);

    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    res.status(statusCode).json(response);
};

/**
 * Async handler wrapper to catch promise rejections
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
};

/**
 * Unhandled rejection handler
 */
export const setupUnhandledRejectionHandler = () => {
    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Promise Rejection:', reason);
        console.error('Promise:', promise);
        // In production, you might want to restart the process
        if (process.env.NODE_ENV === 'production') {
            // Graceful shutdown
            process.exit(1);
        }
    });

    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', error);
        // In production, always exit on uncaught exceptions
        process.exit(1);
    });
};

export { AppError };

export default {
    errorHandler,
    asyncHandler,
    notFoundHandler,
    setupUnhandledRejectionHandler,
    AppError
};
