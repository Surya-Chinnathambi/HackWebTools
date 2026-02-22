import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface PremiumGateProps {
    children: ReactNode;
    feature: string;
    featureName?: string;
    requiredTier?: 'pro' | 'enterprise';
    fallback?: ReactNode;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
    children,
    feature,
    featureName,
    requiredTier = 'pro',
    fallback
}) => {
    const { hasAccess } = useAuth();
    const navigate = useNavigate();

    if (hasAccess(feature)) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Lock className="h-12 w-12 text-primary" />
                    </div>
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                    Premium Feature
                    <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        {requiredTier.toUpperCase()}
                    </Badge>
                </CardTitle>
                <CardDescription className="text-base">
                    {featureName ? `${featureName} is` : 'This feature is'} available for {requiredTier === 'pro' ? 'Pro' : 'Enterprise'} members
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-background/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Unlock this feature with {requiredTier === 'pro' ? 'Pro' : 'Enterprise'}:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {requiredTier === 'pro' ? (
                            <>
                                <li>✅ Unlimited vulnerability scans</li>
                                <li>✅ 50+ premium challenges</li>
                                <li>✅ 20+ structured courses</li>
                                <li>✅ Professional certificates</li>
                                <li>✅ Priority support</li>
                            </>
                        ) : (
                            <>
                                <li>✅ Everything in Pro</li>
                                <li>✅ 1-on-1 mentorship</li>
                                <li>✅ Custom CTF creation</li>
                                <li>✅ White-label certificates</li>
                                <li>✅ 24/7 priority support</li>
                            </>
                        )}
                    </ul>
                </div>
                <div className="flex gap-2 justify-center">
                    <Button onClick={() => navigate('/pricing')} className="bg-gradient-to-r from-primary to-primary/80">
                        View Pricing
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

interface UsageLimitGateProps {
    children: ReactNode;
    feature: 'scans' | 'apiCalls';
    count?: number;
}

export const UsageLimitGate: React.FC<UsageLimitGateProps> = ({
    children,
    feature,
    count = 1
}) => {
    const { canUseFeature, user } = useAuth();
    const navigate = useNavigate();

    if (canUseFeature(feature, count)) {
        return <>{children}</>;
    }

    return (
        <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-amber-500/10 rounded-full">
                        <Lock className="h-12 w-12 text-amber-500" />
                    </div>
                </div>
                <CardTitle>Daily Limit Reached</CardTitle>
                <CardDescription className="text-base">
                    You've reached your daily limit for {feature === 'scans' ? 'vulnerability scans' : 'API calls'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-background/50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-amber-500">
                        {user?.usage[`${feature}Today`]} / {user?.tier === 'free' ? (feature === 'scans' ? '10' : '50') : '∞'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Resets daily at midnight UTC
                    </p>
                </div>
                <div className="bg-background/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Upgrade to Pro for unlimited access:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>✅ Unlimited daily scans</li>
                        <li>✅ 10,000 API calls per day</li>
                        <li>✅ Priority processing</li>
                        <li>✅ Advanced features</li>
                    </ul>
                </div>
                <Button onClick={() => navigate('/pricing')} className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
                    Upgrade to Pro - $19/month
                </Button>
            </CardContent>
        </Card>
    );
};

interface PremiumBadgeProps {
    tier: 'pro' | 'enterprise';
    className?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ tier, className = '' }) => {
    return (
        <Badge
            className={`${tier === 'pro'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                } text-white ${className}`}
        >
            <Lock className="h-3 w-3 mr-1" />
            {tier.toUpperCase()}
        </Badge>
    );
};
