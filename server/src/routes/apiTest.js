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
            connected: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Test individual APIs
router.get('/test/gemini', async (req, res) => {
    try {
        const result = await testGeminiAPI(req.query.apiKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/test/shodan', async (req, res) => {
    try {
        const result = await testShodanAPI(req.query.apiKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/test/nvd', async (req, res) => {
    try {
        const result = await testNVDAPI(req.query.apiKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/test/github', async (req, res) => {
    try {
        const result = await testGitHubAPI(req.query.token);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/test/abuseipdb', async (req, res) => {
    try {
        const result = await testAbuseIPDBAPI(req.query.apiKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Use Gemini for analysis
router.post('/gemini/analyze', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                error: 'Prompt is required' 
            });
        }

        const result = await analyzeWithGemini(prompt, apiKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
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
                error: 'Query is required' 
            });
        }

        const result = await queryShodan(query, apiKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
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
                error: 'IP address is required' 
            });
        }

        const result = await checkIPReputation(ip, apiKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

export default router;
