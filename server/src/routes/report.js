import express from 'express';

const router = express.Router();

/**
 * POST /api/report/generate
 * Generate security assessment report
 */
router.post('/generate', async (req, res) => {
    try {
        const {
            projectName,
            findings = [],
            executiveSummary,
            scope
        } = req.body;

        if (!projectName) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        // Calculate statistics
        const stats = {
            critical: findings.filter(f => f.severity === 'critical').length,
            high: findings.filter(f => f.severity === 'high').length,
            medium: findings.filter(f => f.severity === 'medium').length,
            low: findings.filter(f => f.severity === 'low').length,
            total: findings.length
        };

        const report = {
            metadata: {
                projectName,
                generatedAt: new Date().toISOString(),
                version: '1.0'
            },
            executiveSummary: executiveSummary || 'Security assessment completed',
            scope: scope || 'Full application security testing',
            statistics: stats,
            findings: findings.map((finding, index) => ({
                id: index + 1,
                ...finding
            })),
            recommendations: [
                'Address all critical and high severity findings immediately',
                'Implement security headers',
                'Enable HTTPS with strong TLS configuration',
                'Regular security testing and code reviews',
                'Keep all dependencies up to date'
            ]
        };

        res.json(report);

    } catch (error) {
        console.error('Report generation error:', error.message);
        res.status(500).json({
            error: 'Failed to generate report',
            details: error.message
        });
    }
});

/**
 * POST /api/report/pdf
 * Generate PDF report (placeholder - implement with pdfkit or similar)
 */
router.post('/pdf', async (req, res) => {
    try {
        res.json({
            message: 'PDF export endpoint',
            note: 'Implement with pdfkit or jsPDF library',
            recommendation: 'Use pdfmake or pdfkit for server-side PDF generation'
        });

    } catch (error) {
        console.error('PDF generation error:', error.message);
        res.status(500).json({
            error: 'PDF generation failed',
            details: error.message
        });
    }
});

export default router;
