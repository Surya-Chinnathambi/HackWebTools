// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// API Client
class APIClient {
    baseURL: string;

    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    async request(endpoint: string, options: RequestInit = {}) {
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
        return this.request(`/tools/cve/search?keyword=${encodeURIComponent(keyword)}&startIndex=${page * limit}&resultsPerPage=${limit}`);
    }

    async getRecentCVEs(days = 7) {
        return this.request(`/tools/cve/recent?days=${days}`);
    }

    async getCVEDetails(cveId) {
        return this.request(`/tools/cve/${cveId}`);
    }

    // Exploit Endpoints
    async searchExploits(query, page = 1, limit = 20) {
        return this.request(`/tools/exploits/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    }

    async getExploitsForCVE(cveId) {
        return this.request(`/tools/exploits/cve/${cveId}`);
    }

    async getTrendingExploits(timeframe = 'week') {
        return this.request(`/tools/exploits/trending?timeframe=${timeframe}`);
    }

    // SSL/TLS Endpoints
    async checkSSL(hostname, port = 443) {
        return this.request(`/tools/ssl/check?hostname=${encodeURIComponent(hostname)}&port=${port}`);
    }

    async analyzeSSL(hostname) {
        return this.request(`/tools/ssl/analyze?hostname=${encodeURIComponent(hostname)}`);
    }

    async getCertificates(domain) {
        return this.request(`/tools/ssl/certs?domain=${encodeURIComponent(domain)}`);
    }

    // DNS Endpoints
    async dnsLookup(domain, type = 'A') {
        return this.request(`/tools/dns/lookup?domain=${encodeURIComponent(domain)}&record_type=${type}`);
    }

    async reverseDNS(ip) {
        return this.request(`/tools/dns/reverse?ip=${encodeURIComponent(ip)}`);
    }

    async whoisLookup(domain) {
        return this.request(`/tools/dns/whois?domain=${encodeURIComponent(domain)}`);
    }

    async comprehensiveDNS(domain) {
        return this.request(`/tools/dns/comprehensive?domain=${encodeURIComponent(domain)}`);
    }

    // Subdomain Endpoints
    async enumerateSubdomains(domain, sources = 'crtsh,hackertarget') {
        return this.request(`/tools/subdomain/enumerate?domain=${encodeURIComponent(domain)}&sources=${sources}`);
    }

    async bruteforceSubdomains(domain) {
        return this.request('/tools/subdomain/bruteforce', {
            method: 'POST',
            body: JSON.stringify({ domain }),
        });
    }

    // Scanning Endpoints
    async scanHeaders(url) {
        return this.request('/tools/scan/headers', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
    }

    async scanXSS(url, payloads) {
        return this.request('/tools/scan/xss', {
            method: 'POST',
            body: JSON.stringify({ url, payloads }),
        });
    }

    // Threat Intelligence Endpoints
    async checkIPReputation(ip) {
        return this.request('/tools/threat/ip', {
            method: 'POST',
            body: JSON.stringify({ ip }),
        });
    }

    async checkDomainReputation(domain) {
        return this.request('/tools/threat/domain', {
            method: 'POST',
            body: JSON.stringify({ domain }),
        });
    }

    async scanURL(url) {
        return this.request('/tools/threat/url', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
    }

    async getShodanInfo(ip) {
        return this.request(`/tools/threat/shodan/${ip}`);
    }

    // Report Endpoints
    async generateReport(reportData) {
        return this.request('/tools/report/generate', {
            method: 'POST',
            body: JSON.stringify(reportData),
        });
    }
}

// WebSocket Client
class WebSocketClient {
    url: string;
    ws: WebSocket | null;
    reconnectInterval: number;
    listeners: Map<string, Array<(data: any) => void>>;

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

    send(type: string, data: Record<string, any> = {}) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, ...data }));
        } else {
            console.warn('WebSocket not connected');
        }
    }

    subscribe(channel: string) {
        this.send('subscribe', { channel });
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    off(event: string, callback: (data: any) => void) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
    }

    emit(event: string, data: any) {
        if (this.listeners.has(event)) {
            this.listeners.get(event)!.forEach(callback => callback(data));
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
