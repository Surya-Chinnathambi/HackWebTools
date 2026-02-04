import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * GET /api/subdomain/enumerate
 * Enumerate subdomains using multiple free sources
 */
router.get('/enumerate', async (req, res) => {
    try {
        const { domain, sources = 'crtsh,hackertarget' } = req.query;

        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
        const requestedSources = sources.split(',');

        const allSubdomains = new Set();
        const sourceResults = {};

        // Source 1: crt.sh (Certificate Transparency Logs)
        if (requestedSources.includes('crtsh')) {
            try {
                const crtshSubdomains = await getCrtshSubdomains(cleanDomain);
                crtshSubdomains.forEach(sub => allSubdomains.add(sub));
                sourceResults.crtsh = {
                    count: crtshSubdomains.length,
                    subdomains: crtshSubdomains.slice(0, 20) // First 20 for preview
                };
            } catch (error) {
                sourceResults.crtsh = { error: error.message };
            }
        }

        // Source 2: HackerTarget (Free API)
        if (requestedSources.includes('hackertarget')) {
            try {
                const hackerTargetSubdomains = await getHackerTargetSubdomains(cleanDomain);
                hackerTargetSubdomains.forEach(sub => allSubdomains.add(sub));
                sourceResults.hackertarget = {
                    count: hackerTargetSubdomains.length,
                    subdomains: hackerTargetSubdomains.slice(0, 20)
                };
            } catch (error) {
                sourceResults.hackertarget = { error: error.message };
            }
        }

        // Source 3: SecurityTrails (requires API key)
        if (requestedSources.includes('securitytrails') && process.env.SECURITYTRAILS_API_KEY) {
            try {
                const securityTrailsSubdomains = await getSecurityTrailsSubdomains(cleanDomain);
                securityTrailsSubdomains.forEach(sub => allSubdomains.add(sub));
                sourceResults.securitytrails = {
                    count: securityTrailsSubdomains.length,
                    subdomains: securityTrailsSubdomains
                };
            } catch (error) {
                sourceResults.securitytrails = { error: error.message };
            }
        }

        const uniqueSubdomains = Array.from(allSubdomains).sort();

        res.json({
            domain: cleanDomain,
            totalSubdomains: uniqueSubdomains.length,
            subdomains: uniqueSubdomains,
            sources: sourceResults,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Subdomain enumeration error:', error.message);
        res.status(500).json({
            error: 'Subdomain enumeration failed',
            details: error.message
        });
    }
});

// Helper: Get subdomains from crt.sh
async function getCrtshSubdomains(domain) {
    try {
        const response = await axios.get('https://crt.sh/', {
            params: { q: `%.${domain}`, output: 'json' },
            timeout: 10000
        });

        const subdomains = new Set();
        response.data.forEach(cert => {
            const names = cert.name_value.split('\n');
            names.forEach(name => {
                const cleaned = name.trim().toLowerCase();
                if (cleaned.endsWith(domain) && !cleaned.includes('*')) {
                    subdomains.add(cleaned);
                }
            });
        });

        return Array.from(subdomains);
    } catch (error) {
        console.error('crt.sh error:', error.message);
        return [];
    }
}

// Helper: Get subdomains from HackerTarget
async function getHackerTargetSubdomains(domain) {
    try {
        const response = await axios.get(`https://api.hackertarget.com/hostsearch/?q=${domain}`, {
            timeout: 10000
        });

        if (response.data.includes('error')) {
            throw new Error('HackerTarget API error or rate limit');
        }

        const subdomains = response.data
            .split('\n')
            .filter(line => line.includes(','))
            .map(line => line.split(',')[0].trim().toLowerCase())
            .filter(sub => sub && sub.endsWith(domain));

        return subdomains;
    } catch (error) {
        console.error('HackerTarget error:', error.message);
        return [];
    }
}

// Helper: Get subdomains from SecurityTrails (requires API key)
async function getSecurityTrailsSubdomains(domain) {
    try {
        const response = await axios.get(`https://api.securitytrails.com/v1/domain/${domain}/subdomains`, {
            headers: {
                'APIKEY': process.env.SECURITYTRAILS_API_KEY
            },
            timeout: 10000
        });

        return response.data.subdomains.map(sub => `${sub}.${domain}`);
    } catch (error) {
        console.error('SecurityTrails error:', error.message);
        return [];
    }
}

/**
 * POST /api/subdomain/bruteforce
 * Brute force subdomains using common wordlist
 */
router.post('/bruteforce', async (req, res) => {
    try {
        const { domain, wordlist = 'common' } = req.body;

        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

        // Common subdomain wordlist
        const commonSubdomains = [
            'www', 'mail', 'ftp', 'admin', 'webmail', 'localhost', 'webdisk', 'smtp',
            'pop', 'ns1', 'ns2', 'cpanel', 'whm', 'autodiscover', 'autoconfig',
            'dev', 'staging', 'test', 'api', 'mobile', 'm', 'blog', 'shop',
            'store', 'cdn', 'portal', 'remote', 'secure', 'vpn', 'support'
        ];

        res.json({
            domain: cleanDomain,
            note: 'Subdomain bruteforcing should be done with proper authorization',
            wordlistSize: commonSubdomains.length,
            suggestedSubdomains: commonSubdomains.map(sub => `${sub}.${cleanDomain}`),
            recommendation: 'Use dedicated tools like Sublist3r, Amass, or Subfinder for production enumeration'
        });

    } catch (error) {
        console.error('Subdomain bruteforce error:', error.message);
        res.status(500).json({
            error: 'Subdomain bruteforce failed',
            details: error.message
        });
    }
});

export default router;
