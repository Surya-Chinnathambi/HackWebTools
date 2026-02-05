/**
 * SSRF Protection Middleware
 * Prevents Server-Side Request Forgery attacks
 */

const BLOCKED_HOSTS = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '169.254.169.254', // AWS metadata
    'metadata.google.internal' // GCP metadata
]);

const BLOCKED_PATTERNS = [
    /^10\./,                          // Private: 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private: 172.16.0.0/12
    /^192\.168\./,                    // Private: 192.168.0.0/16
    /^127\./,                         // Loopback: 127.0.0.0/8
    /^169\.254\./,                    // Link-local: 169.254.0.0/16
    /^fc00:/i,                        // IPv6 Unique Local
    /^fe80:/i,                        // IPv6 Link-Local
    /\.local$/i,                      // .local domains
    /\.internal$/i,                   // .internal domains
    /\.lan$/i,                        // .lan domains
    /\.corp$/i                        // .corp domains
];

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

/**
 * Check if hostname is blocked
 */
export const isBlockedHost = (hostname) => {
    if (!hostname) return true;

    const lowerHost = hostname.toLowerCase();

    // Check exact matches
    if (BLOCKED_HOSTS.has(lowerHost)) {
        return true;
    }

    // Check patterns
    for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.test(lowerHost)) {
            return true;
        }
    }

    return false;
};

/**
 * Validate URL for SSRF protection
 */
export const validateSSRF = (url) => {
    try {
        const urlObj = new URL(url);

        // Check protocol
        if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
            throw new Error(`Protocol ${urlObj.protocol} is not allowed. Use http or https.`);
        }

        // Check hostname
        if (isBlockedHost(urlObj.hostname)) {
            throw new Error('Access to internal/private hosts is not allowed');
        }

        // Check for @ symbol (credential stuffing)
        if (url.includes('@')) {
            throw new Error('URLs with credentials are not allowed');
        }

        return true;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Invalid URL format');
        }
        throw error;
    }
};

/**
 * SSRF Protection Middleware
 */
export const ssrfProtection = (req, res, next) => {
    try {
        // Check URL in body
        if (req.body && req.body.url) {
            validateSSRF(req.body.url);
        }

        // Check hostname in body
        if (req.body && req.body.hostname) {
            if (isBlockedHost(req.body.hostname)) {
                return res.status(400).json({
                    error: 'Invalid hostname',
                    message: 'Access to internal/private hosts is not allowed'
                });
            }
        }

        // Check domain in body
        if (req.body && req.body.domain) {
            const domain = req.body.domain.replace(/^https?:\/\//, '').split('/')[0];
            if (isBlockedHost(domain)) {
                return res.status(400).json({
                    error: 'Invalid domain',
                    message: 'Access to internal/private domains is not allowed'
                });
            }
        }

        // Check IP in body
        if (req.body && req.body.ip) {
            if (isBlockedHost(req.body.ip)) {
                return res.status(400).json({
                    error: 'Invalid IP address',
                    message: 'Access to internal/private IP addresses is not allowed'
                });
            }
        }

        next();
    } catch (error) {
        res.status(400).json({
            error: 'SSRF Protection',
            message: error.message
        });
    }
};

export default ssrfProtection;
