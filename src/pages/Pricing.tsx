import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/types/subscription';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateSubscription } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login or create an account to subscribe",
                variant: "destructive"
            });
            navigate('/login');
            return;
        }

        if (plan.tier === 'free') {
            // Downgrade to free
            updateSubscription('free');
            toast({
                title: "Subscription Updated",
                description: "You've been moved to the Free plan"
            });
            return;
        }

        setIsLoading(plan.id);

        try {
            // TODO: Integrate with actual Stripe checkout
            // For now, simulate payment success
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In production, this would be done via webhook after successful payment
            updateSubscription(plan.tier);

            toast({
                title: "🎉 Welcome to " + plan.name + "!",
                description: "Your subscription is now active. Enjoy premium features!",
            });

            navigate('/dashboard');
        } catch (error) {
            console.error('Subscription error:', error);
            toast({
                title: "Payment Failed",
                description: "There was an error processing your payment. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(null);
        }
    };

    const getPlanIcon = (tier: string) => {
        switch (tier) {
            case 'free':
                return <Zap className="h-6 w-6" />;
            case 'pro':
                return <Sparkles className="h-6 w-6" />;
            case 'enterprise':
                return <Crown className="h-6 w-6" />;
            default:
                return null;
        }
    };

    const getPlanGradient = (tier: string) => {
        switch (tier) {
            case 'free':
                return 'from-blue-500 to-cyan-500';
            case 'pro':
                return 'from-amber-500 to-orange-500';
            case 'enterprise':
                return 'from-purple-500 to-pink-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Choose Your Learning Path
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Unlock advanced cybersecurity training, premium challenges, and expert mentorship
                </p>
                {user && (
                    <Badge variant="secondary" className="text-sm">
                        Current Plan: {user.tier.toUpperCase()}
                    </Badge>
                )}
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {SUBSCRIPTION_PLANS.map((plan) => {
                    const isCurrentPlan = user?.tier === plan.tier;
                    const isUpgrade = user && plan.tier !== 'free' && (
                        (user.tier === 'free') ||
                        (user.tier === 'pro' && plan.tier === 'enterprise')
                    );

                    return (
                        <Card
                            key={plan.id}
                            className={`relative overflow-hidden transition-all hover:shadow-2xl ${plan.popular ? 'border-2 border-primary scale-105 shadow-xl' : ''
                                } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 text-xs font-bold">
                                    MOST POPULAR
                                </div>
                            )}

                            {/* Current Plan Badge */}
                            {isCurrentPlan && (
                                <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold">
                                    CURRENT PLAN
                                </div>
                            )}

                            <CardHeader className="space-y-4 pb-8 pt-8">
                                {/* Icon */}
                                <div className={`p-3 rounded-full bg-gradient-to-br ${getPlanGradient(plan.tier)} w-fit`}>
                                    <div className="text-white">
                                        {getPlanIcon(plan.tier)}
                                    </div>
                                </div>

                                {/* Plan Name */}
                                <div>
                                    <CardTitle className="text-3xl">{plan.name}</CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        {plan.tier === 'free' && 'Perfect for getting started'}
                                        {plan.tier === 'pro' && 'For serious learners & job seekers'}
                                        {plan.tier === 'enterprise' && 'For professionals & teams'}
                                    </CardDescription>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold">${plan.price}</span>
                                    <span className="text-muted-foreground">/{plan.interval}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Features List */}
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={isCurrentPlan || isLoading === plan.id}
                                    className={`w-full ${plan.tier !== 'free'
                                            ? `bg-gradient-to-r ${getPlanGradient(plan.tier)} hover:opacity-90`
                                            : ''
                                        }`}
                                    variant={plan.tier === 'free' ? 'outline' : 'default'}
                                >
                                    {isLoading === plan.id && '⏳ Processing...'}
                                    {!isLoading && isCurrentPlan && '✓ Current Plan'}
                                    {!isLoading && !isCurrentPlan && isUpgrade && `Upgrade to ${plan.name}`}
                                    {!isLoading && !isCurrentPlan && !isUpgrade && plan.tier === 'free' && 'Current Plan'}
                                    {!isLoading && !isCurrentPlan && !isUpgrade && plan.tier !== 'free' && `Get ${plan.name}`}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* FAQ or Additional Info */}
            <div className="max-w-4xl mx-auto mt-16 space-y-6">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                We accept all major credit cards, debit cards, and digital wallets via Stripe.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Do you offer student discounts?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Yes! Students get 50% off Pro plans. Contact support with your student ID for verification.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                The Free plan gives you full access to basic features. Upgrade anytime to unlock premium content.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Trust Signals */}
            <div className="text-center space-y-4 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                    🔒 Secure payment processing by Stripe • 💯 30-day money-back guarantee • 🎓 Trusted by 10,000+ students
                </p>
            </div>
        </div>
    );
};

export default Pricing;
