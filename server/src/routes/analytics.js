import express from 'express';

const router = express.Router();

// In-memory storage (replace with MongoDB in production)
const analyticsEvents = [];

/**
 * Track analytics event
 * POST /api/analytics/track
 */
router.post('/track', async (req, res) => {
    try {
        const event = {
            ...req.body,
            ip: req.ip,
            timestamp: new Date(),
        };

        // Store event (in production, save to MongoDB)
        analyticsEvents.push(event);

        // Keep only last 10,000 events in memory
        if (analyticsEvents.length > 10000) {
            analyticsEvents.shift();
        }

        // TODO: Save to MongoDB
        // await AnalyticsEvent.create(event);

        res.json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        res.status(500).json({ error: 'Failed to track event' });
    }
});

/**
 * Get analytics summary
 * GET /api/analytics/summary
 */
router.get('/summary', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Filter events by date range
        let filtered = analyticsEvents;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            filtered = analyticsEvents.filter(e => {
                const eventDate = new Date(e.timestamp);
                return eventDate >= start && eventDate <= end;
            });
        }

        // Calculate metrics
        const metrics = {
            totalEvents: filtered.length,
            pageViews: filtered.filter(e => e.eventName === 'page_view').length,
            signups: filtered.filter(e => e.eventName === 'user_signup').length,
            subscriptions: filtered.filter(e => e.eventName === 'subscription_purchase').length,
            toolUsage: filtered.filter(e => e.eventName === 'tool_usage').length,
            challengeCompletions: filtered.filter(e => e.eventName === 'challenge_complete').length,
            courseEnrollments: filtered.filter(e => e.eventName === 'course_enroll').length,

            // Revenue
            revenue: filtered
                .filter(e => e.eventName === 'subscription_purchase')
                .reduce((sum, e) => sum + (e.eventData?.amount || 0), 0),

            // By tier
            byTier: {
                free: filtered.filter(e => e.tier === 'free').length,
                pro: filtered.filter(e => e.tier === 'pro').length,
                enterprise: filtered.filter(e => e.tier === 'enterprise').length,
            },

            // Top pages
            topPages: getTopItems(
                filtered.filter(e => e.eventName === 'page_view'),
                'eventData.page',
                10
            ),

            // Top tools
            topTools: getTopItems(
                filtered.filter(e => e.eventName === 'tool_usage'),
                'eventData.toolName',
                10
            ),
        };

        res.json(metrics);
    } catch (error) {
        console.error('Analytics summary error:', error);
        res.status(500).json({ error: 'Failed to get analytics summary' });
    }
});

/**
 * Get conversion funnel data
 * GET /api/analytics/funnel
 */
router.get('/funnel', async (req, res) => {
    try {
        const funnel = {
            visitors: analyticsEvents.filter(e => e.eventName === 'page_view').length,
            signups: analyticsEvents.filter(e => e.eventName === 'user_signup').length,
            pricingViews: analyticsEvents.filter(e => e.eventName === 'pricing_page_view').length,
            purchases: analyticsEvents.filter(e => e.eventName === 'subscription_purchase').length,
        };

        // Calculate conversion rates
        funnel.signupRate = funnel.visitors > 0
            ? ((funnel.signups / funnel.visitors) * 100).toFixed(2)
            : '0.00';

        funnel.purchaseRate = funnel.pricingViews > 0
            ? ((funnel.purchases / funnel.pricingViews) * 100).toFixed(2)
            : '0.00';

        res.json(funnel);
    } catch (error) {
        console.error('Funnel analytics error:', error);
        res.status(500).json({ error: 'Failed to get funnel data' });
    }
});

/**
 * Get user activity timeline
 * GET /api/analytics/timeline/:userId
 */
router.get('/timeline/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const userEvents = analyticsEvents
            .filter(e => e.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 100); // Last 100 events

        res.json(userEvents);
    } catch (error) {
        console.error('Timeline error:', error);
        res.status(500).json({ error: 'Failed to get timeline' });
    }
});

// Helper function to get top items
function getTopItems(events, path, limit = 10) {
    const counts = {};

    events.forEach(event => {
        const value = getNestedValue(event, path);
        if (value) {
            counts[value] = (counts[value] || 0) + 1;
        }
    });

    return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

export default router;
