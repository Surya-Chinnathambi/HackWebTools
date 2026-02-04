import express from 'express';
import sslChecker from 'ssl-checker';
import axios from 'axios';

const router = express.Router();

/**
 * GET /api/ssl/check
 * Check SSL/TLS certificate information
 */
router.get('/check', async (req, res) => {
    try {
        const { hostname, port = 443 } = req.query;

        if (!hostname) {
            return res.status(400).json({ error: 'Hostname is required' });
        }

        // Clean hostname (remove protocol, path, etc.)
        const cleanHostname = hostname.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

        const result = await sslChecker(cleanHostname, {
            method: 'GET',
            port: parseInt(port),
            timeout: 5000
        });

        // Calculate days until expiry
        const expiryDate = new Date(result.valid_to);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        // Determine risk level
        let riskLevel = 'low';
        if (daysUntilExpiry < 0) riskLevel = 'critical';
        else if (daysUntilExpiry < 7) riskLevel = 'high';
        else if (daysUntilExpiry < 30) riskLevel = 'medium';

        const sslInfo = {
            hostname: cleanHostname,
            port: parseInt(port),
            valid: result.valid,
            daysRemaining: daysUntilExpiry,
            validFrom: result.valid_from,
            validTo: result.valid_to,
            issuer: result.issuer,
            subject: result.subject,
            protocol: result.protocol,
            cipher: result.cipher,
            riskLevel,
            warnings: []
        };

        // Add warnings
        if (daysUntilExpiry < 30) {
            sslInfo.warnings.push(`Certificate expires in ${daysUntilExpiry} days`);
        }
        if (!result.valid) {
            sslInfo.warnings.push('Certificate is not valid');
        }

        res.json(sslInfo);

    } catch (error) {
        console.error('SSL check error:', error.message);

        if (error.message.includes('ENOTFOUND')) {
            return res.status(404).json({
                error: 'Hostname not found',
                hostname: req.query.hostname
            });
        }

        res.status(500).json({
            error: 'Failed to check SSL certificate',
            details: error.message
        });
    }
});

/**
 * GET /api/ssl/analyze
 * Perform comprehensive SSL/TLS analysis using SSL Labs API (free)
 */
router.get('/analyze', async (req, res) => {
    try {
        const { hostname } = req.query;

        if (!hostname) {
            return res.status(400).json({ error: 'Hostname is required' });
        }

        const cleanHostname = hostname.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

        // Use SSL Labs API (free, no key required)
        const response = await axios.get('https://api.ssllabs.com/api/v3/analyze', {
            params: {
                host: cleanHostname,
                fromCache: 'on',
                maxAge: 24 // Use cached results up to 24 hours old
            },
            timeout: 10000
        });

        if (response.data.status === 'ERROR') {
            return res.status(400).json({
                error: 'SSL Labs analysis failed',
                details: response.data.statusMessage
            });
        }

        const endpoints = response.data.endpoints || [];
        const grades = endpoints.map(e => e.grade).filter(g => g);

        res.json({
            hostname: cleanHostname,
            status: response.data.status,
            testTime: response.data.testTime,
            endpoints: endpoints.map(e => ({
                ipAddress: e.ipAddress,
                grade: e.grade,
                hasWarnings: e.hasWarnings,
                isExceptional: e.isExceptional,
                statusMessage: e.statusMessage
            })),
            overallGrade: grades.length > 0 ? Math.min(...grades) : null,
            message: response.data.status === 'READY'
                ? 'Analysis complete'
                : 'Analysis in progress - check back in a few minutes'
        });

    } catch (error) {
        console.error('SSL analysis error:', error.message);
        res.status(500).json({
            error: 'Failed to analyze SSL configuration',
            details: error.message
        });
    }
});

/**
 * GET /api/ssl/certs
 * Get certificate transparency logs from crt.sh
 */
router.get('/certs', async (req, res) => {
    try {
        const { domain } = req.query;

        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

        // Query crt.sh (free certificate transparency log search)
        const response = await axios.get('https://crt.sh/', {
            params: {
                q: `%.${cleanDomain}`,
                output: 'json'
            },
            timeout: 10000
        });

        const certs = response.data.slice(0, 50).map(cert => ({
            id: cert.id,
            loggedAt: cert.entry_timestamp,
            notBefore: cert.not_before,
            notAfter: cert.not_after,
            commonName: cert.common_name,
            nameValue: cert.name_value,
            issuer: cert.issuer_name
        }));

        // Extract unique subdomains
        const subdomains = new Set();
        certs.forEach(cert => {
            const names = cert.nameValue.split('\n');
            names.forEach(name => {
                if (name.includes(cleanDomain)) {
                    subdomains.add(name);
                }
            });
        });

        res.json({
            domain: cleanDomain,
            totalCertificates: response.data.length,
            certificates: certs,
            uniqueSubdomains: Array.from(subdomains).sort()
        });

    } catch (error) {
        console.error('Certificate transparency search error:', error.message);
        res.status(500).json({
            error: 'Failed to search certificate transparency logs',
            details: error.message
        });
    }
});

export default router;
