import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Check, Sparkles, Crown, Zap, Globe, MapPin, Users,
    TrendingUp, Gift, DollarSign, Award, Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [region, setRegion] = useState<'global' | 'india'>('india');

    // Global (Stripe) Pricing
    const stripePlans = [
        {
            id: 'stripe-free',
            name: 'Free',
            price: 0,
            currency: '$',
            interval: 'forever',
            tier: 'free',
            popular: false,
            features: [
                '✓ 50+ security tools',
                '✓ Basic learning paths',
                '✓ Community forum access',
                '✓ Basic payloads library',
                '✗ Premium tools',
                '✗ Advanced labs',
                '✗ Certificates'
            ]
        },
        {
            id: 'stripe-pro',
            name: 'Pro',
            price: 19,
            currency: '$',
            interval: 'month',
            tier: 'pro',
            popular: true,
            features: [
                '✓ Everything in Free',
                '✓ All premium tools unlocked',
                '✓ Advanced practice labs',
                '✓ Quiz arena challenges',
                '✓ Professional certificates',
                '✓ Priority community support',
                '✓ Ad-free experience',
                '✓ Downloadable resources'
            ]
        },
        {
            id: 'stripe-enterprise',
            name: 'Enterprise',
            price: 49,
            currency: '$',
            interval: 'month',
            tier: 'enterprise',
            popular: false,
            features: [
                '✓ Everything in Pro',
                '✓ Private mentorship sessions',
                '✓ Custom learning paths',
                '✓ Team collaboration tools',
                '✓ Advanced analytics',
                '✓ API access',
                '✓ White-label options',
                '✓ 24/7 priority support'
            ]
        }
    ];

    // Indian (Razorpay) Pricing
    const razorpayPlans = [
        {
            id: 'rzp-free',
            name: 'Free',
            price: 0,
            currency: '₹',
            interval: 'forever',
            tier: 'free',
            popular: false,
            features: [
                '✓ 50+ security tools',
                '✓ Basic learning paths',
                '✓ Community forum access',
                '✓ Basic payloads library',
                '✗ Premium tools',
                '✗ Advanced labs',
                '✗ Certificates'
            ]
        },
        {
            id: 'rzp-pro-monthly',
            name: 'Pro Monthly',
            price: 199,
            currency: '₹',
            interval: 'month',
            tier: 'pro',
            popular: false,
            features: [
                '✓ Everything in Free',
                '✓ All premium tools unlocked',
                '✓ Advanced practice labs',
                '✓ Quiz arena challenges',
                '✓ Professional certificates',
                '✓ Priority community support',
                '✓ Ad-free experience'
            ]
        },
        {
            id: 'rzp-pro-yearly',
            name: 'Pro Yearly',
            price: 1499,
            pricePerMonth: 125,
            currency: '₹',
            interval: 'year',
            tier: 'pro',
            popular: true,
            discount: '37% OFF',
            features: [
                '✓ Everything in Pro Monthly',
                '✓ Save ₹900 annually',
                '✓ Lifetime certificate access',
                '✓ Bonus: Interview prep guide',
                '✓ Exclusive webinar access'
            ]
        },
        {
            id: 'rzp-enterprise-monthly',
            name: 'Enterprise Monthly',
            price: 499,
            currency: '₹',
            interval: 'month',
            tier: 'enterprise',
            popular: false,
            features: [
                '✓ Everything in Pro',
                '✓ Private mentorship (2 sessions/mo)',
                '✓ Custom learning paths',
                '✓ Advanced analytics',
                '✓ Priority support',
                '✓ API access'
            ]
        },
        {
            id: 'rzp-enterprise-yearly',
            name: 'Enterprise Yearly',
            price: 4999,
            pricePerMonth: 416,
            currency: '₹',
            interval: 'year',
            tier: 'enterprise',
            popular: false,
            discount: '17% OFF',
            features: [
                '✓ Everything in Enterprise Monthly',
                '✓ Save ₹1000 annually',
                '✓ 4 mentorship sessions/month',
                '✓ Dedicated account manager'
            ]
        }
    ];

    const handleSubscribe = async (planId: string, tier: string) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login or create an account to subscribe",
                variant: "destructive"
            });
            navigate('/login');
            return;
        }

        if (tier === 'free') {
            toast({
                title: "You're on the Free Plan",
                description: "Upgrade to unlock premium features!"
            });
            return;
        }

        setIsLoading(planId);

        try {
            // Navigate to checkout based on region
            if (region === 'india') {
                // Use Razorpay
                toast({
                    title: "Redirecting to Razorpay...",
                    description: "Secure payment processing for India"
                });
                // TODO: Implement Razorpay checkout
            } else {
                // Use Stripe
                toast({
                    title: "Redirecting to Stripe...",
                    description: "Secure international payment processing"
                });
                // TODO: Implement Stripe checkout
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            console.error('Subscription error:', error);
            toast({
                title: "Error",
                description: "Failed to initiate checkout. Please try again.",
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
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="container mx-auto py-12 px-4 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Invest in Your Cybersecurity Career
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Join 10,000+ professionals mastering cybersecurity with hands-on labs, expert mentorship, and industry-recognized certificates
                    </p>
                </div>

                {/* Region Selector */}
                <div className="flex justify-center gap-4">
                    <Button
                        variant={region === 'global' ? 'default' : 'outline'}
                        onClick={() => setRegion('global')}
                        className="flex items-center gap-2"
                    >
                        <Globe className="h-4 w-4" />
                        International (USD)
                    </Button>
                    <Button
                        variant={region === 'india' ? 'default' : 'outline'}
                        onClick={() => setRegion('india')}
                        className="flex items-center gap-2"
                    >
                        <MapPin className="h-4 w-4" />
                        India (INR)
                    </Button>
                </div>

                {/* Pricing Plans */}
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                    {(region === 'global' ? stripePlans : razorpayPlans).map((plan: any) => (
                        <Card
                            key={plan.id}
                            className={`relative overflow-hidden transition-all hover:shadow-2xl border-slate-700 ${plan.popular ? 'border-2 border-amber-500 scale-105 shadow-xl shadow-amber-500/20' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-bold">
                                    BEST VALUE
                                </div>
                            )}
                            {plan.discount && (
                                <div className="absolute top-0 left-0 bg-green-600 text-white px-3 py-1 text-xs font-bold">
                                    {plan.discount}
                                </div>
                            )}

                            <CardHeader className="space-y-4">
                                <div className={`p-3 rounded-full bg-gradient-to-br ${getPlanGradient(plan.tier)} w-fit`}>
                                    <div className="text-white">
                                        {getPlanIcon(plan.tier)}
                                    </div>
                                </div>

                                <div>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                </div>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.currency}{plan.price}</span>
                                    <span className="text-slate-400">/{plan.interval}</span>
                                </div>
                                {plan.pricePerMonth && (
                                    <p className="text-sm text-green-400">
                                        {plan.currency}{plan.pricePerMonth}/month
                                    </p>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <ul className="space-y-2">
                                    {plan.features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            {feature.startsWith('✓') ? (
                                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <span className="text-slate-600">✗</span>
                                            )}
                                            <span className={feature.startsWith('✗') ? 'text-slate-600' : ''}>
                                                {feature.replace('✓ ', '').replace('✗ ', '')}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    onClick={() => handleSubscribe(plan.id, plan.tier)}
                                    disabled={isLoading === plan.id}
                                    className={`w-full ${plan.tier !== 'free'
                                            ? `bg-gradient-to-r ${getPlanGradient(plan.tier)} hover:opacity-90`
                                            : ''
                                        }`}
                                    variant={plan.tier === 'free' ? 'outline' : 'default'}
                                >
                                    {isLoading === plan.id ? '⏳ Processing...' :
                                        plan.tier === 'free' ? 'Get Started Free' : 'Get Started'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Institutional Plans */}
                <Card className="bg-gradient-to-br from-blue-950/40 to-purple-950/40 border-blue-500/30 max-w-5xl mx-auto">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Building className="h-8 w-8 text-blue-400" />
                            <div>
                                <CardTitle className="text-3xl">Institutional Plans</CardTitle>
                                <CardDescription className="text-lg">
                                    For colleges, training centers, and corporate teams
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-yellow-500" />
                                    Features
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li>• Minimum 10 seats, scalable to 1000+</li>
                                    <li>• Dedicated admin dashboard</li>
                                    <li>• Student progress tracking</li>
                                    <li>• Bulk certificate generation</li>
                                    <li>• Custom branding options</li>
                                    <li>• LMS integration support</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-500" />
                                    Pricing
                                </h4>
                                <div className="space-y-3">
                                    <div className="text-4xl font-bold">
                                        {region === 'india' ? '₹2,999' : '$99'}
                                        <span className="text-lg text-slate-400">/month</span>
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        Per seat pricing. Volume discounts available for 50+ seats.
                                    </p>
                                    <Button className="w-full" variant="default">
                                        Contact Sales
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Affiliate Program */}
                <Card className="bg-gradient-to-br from-green-950/40 to-emerald-950/40 border-green-500/30 max-w-5xl mx-auto">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Gift className="h-8 w-8 text-green-400" />
                            <div>
                                <CardTitle className="text-3xl">Affiliate Program</CardTitle>
                                <CardDescription className="text-lg">
                                    Earn 20-35% commission for every referral
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4 text-center">
                            {[
                                { tier: 'Starter', rate: '20%', referrals: '0-10', color: 'blue' },
                                { tier: 'Bronze', rate: '25%', referrals: '11-50', color: 'amber' },
                                { tier: 'Silver', rate: '30%', referrals: '51-100', color: 'gray' },
                                { tier: 'Gold', rate: '35%', referrals: '101+', color: 'yellow' }
                            ].map((tier) => (
                                <div key={tier.tier} className={`p-4 rounded-lg bg-${tier.color}-950/30 border border-${tier.color}-500/30`}>
                                    <div className="text-2xl font-bold text-${tier.color}-400">{tier.rate}</div>
                                    <div className="text-sm font-semibold">{tier.tier}</div>
                                    <div className="text-xs text-slate-400">{tier.referrals} referrals</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span>Monthly payouts • Real-time tracking • Marketing materials included</span>
                            </div>
                            <Button onClick={() => navigate('/affiliates')}>
                                Join Affiliate Program
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* FAQ */}
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                q: 'Can I cancel anytime?',
                                a: 'Yes! Cancel anytime. You\'ll retain access until the end of your billing period with no penalties.'
                            },
                            {
                                q: 'What payment methods are accepted?',
                                a: region === 'india'
                                    ? 'We accept UPI, cards, netbanking, and wallets via Razorpay for Indian customers.'
                                    : 'We accept all major credit/debit cards and digital wallets via Stripe.'
                            },
                            {
                                q: 'Do you offer refunds?',
                                a: '30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your first payment in full.'
                            },
                            {
                                q: 'Are certificates industry-recognized?',
                                a: 'Yes! Our certificates include verification URLs and can be shared on LinkedIn to showcase your skills.'
                            }
                        ].map((faq, idx) => (
                            <Card key={idx} className="bg-slate-900/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-300">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="text-center space-y-4 pt-8 border-t border-slate-800">
                    <p className="text-sm text-slate-400">
                        🔒 Secure payment processing • 💯 30-day money-back guarantee • 🎓 Trusted by 10,000+ students worldwide
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
