import express from 'express';
import dns from 'dns/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = express.Router();
const execAsync = promisify(exec);

/**
 * GET /api/dns/lookup
 * Perform DNS lookup for a domain
 */
router.get('/lookup', async (req, res) => {
    try {
        const { domain, type = 'A' } = req.query;

        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

        let records;
        switch (type.toUpperCase()) {
            case 'A':
                records = await dns.resolve4(cleanDomain);
                break;
            case 'AAAA':
                records = await dns.resolve6(cleanDomain);
                break;
            case 'MX':
                records = await dns.resolveMx(cleanDomain);
                break;
            case 'TXT':
                records = await dns.resolveTxt(cleanDomain);
                break;
            case 'NS':
                records = await dns.resolveNs(cleanDomain);
                break;
            case 'CNAME':
                records = await dns.resolveCname(cleanDomain);
                break;
            case 'SOA':
                records = await dns.resolveSoa(cleanDomain);
                break;
            default:
                return res.status(400).json({ error: 'Invalid DNS record type' });
        }

        res.json({
            domain: cleanDomain,
            type: type.toUpperCase(),
            records: records || []
        });

    } catch (error) {
        console.error('DNS lookup error:', error.message);

        if (error.code === 'ENOTFOUND') {
            return res.status(404).json({
                error: 'Domain not found',
                domain: req.query.domain
            });
        }

        res.status(500).json({
            error: 'DNS lookup failed',
            details: error.message
        });
    }
});

/**
 * GET /api/dns/reverse
 * Perform reverse DNS lookup
 */
router.get('/reverse', async (req, res) => {
    try {
        const { ip } = req.query;

        if (!ip) {
            return res.status(400).json({ error: 'IP address is required' });
        }

        const hostnames = await dns.reverse(ip);

        res.json({
            ip,
            hostnames: hostnames || []
        });

    } catch (error) {
        console.error('Reverse DNS error:', error.message);
        res.status(500).json({
            error: 'Reverse DNS lookup failed',
            details: error.message
        });
    }
});

/**
 * GET /api/dns/whois
 * Perform WHOIS lookup (basic - works on Linux/Mac with whois installed)
 */
router.get('/whois', async (req, res) => {
    try {
        const { domain } = req.query;

        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

        // Try to use system whois command (if available)
        try {
            const { stdout } = await execAsync(`whois ${cleanDomain}`, { timeout: 10000 });

            // Parse basic info
            const registrar = stdout.match(/Registrar:\s*(.+)/i)?.[1]?.trim();
            const creationDate = stdout.match(/Creation Date:\s*(.+)/i)?.[1]?.trim();
            const expiryDate = stdout.match(/Expir[ya].*Date:\s*(.+)/i)?.[1]?.trim();
            const nameServers = stdout.match(/Name Server:\s*(.+)/gi)?.map(ns => ns.split(':')[1].trim());

            res.json({
                domain: cleanDomain,
                registrar,
                creationDate,
                expiryDate,
                nameServers,
                rawOutput: stdout.substring(0, 1000) // First 1000 chars
            });
        } catch (execError) {
            // WHOIS command not available, return basic info
            res.json({
                domain: cleanDomain,
                error: 'WHOIS command not available on this system',
                suggestion: 'Use web-based WHOIS services like whois.domaintools.com'
            });
        }

    } catch (error) {
        console.error('WHOIS lookup error:', error.message);
        res.status(500).json({
            error: 'WHOIS lookup failed',
            details: error.message
        });
    }
});

/**
 * GET /api/dns/comprehensive
 * Perform comprehensive DNS analysis
 */
router.get('/comprehensive', async (req, res) => {
    try {
        const { domain } = req.query;

        if (!domain) {
            return res.status(400).json({ error: 'Domain is required' });
        }

        const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

        // Gather all DNS records in parallel
        const results = await Promise.allSettled([
            dns.resolve4(cleanDomain).catch(() => []),
            dns.resolve6(cleanDomain).catch(() => []),
            dns.resolveMx(cleanDomain).catch(() => []),
            dns.resolveTxt(cleanDomain).catch(() => []),
            dns.resolveNs(cleanDomain).catch(() => []),
            dns.resolveSoa(cleanDomain).catch(() => null)
        ]);

        const [aRecords, aaaaRecords, mxRecords, txtRecords, nsRecords, soaRecord] = results.map(r =>
            r.status === 'fulfilled' ? r.value : null
        );

        // Check for common security headers in TXT records
        const securityChecks = {
            spf: txtRecords?.flat().some(txt => txt.includes('v=spf1')),
            dmarc: false,
            dkim: false
        };

        // Check for DMARC
        try {
            const dmarcRecords = await dns.resolveTxt(`_dmarc.${cleanDomain}`);
            securityChecks.dmarc = dmarcRecords.flat().some(txt => txt.includes('v=DMARC1'));
        } catch { }

        res.json({
            domain: cleanDomain,
            records: {
                A: aRecords || [],
                AAAA: aaaaRecords || [],
                MX: mxRecords || [],
                TXT: txtRecords || [],
                NS: nsRecords || [],
                SOA: soaRecord
            },
            securityChecks,
            analysis: {
                hasIPv4: (aRecords?.length || 0) > 0,
                hasIPv6: (aaaaRecords?.length || 0) > 0,
                hasEmailServers: (mxRecords?.length || 0) > 0,
                nameServerCount: nsRecords?.length || 0,
                emailSecurity: {
                    spf: securityChecks.spf,
                    dmarc: securityChecks.dmarc,
                    score: (securityChecks.spf ? 50 : 0) + (securityChecks.dmarc ? 50 : 0)
                }
            }
        });

    } catch (error) {
        console.error('Comprehensive DNS analysis error:', error.message);
        res.status(500).json({
            error: 'DNS analysis failed',
            details: error.message
        });
    }
});

export default router;
