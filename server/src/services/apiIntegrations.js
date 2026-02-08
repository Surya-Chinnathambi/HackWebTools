import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// API Configuration
const API_KEYS = {
    gemini: process.env.GEMINI_API_KEY,
    shodan: process.env.SHODAN_API_KEY,
    nvd: process.env.NVD_API_KEY,
    github: process.env.GITHUB_TOKEN,
    abuseipdb: process.env.ABUSEIPDB_API_KEY,
    virustotal: process.env.VIRUSTOTAL_API_KEY
};

// Test Gemini API
export async function testGeminiAPI(apiKey = API_KEYS.gemini) {
    try {
        if (!apiKey || apiKey === 'your_gemini_api_key') {
            return {
                success: false,
                message: 'Gemini API key not configured',
                service: 'Gemini AI'
            };
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: "Say 'API connected successfully' in exactly 3 words."
                    }]
                }]
            },
            {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (response.data && response.data.candidates) {
            return {
                success: true,
                message: 'Gemini API connected successfully',
                service: 'Gemini AI',
                data: {
                    model: 'gemini-pro',
                    response: response.data.candidates[0]?.content?.parts[0]?.text
                }
            };
        }

        return {
            success: false,
            message: 'Invalid response from Gemini API',
            service: 'Gemini AI'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error?.message || error.message,
            service: 'Gemini AI',
            error: error.response?.status || 'NETWORK_ERROR'
        };
    }
}

// Test Shodan API
export async function testShodanAPI(apiKey = API_KEYS.shodan) {
    try {
        if (!apiKey || apiKey === 'your_shodan_api_key') {
            return {
                success: false,
                message: 'Shodan API key not configured',
                service: 'Shodan'
            };
        }

        const response = await axios.get(
            `https://api.shodan.io/api-info?key=${apiKey}`,
            { timeout: 10000 }
        );

        return {
            success: true,
            message: 'Shodan API connected successfully',
            service: 'Shodan',
            data: {
                plan: response.data.plan,
                query_credits: response.data.query_credits,
                scan_credits: response.data.scan_credits
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error || error.message,
            service: 'Shodan',
            error: error.response?.status || 'NETWORK_ERROR'
        };
    }
}

// Test NVD API
export async function testNVDAPI(apiKey = API_KEYS.nvd) {
    try {
        const headers = {};
        if (apiKey && apiKey !== 'your_nvd_api_key_optional') {
            headers['apiKey'] = apiKey;
        }

        const response = await axios.get(
            'https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=1',
            { 
                timeout: 15000,
                headers 
            }
        );

        return {
            success: true,
            message: 'NVD API connected successfully',
            service: 'NVD',
            data: {
                totalResults: response.data.totalResults,
                resultsPerPage: response.data.resultsPerPage,
                withApiKey: !!apiKey && apiKey !== 'your_nvd_api_key_optional'
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message,
            service: 'NVD',
            error: error.response?.status || 'NETWORK_ERROR'
        };
    }
}

// Test GitHub API
export async function testGitHubAPI(token = API_KEYS.github) {
    try {
        if (!token || token === 'your_github_personal_access_token') {
            return {
                success: false,
                message: 'GitHub token not configured',
                service: 'GitHub'
            };
        }

        const response = await axios.get(
            'https://api.github.com/user',
            {
                timeout: 10000,
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        return {
            success: true,
            message: 'GitHub API connected successfully',
            service: 'GitHub',
            data: {
                username: response.data.login,
                name: response.data.name,
                public_repos: response.data.public_repos
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message,
            service: 'GitHub',
            error: error.response?.status || 'NETWORK_ERROR'
        };
    }
}

// Test AbuseIPDB API
export async function testAbuseIPDBAPI(apiKey = API_KEYS.abuseipdb) {
    try {
        if (!apiKey || apiKey === 'your_abuseipdb_api_key') {
            return {
                success: false,
                message: 'AbuseIPDB API key not configured',
                service: 'AbuseIPDB'
            };
        }

        // Test with a known safe IP (Google DNS)
        const response = await axios.get(
            'https://api.abuseipdb.com/api/v2/check',
            {
                timeout: 10000,
                headers: {
                    'Key': apiKey,
                    'Accept': 'application/json'
                },
                params: {
                    ipAddress: '8.8.8.8',
                    maxAgeInDays: 90
                }
            }
        );

        return {
            success: true,
            message: 'AbuseIPDB API connected successfully',
            service: 'AbuseIPDB',
            data: {
                ipAddress: response.data.data.ipAddress,
                abuseConfidenceScore: response.data.data.abuseConfidenceScore,
                usageType: response.data.data.usageType
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.errors?.[0]?.detail || error.message,
            service: 'AbuseIPDB',
            error: error.response?.status || 'NETWORK_ERROR'
        };
    }
}

// Test all APIs
export async function testAllAPIs(customKeys = {}) {
    const results = await Promise.allSettled([
        testGeminiAPI(customKeys.gemini),
        testShodanAPI(customKeys.shodan),
        testNVDAPI(customKeys.nvd),
        testGitHubAPI(customKeys.github),
        testAbuseIPDBAPI(customKeys.abuseipdb)
    ]);

    return results.map(result => result.value);
}

// Use Gemini for security analysis
export async function analyzeWithGemini(prompt, apiKey = API_KEYS.gemini) {
    try {
        if (!apiKey || apiKey === 'your_gemini_api_key') {
            throw new Error('Gemini API key not configured');
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            },
            {
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (response.data && response.data.candidates) {
            return {
                success: true,
                text: response.data.candidates[0]?.content?.parts[0]?.text,
                model: 'gemini-pro'
            };
        }

        throw new Error('Invalid response from Gemini API');
    } catch (error) {
        throw new Error(error.response?.data?.error?.message || error.message);
    }
}

// Query Shodan for host information
export async function queryShodan(query, apiKey = API_KEYS.shodan) {
    try {
        if (!apiKey || apiKey === 'your_shodan_api_key') {
            throw new Error('Shodan API key not configured');
        }

        const response = await axios.get(
            `https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${encodeURIComponent(query)}`,
            { timeout: 15000 }
        );

        return {
            success: true,
            total: response.data.total,
            matches: response.data.matches
        };
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
}

// Check IP reputation with AbuseIPDB
export async function checkIPReputation(ip, apiKey = API_KEYS.abuseipdb) {
    try {
        if (!apiKey || apiKey === 'your_abuseipdb_api_key') {
            throw new Error('AbuseIPDB API key not configured');
        }

        const response = await axios.get(
            'https://api.abuseipdb.com/api/v2/check',
            {
                timeout: 10000,
                headers: {
                    'Key': apiKey,
                    'Accept': 'application/json'
                },
                params: {
                    ipAddress: ip,
                    maxAgeInDays: 90,
                    verbose: true
                }
            }
        );

        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        throw new Error(error.response?.data?.errors?.[0]?.detail || error.message);
    }
}

export default {
    testGeminiAPI,
    testShodanAPI,
    testNVDAPI,
    testGitHubAPI,
    testAbuseIPDBAPI,
    testAllAPIs,
    analyzeWithGemini,
    queryShodan,
    checkIPReputation
};
