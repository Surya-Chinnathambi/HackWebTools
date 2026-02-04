import express from 'express';
import axios from 'axios';

const router = express.Router();

// NVD API endpoint
const NVD_API_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

/**
 * GET /api/cve/search
 * Search for CVEs by keyword
 */
router.get('/search', async (req, res) => {
    try {
        const { keyword, resultsPerPage = 20, startIndex = 0 } = req.query;

        if (!keyword) {
            return res.status(400).json({ error: 'Keyword parameter is required' });
        }

        const params = {
            keywordSearch: keyword,
            resultsPerPage: Math.min(parseInt(resultsPerPage), 100),
            startIndex: parseInt(startIndex)
        };

        // Add API key if available (increases rate limit from 5 to 50 requests per 30 seconds)
        const headers = process.env.NVD_API_KEY
            ? { 'apiKey': process.env.NVD_API_KEY }
            : {};

        const response = await axios.get(NVD_API_BASE, {
            params,
            headers,
            timeout: 10000
        });

        const cves = response.data.vulnerabilities.map(item => {
            const cve = item.cve;
            const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV2?.[0];

            return {
                id: cve.id,
                description: cve.descriptions.find(d => d.lang === 'en')?.value || 'No description',
                published: cve.published,
                lastModified: cve.lastModified,
                cvss: metrics ? {
                    version: metrics.cvssData.version,
                    score: metrics.cvssData.baseScore,
                    severity: metrics.cvssData.baseSeverity || metrics.baseSeverity,
                    vector: metrics.cvssData.vectorString
                } : null,
                references: cve.references?.map(ref => ({
                    url: ref.url,
                    source: ref.source
                })) || []
            };
        });

        res.json({
            total: response.data.totalResults,
            results: cves,
            startIndex: parseInt(startIndex),
            resultsPerPage: params.resultsPerPage
        });

    } catch (error) {
        console.error('CVE search error:', error.message);

        if (error.response?.status === 429) {
            return res.status(429).json({
                error: 'Rate limit exceeded. Please wait 30 seconds.',
                retryAfter: 30
            });
        }

        res.status(500).json({
            error: 'Failed to search CVEs',
            details: error.message
        });
    }
});

/**
 * GET /api/cve/recent
 * Get recent CVEs
 */
router.get('/recent', async (req, res) => {
    try {
        const { days = 7, resultsPerPage = 20 } = req.query;

        const pubEndDate = new Date();
        const pubStartDate = new Date();
        pubStartDate.setDate(pubStartDate.getDate() - parseInt(days));

        const params = {
            pubStartDate: pubStartDate.toISOString(),
            pubEndDate: pubEndDate.toISOString(),
            resultsPerPage: Math.min(parseInt(resultsPerPage), 100)
        };

        const headers = process.env.NVD_API_KEY
            ? { 'apiKey': process.env.NVD_API_KEY }
            : {};

        const response = await axios.get(NVD_API_BASE, {
            params,
            headers,
            timeout: 10000
        });

        const cves = response.data.vulnerabilities.map(item => {
            const cve = item.cve;
            const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV2?.[0];

            return {
                id: cve.id,
                description: cve.descriptions.find(d => d.lang === 'en')?.value || 'No description',
                published: cve.published,
                cvss: metrics ? {
                    score: metrics.cvssData.baseScore,
                    severity: metrics.cvssData.baseSeverity || metrics.baseSeverity
                } : null
            };
        });

        res.json({
            total: response.data.totalResults,
            results: cves,
            period: `Last ${days} days`
        });

    } catch (error) {
        console.error('Recent CVEs error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch recent CVEs',
            details: error.message
        });
    }
});

/**
 * GET /api/cve/:cveId
 * Get detailed information about a specific CVE
 */
router.get('/:cveId', async (req, res) => {
    try {
        const { cveId } = req.params;

        if (!/^CVE-\d{4}-\d{4,}$/i.test(cveId)) {
            return res.status(400).json({ error: 'Invalid CVE ID format' });
        }

        const headers = process.env.NVD_API_KEY
            ? { 'apiKey': process.env.NVD_API_KEY }
            : {};

        const response = await axios.get(NVD_API_BASE, {
            params: { cveId: cveId.toUpperCase() },
            headers,
            timeout: 10000
        });

        if (!response.data.vulnerabilities || response.data.vulnerabilities.length === 0) {
            return res.status(404).json({ error: 'CVE not found' });
        }

        const cve = response.data.vulnerabilities[0].cve;
        const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV2?.[0];

        const detailedCVE = {
            id: cve.id,
            description: cve.descriptions.find(d => d.lang === 'en')?.value,
            published: cve.published,
            lastModified: cve.lastModified,
            cvss: metrics ? {
                version: metrics.cvssData.version,
                score: metrics.cvssData.baseScore,
                severity: metrics.cvssData.baseSeverity || metrics.baseSeverity,
                vector: metrics.cvssData.vectorString,
                exploitabilityScore: metrics.exploitabilityScore,
                impactScore: metrics.impactScore
            } : null,
            weaknesses: cve.weaknesses?.map(w => ({
                type: w.type,
                description: w.description
            })) || [],
            references: cve.references?.map(ref => ({
                url: ref.url,
                source: ref.source,
                tags: ref.tags || []
            })) || [],
            configurations: cve.configurations || []
        };

        res.json(detailedCVE);

    } catch (error) {
        console.error('CVE details error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch CVE details',
            details: error.message
        });
    }
});

export default router;
