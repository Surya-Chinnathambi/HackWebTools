import express from 'express';
import axios from 'axios';
import { validateURL } from '../middleware/validation.js';
import { validateSSRF } from '../middleware/ssrfProtection.js';

const router = express.Router();

/**
 * POST /api/scan/headers
 * Analyze HTTP security headers
 */
router.post('/headers', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // SECURITY: Validate URL format
        const cleanURL = validateURL(url);

        // SECURITY: Check for SSRF attempts
        validateSSRF(cleanURL);

        const response = await axios.get(cleanURL, {
            timeout: 10000,
            validateStatus: () => true // Accept any status code
        });

        const headers = response.headers;
        const securityHeaders = {
            'strict-transport-security': headers['strict-transport-security'],
            'content-security-policy': headers['content-security-policy'],
            'x-frame-options': headers['x-frame-options'],
            'x-content-type-options': headers['x-content-type-options'],
            'x-xss-protection': headers['x-xss-protection'],
            'referrer-policy': headers['referrer-policy'],
            'permissions-policy': headers['permissions-policy']
        };

        // Score the security headers
        const scores = {
            'strict-transport-security': securityHeaders['strict-transport-security'] ? 20 : 0,
            'content-security-policy': securityHeaders['content-security-policy'] ? 20 : 0,
            'x-frame-options': securityHeaders['x-frame-options'] ? 15 : 0,
            'x-content-type-options': securityHeaders['x-content-type-options'] ? 15 : 0,
            'x-xss-protection': securityHeaders['x-xss-protection'] ? 10 : 0,
            'referrer-policy': securityHeaders['referrer-policy'] ? 10 : 0,
            'permissions-policy': securityHeaders['permissions-policy'] ? 10 : 0
        };

        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

        const findings = [];
        if (!securityHeaders['strict-transport-security']) {
            findings.push({
                severity: 'high',
                header: 'Strict-Transport-Security',
                issue: 'HSTS header missing - site vulnerable to downgrade attacks',
                recommendation: 'Add: Strict-Transport-Security: max-age=31536000; includeSubDomains'
            });
        }
        if (!securityHeaders['content-security-policy']) {
            findings.push({
                severity: 'high',
                header: 'Content-Security-Policy',
                issue: 'CSP header missing - vulnerable to XSS attacks',
                recommendation: 'Implement a strict Content-Security-Policy'
            });
        }
        if (!securityHeaders['x-frame-options']) {
            findings.push({
                severity: 'medium',
                header: 'X-Frame-Options',
                issue: 'Clickjacking protection missing',
                recommendation: 'Add: X-Frame-Options: DENY or SAMEORIGIN'
            });
        }
        if (!securityHeaders['x-content-type-options']) {
            findings.push({
                severity: 'medium',
                header: 'X-Content-Type-Options',
                issue: 'MIME-type sniffing enabled',
                recommendation: 'Add: X-Content-Type-Options: nosniff'
            });
        }

        res.json({
            url,
            score: totalScore,
            grade: totalScore >= 80 ? 'A' : totalScore >= 60 ? 'B' : totalScore >= 40 ? 'C' : totalScore >= 20 ? 'D' : 'F',
            headers: securityHeaders,
            findings,
            allHeaders: headers,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Header scan error:', error.message);
        res.status(500).json({
            error: 'Failed to scan headers',
            details: error.message
        });
    }
});

/**
 * POST /api/scan/ports
 * Basic port connectivity check (limited - full scanning requires native tools)
 */
router.post('/ports', async (req, res) => {
    try {
        const { target, ports = [80, 443, 22, 21, 25, 3306, 8080] } = req.body;

        if (!target) {
            return res.status(400).json({ error: 'Target is required' });
        }

        // SECURITY: Validate target (domain or IP)
        const { validateDomain, validateIP } = await import('../middleware/validation.js');
        try {
            // Try as domain first
            validateDomain(target);
        } catch {
            // If not a domain, try as IP
            validateIP(target);
        }

        res.json({
            target,
            note: 'Browser-based port scanning is limited. For real port scanning, use tools like nmap.',
            recommendation: 'Deploy this backend on a server with nmap installed for real port scanning',
            requestedPorts: ports,
            suggestion: 'Use browser extension or desktop application for actual port scanning'
        });

    } catch (error) {
        console.error('Port scan error:', error.message);
        res.status(500).json({
            error: 'Port scan failed',
            details: error.message
        });
    }
});

/**
 * POST /api/scan/xss
 * Test for XSS vulnerabilities
 */
router.post('/xss', async (req, res) => {
    try {
        const { url, payloads } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const testPayloads = payloads || [
            '<script>alert(1)</script>',
            '<img src=x onerror=alert(1)>',
            '"><script>alert(1)</script>',
            'javascript:alert(1)'
        ];

        const results = [];

        for (const payload of testPayloads) {
            try {
                const testUrl = `${url}${url.includes('?') ? '&' : '?'}test=${encodeURIComponent(payload)}`;
                const response = await axios.get(testUrl, {
                    timeout: 5000,
                    validateStatus: () => true
                });

                const reflected = response.data.includes(payload);

                results.push({
                    payload,
                    reflected,
                    risk: reflected ? 'high' : 'low',
                    response: {
                        statusCode: response.status,
                        contentType: response.headers['content-type']
                    }
                });
            } catch (error) {
                results.push({
                    payload,
                    error: error.message,
                    risk: 'unknown'
                });
            }
        }

        const vulnerableCount = results.filter(r => r.reflected).length;

        res.json({
            url,
            tested: testPayloads.length,
            vulnerable: vulnerableCount,
            risk: vulnerableCount > 0 ? 'critical' : 'low',
            results,
            recommendation: vulnerableCount > 0
                ? 'Implement input validation and output encoding'
                : 'No XSS vulnerabilities detected in basic tests',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('XSS scan error:', error.message);
        res.status(500).json({
            error: 'XSS scan failed',
            details: error.message
        });
    }
});

export default router;
