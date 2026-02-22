import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SubscriptionTier, SUBSCRIPTION_PLANS } from '@/types/subscription';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    hasAccess: (feature: string) => boolean;
    canUseFeature: (feature: string, count?: number) => boolean;
    updateSubscription: (tier: SubscriptionTier) => void;
    incrementUsage: (type: 'scans' | 'apiCalls') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('hacktools_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Reset daily usage if needed
            const lastReset = new Date(parsedUser.usage.lastReset);
            const now = new Date();
            if (now.getDate() !== lastReset.getDate()) {
                parsedUser.usage.scansToday = 0;
                parsedUser.usage.apiCallsToday = 0;
                parsedUser.usage.lastReset = now;
            }
            setUser(parsedUser);
        }
        setIsLoading(false);
    }, []);

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('hacktools_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('hacktools_user');
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            // For now, create a demo user
            const demoUser: User = {
                id: '1',
                email,
                name: email.split('@')[0],
                tier: 'free',
                createdAt: new Date(),
                usage: {
                    scansToday: 0,
                    apiCallsToday: 0,
                    lastReset: new Date()
                },
                completedCourses: [],
                completedChallenges: [],
                achievements: []
            };
            setUser(demoUser);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            const newUser: User = {
                id: Date.now().toString(),
                email,
                name,
                tier: 'free',
                createdAt: new Date(),
                usage: {
                    scansToday: 0,
                    apiCallsToday: 0,
                    lastReset: new Date()
                },
                completedCourses: [],
                completedChallenges: [],
                achievements: [
                    {
                        id: 'welcome',
                        name: 'Welcome Aboard!',
                        description: 'Created your HackTools account',
                        icon: '🎉',
                        unlockedAt: new Date()
                    }
                ]
            };
            setUser(newUser);
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const hasAccess = (feature: string): boolean => {
        if (!user) return false;

        // Import feature flags
        const FEATURE_FLAGS: Record<string, SubscriptionTier[]> = {
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

        const allowedTiers = FEATURE_FLAGS[feature];
        if (!allowedTiers) return true; // Feature not restricted

        return allowedTiers.includes(user.tier);
    };

    const canUseFeature = (feature: string, count: number = 1): boolean => {
        if (!user) return false;

        const plan = SUBSCRIPTION_PLANS.find(p => p.tier === user.tier);
        if (!plan) return false;

        switch (feature) {
            case 'scans':
                if (plan.limits.dailyScans === -1) return true;
                return user.usage.scansToday + count <= (plan.limits.dailyScans || 0);

            case 'apiCalls':
                if (plan.limits.apiCalls === -1) return true;
                return user.usage.apiCallsToday + count <= (plan.limits.apiCalls || 0);

            default:
                return true;
        }
    };

    const incrementUsage = (type: 'scans' | 'apiCalls') => {
        if (!user) return;

        setUser(prev => {
            if (!prev) return null;
            return {
                ...prev,
                usage: {
                    ...prev.usage,
                    [`${type}Today`]: prev.usage[`${type}Today`] + 1
                }
            };
        });
    };

    const updateSubscription = (tier: SubscriptionTier) => {
        if (!user) return;

        setUser(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tier,
                subscription: tier !== 'free' ? {
                    planId: tier,
                    status: 'active',
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    cancelAtPeriodEnd: false
                } : undefined
            };
        });
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        hasAccess,
        canUseFeature,
        updateSubscription,
        incrementUsage
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
