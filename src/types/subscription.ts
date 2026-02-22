// Subscription and User Management Types

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
    id: string;
    name: string;
    tier: SubscriptionTier;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    limits: {
        dailyScans?: number;
        concurrentTools?: number;
        apiCalls?: number;
        challenges?: number;
        courses?: number;
        certificateTypes?: string[];
    };
    stripePriceId?: string;
    popular?: boolean;
}

export interface User {
    id: string;
    email: string;
    name: string;
    tier: SubscriptionTier;
    createdAt: Date;
    subscription?: {
        planId: string;
        status: 'active' | 'canceled' | 'past_due' | 'trialing';
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
    };
    usage: {
        scansToday: number;
        apiCallsToday: number;
        lastReset: Date;
    };
    completedCourses: string[];
    completedChallenges: string[];
    achievements: Achievement[];
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
    tier?: SubscriptionTier;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    tier: SubscriptionTier;
    duration: number; // in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    modules: CourseModule[];
    prerequisites: string[];
    enrolledCount: number;
    rating: number;
    instructor: string;
}

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    content: string;
    videoUrl?: string;
    duration: number;
    resources: Resource[];
    quiz?: Quiz;
    completed?: boolean;
}

export interface Resource {
    id: string;
    name: string;
    type: 'pdf' | 'video' | 'link' | 'worksheet';
    url: string;
    tier?: SubscriptionTier;
}

export interface Quiz {
    id: string;
    questions: QuizQuestion[];
    passingScore: number;
    attempts?: number;
    completed?: boolean;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    category: string;
    tier: SubscriptionTier;
    points: number;
    flag: string;
    hints: string[];
    resources: string[];
    environment?: string;
    completedBy: number;
    tags: string[];
}

export interface AnalyticsEvent {
    userId: string;
    eventType: string;
    eventData: Record<string, any>;
    timestamp: Date;
    tier: SubscriptionTier;
}

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'Free',
        tier: 'free',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: [
            'Access to 100+ basic security tools',
            '10 daily vulnerability scans',
            'Basic SQL injection lab',
            'Terminal simulator',
            '5 beginner challenges',
            'Community support',
            'Basic certificates',
            'Public payloads library'
        ],
        limits: {
            dailyScans: 10,
            concurrentTools: 2,
            apiCalls: 50,
            challenges: 5,
            courses: 2,
            certificateTypes: ['basic']
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        tier: 'pro',
        price: 19,
        currency: 'USD',
        interval: 'month',
        popular: true,
        stripePriceId: 'price_pro_monthly', // Replace with actual Stripe price ID
        features: [
            'Everything in Free',
            'Unlimited vulnerability scans',
            'Advanced OWASP Top 10 labs',
            'Access to 50+ premium challenges',
            '20+ structured courses',
            'Live threat intelligence feed',
            'API integration with 10K calls/day',
            'Advanced XSS, SQLi, RCE labs',
            'Priority email support',
            'Professional certificates',
            'Custom wordlist generation',
            'Downloadable course materials',
            'Interview preparation resources',
            'No ads'
        ],
        limits: {
            dailyScans: -1, // unlimited
            concurrentTools: 10,
            apiCalls: 10000,
            challenges: 50,
            courses: 20,
            certificateTypes: ['basic', 'professional']
        }
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tier: 'enterprise',
        price: 49,
        currency: 'USD',
        interval: 'month',
        stripePriceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
        features: [
            'Everything in Pro',
            'Unlimited everything',
            'All challenges unlocked (100+)',
            'All courses (50+)',
            'Custom lab environments',
            '1-on-1 mentorship sessions',
            'Private Discord/Slack channel',
            'White-label certificates',
            'API access with custom limits',
            'Advanced analytics dashboard',
            'Team collaboration features',
            'Custom CTF creation',
            'CVE database full access',
            'Penetration testing reports',
            'Job placement assistance',
            '24/7 priority support'
        ],
        limits: {
            dailyScans: -1,
            concurrentTools: -1,
            apiCalls: -1,
            challenges: -1,
            courses: -1,
            certificateTypes: ['basic', 'professional', 'expert']
        }
    }
];

export const FEATURE_FLAGS = {
    'advanced-labs': ['pro', 'enterprise'],
    'premium-challenges': ['pro', 'enterprise'],
    'unlimited-scans': ['pro', 'enterprise'],
    'courses': ['pro', 'enterprise'],
    'threat-intel': ['pro', 'enterprise'],
    'api-access': ['pro', 'enterprise'],
    'mentorship': ['enterprise'],
    'custom-ctf': ['enterprise'],
    'white-label': ['enterprise'],
    'team-features': ['enterprise']
};
