import crypto from 'crypto';

/**
 * Request Logging Middleware
 * Logs all incoming requests with sanitized data
 */

/**
 * Generate unique request ID
 */
const generateRequestId = () => {
    return crypto.randomBytes(16).toString('hex');
};

/**
 * Sanitize sensitive data from logs
 */
const sanitizeData = (data) => {
    if (!data || typeof data !== 'object') return data;

    const sanitized = Array.isArray(data) ? [...data] : { ...data };
    const sensitiveFields = [
        'password',
        'token',
        'apiKey',
        'api_key',
        'secret',
        'authorization',
        'cookie',
        'session',
        'jwt',
        'bearer',
        'credit_card',
        'ssn'
    ];

    const sanitizeObject = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        for (const key of Object.keys(obj)) {
            const lowerKey = key.toLowerCase();

            // Check if field is sensitive
            if (sensitiveFields.some(field => lowerKey.includes(field))) {
                obj[key] = '[REDACTED]';
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Recursively sanitize nested objects
                obj[key] = sanitizeObject(obj[key]);
            }
        }

        return obj;
    };

    return sanitizeObject(sanitized);
};

/**
 * Format log message
 */
const formatLogMessage = (req, res, duration) => {
    const log = {
        requestId: req.id,
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        referer: req.get('referer'),
        query: sanitizeData(req.query),
        body: sanitizeData(req.body),
        params: req.params
    };

    return log;
};

/**
 * Get color for status code
 */
const getStatusColor = (statusCode) => {
    if (statusCode >= 500) return '\x1b[31m'; // Red
    if (statusCode >= 400) return '\x1b[33m'; // Yellow
    if (statusCode >= 300) return '\x1b[36m'; // Cyan
    if (statusCode >= 200) return '\x1b[32m'; // Green
    return '\x1b[0m'; // Reset
};

/**
 * Console log with colors (development)
 */
const consoleLog = (log) => {
    const statusColor = getStatusColor(log.statusCode);
    const methodColor = '\x1b[35m'; // Magenta
    const resetColor = '\x1b[0m';

    console.log(
        `${log.timestamp} ` +
        `[${log.requestId.substring(0, 8)}] ` +
        `${methodColor}${log.method}${resetColor} ` +
        `${log.path} ` +
        `${statusColor}${log.statusCode}${resetColor} ` +
        `${log.duration}`
    );

    // Log additional details for non-GET requests
    if (log.method !== 'GET') {
        if (Object.keys(log.body).length > 0) {
            console.log(`  Body:`, log.body);
        }
    }

    // Log errors
    if (log.statusCode >= 400) {
        console.log(`  IP: ${log.ip}`);
        if (log.userAgent) {
            console.log(`  UA: ${log.userAgent}`);
        }
    }
};

/**
 * Production logging (JSON format)
 */
const productionLog = (log) => {
    // In production, write JSON logs for log aggregation tools
    console.log(JSON.stringify(log));
};

/**
 * Request logger middleware
 */
export const requestLogger = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';

    // Generate and attach request ID
    req.id = generateRequestId();
    res.setHeader('X-Request-ID', req.id);

    // Record start time
    const startTime = Date.now();

    // Capture original res.json to log after response
    const originalJson = res.json.bind(res);
    res.json = function (body) {
        // Calculate duration
        const duration = Date.now() - startTime;

        // Format and log
        const log = formatLogMessage(req, res, duration);

        if (env === 'production') {
            productionLog(log);
        } else {
            consoleLog(log);
        }

        // Call original json method
        return originalJson(body);
    };

    // Handle cases where res.json is not called (e.g., res.send, res.status)
    res.on('finish', () => {
        if (!res.headersSent || res.statusCode === 304) return;

        const duration = Date.now() - startTime;
        const log = formatLogMessage(req, res, duration);

        if (env === 'production') {
            productionLog(log);
        } else {
            // Only log if json() wasn't called
            if (!res.jsonCalled) {
                consoleLog(log);
            }
        }
    });

    next();
};

/**
 * Rate limit logger
 */
export const rateLimitLogger = (req, res) => {
    const log = {
        type: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date().toISOString(),
        requestId: req.id,
        ip: req.ip,
        path: req.path,
        method: req.method
    };

    console.warn('[RATE LIMIT]', JSON.stringify(log));
};

export default requestLogger;
