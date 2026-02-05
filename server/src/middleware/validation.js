import validator from 'validator';

/**
 * Input validation and sanitization middleware
 */

// Sanitize string input
export const sanitizeString = (str) => {
    if (!str || typeof str !== 'string') return '';

    // Remove null bytes
    str = str.replace(/\0/g, '');

    // Trim whitespace
    str = str.trim();

    // Escape HTML to prevent XSS
    str = validator.escape(str);

    return str;
};

// Validate and sanitize domain name
export const validateDomain = (domain) => {
    if (!domain || typeof domain !== 'string') {
        throw new Error('Domain is required and must be a string');
    }

    // Remove protocol, path, port
    let cleanDomain = domain.toLowerCase().trim();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    cleanDomain = cleanDomain.split('/')[0];
    cleanDomain = cleanDomain.split(':')[0];

    // Check for command injection attempts
    const dangerousChars = /[;&|`$(){}[\]<>'"\\]/;
    if (dangerousChars.test(cleanDomain)) {
        throw new Error('Invalid characters in domain name');
    }

    // Validate domain format
    if (!validator.isFQDN(cleanDomain, { require_tld: true, allow_underscores: false })) {
        throw new Error('Invalid domain format');
    }

    // Additional length check
    if (cleanDomain.length > 253) {
        throw new Error('Domain name too long');
    }

    return cleanDomain;
};

// Validate IP address
export const validateIP = (ip) => {
    if (!ip || typeof ip !== 'string') {
        throw new Error('IP address is required and must be a string');
    }

    const cleanIP = ip.trim();

    if (!validator.isIP(cleanIP, 4) && !validator.isIP(cleanIP, 6)) {
        throw new Error('Invalid IP address format');
    }

    // Block private/internal IP ranges for SSRF protection
    const privateRanges = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^127\./,
        /^169\.254\./,
        /^::1$/,
        /^fc00:/,
        /^fe80:/,
        /^localhost$/i
    ];

    for (const range of privateRanges) {
        if (range.test(cleanIP)) {
            throw new Error('Private/internal IP addresses are not allowed');
        }
    }

    return cleanIP;
};

// Validate URL with SSRF protection
export const validateURL = (url, options = {}) => {
    if (!url || typeof url !== 'string') {
        throw new Error('URL is required and must be a string');
    }

    const cleanURL = url.trim();

    // Validate URL format
    if (!validator.isURL(cleanURL, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true
    })) {
        throw new Error('Invalid URL format');
    }

    // Parse URL to check hostname
    let hostname;
    try {
        const urlObj = new URL(cleanURL);
        hostname = urlObj.hostname;

        // Check for IP addresses in URL
        if (validator.isIP(hostname)) {
            // Block private IPs
            validateIP(hostname); // This will throw if private
        }

        // Block localhost variants
        if (/localhost|127\.0\.0\.1|::1/i.test(hostname)) {
            throw new Error('Localhost URLs are not allowed');
        }

        // Block internal domains if specified
        if (options.blockInternalDomains) {
            const internalDomains = ['.local', '.internal', '.lan', '.corp'];
            if (internalDomains.some(d => hostname.endsWith(d))) {
                throw new Error('Internal domains are not allowed');
            }
        }

    } catch (error) {
        if (error.message.includes('not allowed')) {
            throw error;
        }
        throw new Error('Invalid URL structure');
    }

    // Length check
    if (cleanURL.length > 2048) {
        throw new Error('URL too long');
    }

    return cleanURL;
};

// Validate CVE ID
export const validateCVEId = (cveId) => {
    if (!cveId || typeof cveId !== 'string') {
        throw new Error('CVE ID is required and must be a string');
    }

    const cleanCVE = cveId.trim().toUpperCase();

    // CVE format: CVE-YYYY-NNNN (where N is 4+ digits)
    if (!/^CVE-\d{4}-\d{4,}$/.test(cleanCVE)) {
        throw new Error('Invalid CVE ID format. Expected: CVE-YYYY-NNNN');
    }

    return cleanCVE;
};

// Validate port number
export const validatePort = (port) => {
    const portNum = parseInt(port, 10);

    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        throw new Error('Port must be between 1 and 65535');
    }

    return portNum;
};

// Validate and sanitize query parameters
export const validateQueryParams = (params, schema) => {
    const validated = {};

    for (const [key, rules] of Object.entries(schema)) {
        const value = params[key];

        // Check required
        if (rules.required && (value === undefined || value === null || value === '')) {
            throw new Error(`Parameter '${key}' is required`);
        }

        // Skip validation if optional and not provided
        if (!rules.required && (value === undefined || value === null)) {
            if (rules.default !== undefined) {
                validated[key] = rules.default;
            }
            continue;
        }

        // Type validation
        if (rules.type === 'number') {
            const num = parseInt(value, 10);
            if (isNaN(num)) {
                throw new Error(`Parameter '${key}' must be a number`);
            }
            if (rules.min !== undefined && num < rules.min) {
                throw new Error(`Parameter '${key}' must be at least ${rules.min}`);
            }
            if (rules.max !== undefined && num > rules.max) {
                throw new Error(`Parameter '${key}' must be at most ${rules.max}`);
            }
            validated[key] = num;
        } else if (rules.type === 'string') {
            if (typeof value !== 'string') {
                throw new Error(`Parameter '${key}' must be a string`);
            }
            let sanitized = sanitizeString(value);
            if (rules.maxLength && sanitized.length > rules.maxLength) {
                throw new Error(`Parameter '${key}' exceeds maximum length of ${rules.maxLength}`);
            }
            validated[key] = sanitized;
        } else if (rules.type === 'enum') {
            if (!rules.values.includes(value)) {
                throw new Error(`Parameter '${key}' must be one of: ${rules.values.join(', ')}`);
            }
            validated[key] = value;
        }
    }

    return validated;
};

// Validation middleware factory
export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // Validate query parameters
            if (schema.query) {
                req.validatedQuery = validateQueryParams(req.query, schema.query);
            }

            // Validate body parameters
            if (schema.body) {
                req.validatedBody = validateQueryParams(req.body, schema.body);
            }

            // Validate params
            if (schema.params) {
                req.validatedParams = validateQueryParams(req.params, schema.params);
            }

            next();
        } catch (error) {
            res.status(400).json({
                error: 'Validation failed',
                message: error.message
            });
        }
    };
};

export default {
    sanitizeString,
    validateDomain,
    validateIP,
    validateURL,
    validateCVEId,
    validatePort,
    validateQueryParams,
    validateRequest
};
