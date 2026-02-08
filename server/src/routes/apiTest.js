import express from 'express';
import { 
    testAllAPIs, 
    testGeminiAPI, 
    testShodanAPI, 
    testNVDAPI, 
    testGitHubAPI, 
    testAbuseIPDBAPI,
    analyzeWithGemini,
    queryShodan,
    checkIPReputation
} from '../services/apiIntegrations.js';

const router = express.Router();

// Test all API connections
router.get('/test/all', async (req, res) => {
    try {
        const results = await testAllAPIs();
        
        const summary = {
            total: results.length,
            connected: results.filter(r => r && r.success).length,
            failed: results.filter(r => !r || !r.success).length,
            results: results || []
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            total: 0,
            connected: 0,
            failed: 0,
            results: [],
            error: error.message || 'Unknown error occurred'
        });
    }
});

// Test individual APIs
router.get('/test/gemini', async (req, res) => {
    try {
        const result = await testGeminiAPI(req.query.apiKey);
        res.json(result || { success: false, message: 'No response', service: 'Gemini AI' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Unknown error',
            service: 'Gemini AI',
            error: 'SERVER_ERROR'
        });
    }
});

router.get('/test/shodan', async (req, res) => {
    try {
        const result = await testShodanAPI(req.query.apiKey);
        res.json(result || { success: false, message: 'No response', service: 'Shodan' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Unknown error',
            service: 'Shodan',
            error: 'SERVER_ERROR'
        });
    }
});

router.get('/test/nvd', async (req, res) => {
    try {
        const result = await testNVDAPI(req.query.apiKey);
        res.json(result || { success: false, message: 'No response', service: 'NVD' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Unknown error',
            service: 'NVD',
            error: 'SERVER_ERROR'
        });
    }
});

router.get('/test/github', async (req, res) => {
    try {
        const result = await testGitHubAPI(req.query.token);
        res.json(result || { success: false, message: 'No response', service: 'GitHub' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Unknown error',
            service: 'GitHub',
            error: 'SERVER_ERROR'
        });
    }
});

router.get('/test/abuseipdb', async (req, res) => {
    try {
        const result = await testAbuseIPDBAPI(req.query.apiKey);
        res.json(result || { success: false, message: 'No response', service: 'AbuseIPDB' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Unknown error',
            service: 'AbuseIPDB',
            error: 'SERVER_ERROR'
        });
    }
});

// Use Gemini for analysis
router.post('/gemini/analyze', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                message: 'Prompt is required',
                error: 'MISSING_PROMPT'
            });
        }

        const result = await analyzeWithGemini(prompt, apiKey);
        res.json(result || { success: false, message: 'No response from Gemini' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Analysis failed',
            error: 'SERVER_ERROR'
        });
    }
});

// Query Shodan
router.get('/shodan/search', async (req, res) => {
    try {
        const { query, apiKey } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                success: false, 
                message: 'Query is required',
                error: 'MISSING_QUERY'
            });
        }

        const result = await queryShodan(query, apiKey);
        res.json(result || { success: false, message: 'No results from Shodan' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Search failed',
            error: 'SERVER_ERROR'
        });
    }
});

// Check IP reputation
router.get('/abuseipdb/check', async (req, res) => {
    try {
        const { ip, apiKey } = req.query;
        
        if (!ip) {
            return res.status(400).json({ 
                success: false, 
                message: 'IP address is required',
                error: 'MISSING_IP'
            });
        }

        const result = await checkIPReputation(ip, apiKey);
        res.json(result || { success: false, message: 'No results from AbuseIPDB' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || 'IP check failed',
            error: 'SERVER_ERROR'
        });
    }
});

export default router;
