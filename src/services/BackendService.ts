// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';

// API Client
class APIClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // CVE Endpoints
    async searchCVEs(keyword, page = 0, limit = 20) {
        return this.request(`/cve/search?keyword=${encodeURIComponent(keyword)}&startIndex=${page * limit}&resultsPerPage=${limit}`);
    }

    async getRecentCVEs(days = 7) {
        return this.request(`/cve/recent?days=${days}`);
    }

    async getCVEDetails(cveId) {
        return this.request(`/cve/${cveId}`);
    }

    // Exploit Endpoints
    async searchExploits(query, page = 1, limit = 20) {
        return this.request(`/exploits/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    }

    async getExploitsForCVE(cveId) {
        return this.request(`/exploits/cve/${cveId}`);
    }

    async getTrendingExploits(timeframe = 'week') {
        return this.request(`/exploits/trending?timeframe=${timeframe}`);
    }

    // SSL/TLS Endpoints
    async checkSSL(hostname, port = 443) {
        return this.request(`/ssl/check?hostname=${encodeURIComponent(hostname)}&port=${port}`);
    }

    async analyzeSSL(hostname) {
        return this.request(`/ssl/analyze?hostname=${encodeURIComponent(hostname)}`);
    }

    async getCertificates(domain) {
        return this.request(`/ssl/certs?domain=${encodeURIComponent(domain)}`);
    }

    // DNS Endpoints
    async dnsLookup(domain, type = 'A') {
        return this.request(`/dns/lookup?domain=${encodeURIComponent(domain)}&type=${type}`);
    }

    async reverseDNS(ip) {
        return this.request(`/dns/reverse?ip=${encodeURIComponent(ip)}`);
    }

    async whoisLookup(domain) {
        return this.request(`/dns/whois?domain=${encodeURIComponent(domain)}`);
    }

    async comprehensiveDNS(domain) {
        return this.request(`/dns/comprehensive?domain=${encodeURIComponent(domain)}`);
    }

    // Subdomain Endpoints
    async enumerateSubdomains(domain, sources = 'crtsh,hackertarget') {
        return this.request(`/subdomain/enumerate?domain=${encodeURIComponent(domain)}&sources=${sources}`);
    }

    async bruteforceSubdomains(domain) {
        return this.request('/subdomain/bruteforce', {
            method: 'POST',
            body: JSON.stringify({ domain }),
        });
    }

    // Scanning Endpoints
    async scanHeaders(url) {
        return this.request('/scan/headers', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
    }

    async scanXSS(url, payloads) {
        return this.request('/scan/xss', {
            method: 'POST',
            body: JSON.stringify({ url, payloads }),
        });
    }

    // Threat Intelligence Endpoints
    async checkIPReputation(ip) {
        return this.request('/threat/ip', {
            method: 'POST',
            body: JSON.stringify({ ip }),
        });
    }

    async checkDomainReputation(domain) {
        return this.request('/threat/domain', {
            method: 'POST',
            body: JSON.stringify({ domain }),
        });
    }

    async scanURL(url) {
        return this.request('/threat/url', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
    }

    async getShodanInfo(ip) {
        return this.request(`/threat/shodan/${ip}`);
    }

    // Report Endpoints
    async generateReport(reportData) {
        return this.request('/report/generate', {
            method: 'POST',
            body: JSON.stringify(reportData),
        });
    }
}

// WebSocket Client
class WebSocketClient {
    constructor(url = WS_URL) {
        this.url = url;
        this.ws = null;
        this.reconnectInterval = 5000;
        this.listeners = new Map();
    }

    connect() {
        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log('🔌 WebSocket connected');
                this.emit('connected', { timestamp: new Date().toISOString() });
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.emit(data.type || 'message', data);
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.emit('disconnected', {});
                // Auto-reconnect
                setTimeout(() => this.connect(), this.reconnectInterval);
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.emit('error', error);
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    send(type, data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, ...data }));
        } else {
            console.warn('WebSocket not connected');
        }
    }

    subscribe(channel) {
        this.send('subscribe', { channel });
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}

// Export singleton instances
export const apiClient = new APIClient();
export const wsClient = new WebSocketClient();

// Health check
export const checkBackendHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
        return response.ok;
    } catch {
        return false;
    }
};

export default apiClient;
