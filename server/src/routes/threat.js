import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * POST /api/threat/ip
 * Check IP reputation using AbuseIPDB (free tier: 1000 checks/day)
 */
router.post('/ip', async (req, res) => {
    try {
        const { ip } = req.body;

        if (!ip) {
            return res.status(400).json({ error: 'IP address is required' });
        }

        if (!process.env.ABUSEIPDB_API_KEY) {
            return res.json({
                ip,
                note: 'AbuseIPDB API key not configured',
                recommendation: 'Add ABUSEIPDB_API_KEY to .env file for IP reputation checking'
            });
        }

        const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
            headers: {
                'Key': process.env.ABUSEIPDB_API_KEY,
                'Accept': 'application/json'
            },
            params: {
                ipAddress: ip,
                maxAgeInDays: 90,
                verbose: true
            },
            timeout: 10000
        });

        const data = response.data.data;

        res.json({
            ip,
            abuseScore: data.abuseConfidenceScore,
            totalReports: data.totalReports,
            numDistinctUsers: data.numDistinctUsers,
            lastReportedAt: data.lastReportedAt,
            isWhitelisted: data.isWhitelisted,
            isTor: data.isTor,
            country: data.countryCode,
            usageType: data.usageType,
            isp: data.isp,
            domain: data.domain,
            risk: data.abuseConfidenceScore > 75 ? 'critical'
                : data.abuseConfidenceScore > 50 ? 'high'
                    : data.abuseConfidenceScore > 25 ? 'medium' : 'low',
            reports: data.reports?.slice(0, 5) || []
        });

    } catch (error) {
        console.error('IP threat check error:', error.message);
        res.status(500).json({
            error: 'Failed to check IP reputation',
            details: error.message
        });
    }
});

/**
 * POST /api/threat/domain
 * Check domain reputation using VirusTotal (free: 4 req/min)
 */
router.post('/domain', async (req, res) => {
    try {
        const { domain } = req.body;

        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        if (!process.env.VIRUSTOTAL_API_KEY) {
            return res.json({
                domain,
                note: 'VirusTotal API key not configured',
                recommendation: 'Add VIRUSTOTAL_API_KEY to .env file for domain reputation checking'
            });
        }

        const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${cleanDomain}`, {
            headers: {
                'x-apikey': process.env.VIRUSTOTAL_API_KEY
            },
            timeout: 10000
        });

        const data = response.data.data;
        const stats = data.attributes.last_analysis_stats;

        res.json({
            domain: cleanDomain,
            reputation: data.attributes.reputation,
            categories: data.attributes.categories,
            lastAnalysis: data.attributes.last_analysis_date,
            stats: {
                harmless: stats.harmless,
                malicious: stats.malicious,
                suspicious: stats.suspicious,
                undetected: stats.undetected
            },
            risk: stats.malicious > 5 ? 'critical'
                : stats.malicious > 2 ? 'high'
                    : stats.suspicious > 5 ? 'medium' : 'low',
            totalEngines: stats.harmless + stats.malicious + stats.suspicious + stats.undetected,
            detectionRate: `${stats.malicious}/${stats.harmless + stats.malicious + stats.suspicious + stats.undetected}`
        });

    } catch (error) {
        console.error('Domain threat check error:', error.message);

        if (error.response?.status === 429) {
            return res.status(429).json({
                error: 'VirusTotal rate limit exceeded',
                note: 'Free tier allows 4 requests per minute'
            });
        }

        res.status(500).json({
            error: 'Failed to check domain reputation',
            details: error.message
        });
    }
});

/**
 * POST /api/threat/url
 * Scan URL with VirusTotal
 */
router.post('/url', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!process.env.VIRUSTOTAL_API_KEY) {
            return res.json({
                url,
                note: 'VirusTotal API key not configured',
                recommendation: 'Add VIRUSTOTAL_API_KEY to .env file'
            });
        }

        // Submit URL for scanning
        const submitResponse = await axios.post('https://www.virustotal.com/api/v3/urls',
            `url=${encodeURIComponent(url)}`,
            {
                headers: {
                    'x-apikey': process.env.VIRUSTOTAL_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 10000
            }
        );

        const analysisId = submitResponse.data.data.id;

        res.json({
            url,
            analysisId,
            status: 'queued',
            message: 'URL submitted for analysis',
            checkUrl: `/api/threat/url/${analysisId}`,
            note: 'Results will be available in 1-2 minutes'
        });

    } catch (error) {
        console.error('URL threat check error:', error.message);
        res.status(500).json({
            error: 'Failed to submit URL for scanning',
            details: error.message
        });
    }
});

/**
 * GET /api/threat/shodan/:ip
 * Get Shodan information for IP (free: 100 queries/month)
 */
router.get('/shodan/:ip', async (req, res) => {
    try {
        const { ip } = req.params;

        if (!process.env.SHODAN_API_KEY) {
            return res.json({
                ip,
                note: 'Shodan API key not configured',
                recommendation: 'Add SHODAN_API_KEY to .env file for host information'
            });
        }

        const response = await axios.get(`https://api.shodan.io/shodan/host/${ip}`, {
            params: {
                key: process.env.SHODAN_API_KEY
            },
            timeout: 10000
        });

        const data = response.data;

        res.json({
            ip,
            hostnames: data.hostnames || [],
            ports: data.ports || [],
            vulnerabilities: data.vulns || [],
            organization: data.org,
            isp: data.isp,
            country: data.country_name,
            city: data.city,
            lastUpdate: data.last_update,
            services: data.data?.map(service => ({
                port: service.port,
                protocol: service.transport,
                product: service.product,
                version: service.version
            })) || []
        });

    } catch (error) {
        console.error('Shodan lookup error:', error.message);

        if (error.response?.status === 401) {
            return res.status(401).json({
                error: 'Invalid Shodan API key'
            });
        }

        res.status(500).json({
            error: 'Failed to lookup IP on Shodan',
            details: error.message
        });
    }
});

export default router;
