interface AnalyticsEvent {
    eventName: string;
    eventData?: Record<string, any>;
    userId?: string;
    tier?: string;
    timestamp?: Date;
}

class AnalyticsService {
    private apiUrl: string;
    private isEnabled: boolean;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        this.isEnabled = import.meta.env.PROD; // Only track in production
    }

    /**
     * Track custom event
     */
    async trackEvent(event: AnalyticsEvent): Promise<void> {
        if (!this.isEnabled) {
            console.log('Analytics event (dev):', event);
            return;
        }

        try {
            const payload = {
                ...event,
                timestamp: new Date(),
                userAgent: navigator.userAgent,
                page: window.location.pathname,
                referrer: document.referrer,
            };

            // Send to backend
            await fetch(`${this.apiUrl}/api/analytics/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            // Also track with Google Analytics if available
            if (typeof window.gtag !== 'undefined') {
                window.gtag('event', event.eventName, event.eventData);
            }
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    }

    /**
     * Track page view
     */
    trackPageView(page: string, title?: string): void {
        this.trackEvent({
            eventName: 'page_view',
            eventData: {
                page,
                title: title || document.title,
            },
        });
    }

    /**
     * Track user signup
     */
    trackSignup(userId: string, email: string): void {
        this.trackEvent({
            eventName: 'user_signup',
            userId,
            tier: 'free',
            eventData: { email },
        });
    }

    /**
     * Track subscription purchase
     */
    trackSubscription(userId: string, tier: string, amount: number): void {
        this.trackEvent({
            eventName: 'subscription_purchase',
            userId,
            tier,
            eventData: {
                tier,
                amount,
                currency: 'USD',
            },
        });

        // Track as conversion
        if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'purchase', {
                transaction_id: Date.now().toString(),
                value: amount,
                currency: 'USD',
                items: [{
                    item_id: tier,
                    item_name: `HackWebTools ${tier}`,
                    price: amount,
                }],
            });
        }
    }

    /**
     * Track tool usage
     */
    trackToolUsage(toolName: string, userId?: string, tier?: string): void {
        this.trackEvent({
            eventName: 'tool_usage',
            userId,
            tier,
            eventData: { toolName },
        });
    }

    /**
     * Track challenge completion
     */
    trackChallengeComplete(challengeId: string, userId: string, tier: string, timeSpent: number): void {
        this.trackEvent({
            eventName: 'challenge_complete',
            userId,
            tier,
            eventData: {
                challengeId,
                timeSpent,
            },
        });
    }

    /**
     * Track course enrollment
     */
    trackCourseEnroll(courseId: string, userId: string, tier: string): void {
        this.trackEvent({
            eventName: 'course_enroll',
            userId,
            tier,
            eventData: { courseId },
        });
    }

    /**
     * Track course completion
     */
    trackCourseComplete(courseId: string, userId: string, tier: string, completionRate: number): void {
        this.trackEvent({
            eventName: 'course_complete',
            userId,
            tier,
            eventData: {
                courseId,
                completionRate,
            },
        });
    }

    /**
     * Track feature access attempt (for premium features)
     */
    trackFeatureAccess(feature: string, userId: string, tier: string, hasAccess: boolean): void {
        this.trackEvent({
            eventName: hasAccess ? 'feature_access_granted' : 'feature_access_denied',
            userId,
            tier,
            eventData: {
                feature,
                hasAccess,
            },
        });
    }

    /**
     * Track search queries
     */
    trackSearch(query: string, resultCount: number): void {
        this.trackEvent({
            eventName: 'search',
            eventData: {
                query,
                resultCount,
            },
        });
    }

    /**
     * Track errors
     */
    trackError(errorMessage: string, errorStack?: string): void {
        this.trackEvent({
            eventName: 'error',
            eventData: {
                errorMessage,
                errorStack,
            },
        });
    }

    /**
     * Track pricing page view (important for conversion funnel)
     */
    trackPricingView(source?: string): void {
        this.trackEvent({
            eventName: 'pricing_page_view',
            eventData: { source },
        });
    }

    /**
     * Track CTA clicks
     */
    trackCTAClick(ctaName: string, location: string): void {
        this.trackEvent({
            eventName: 'cta_click',
            eventData: {
                ctaName,
                location,
            },
        });
    }
}

export const analytics = new AnalyticsService();

// Google Analytics script (add to index.html)
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';

export const initGoogleAnalytics = () => {
    if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
        window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID);
};

// Export for window.gtag typing
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}
