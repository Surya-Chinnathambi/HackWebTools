import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    TrendingUp, Users, DollarSign, Link as LinkIcon, Copy,
    Award, Clock, BarChart3, Gift, Zap, CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AffiliateDashboard = () => {
    const { toast } = useToast();
    const [affiliateAccount, setAffiliateAccount] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [commissions, setCommissions] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);

    // Mock data - replace with actual API calls
    useEffect(() => {
        // Simulate loading affiliate data
        const mockAccount = {
            affiliate_code: 'HACK-JOHNDOE-123',
            referral_url: 'https://hackwebtools.com?ref=HACK-JOHNDOE-123',
            tier: 'bronze',
            commission_rate: 0.25,
            status: 'active'
        };

        const mockStats = {
            total_clicks: 234,
            total_referrals: 18,
            successful_conversions: 12,
            conversion_rate: 5.1,
            total_revenue_generated: 2398800, // in paise (₹23,988)
            total_commission_earned: 599700, // in paise (₹5,997)
            pending_commission: 149925, // in paise (₹1,499.25)
            paid_commission: 449775, // in paise (₹4,497.75)
            clicks_this_month: 45,
            conversions_this_month: 3,
            revenue_this_month: 59700, // in paise (₹597)
            current_tier: 'bronze',
            next_tier: 'silver',
            referrals_to_next_tier: 39
        };

        setAffiliateAccount(mockAccount);
        setStats(mockStats);
        setCommissions([
            {
                commission_id: 'COM-ABC123',
                customer_email: 'user1@example.com',
                order_amount: 19900,
                commission_amount: 4975,
                status: 'approved',
                created_at: '2026-02-20T10:30:00Z'
            },
            {
                commission_id: 'COM-DEF456',
                customer_email: 'user2@example.com',
                order_amount: 149900,
                commission_amount: 37475,
                status: 'pending',
                created_at: '2026-02-22T14:15:00Z'
            }
        ]);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Referral link copied to clipboard"
        });
    };

    const formatCurrency = (paise: number) => {
        return `₹${(paise / 100).toFixed(2)}`;
    };

    const getTierColor = (tier: string) => {
        const colors: Record<string, string> = {
            starter: 'blue',
            bronze: 'amber',
            silver: 'gray',
            gold: 'yellow'
        };
        return colors[tier] || 'blue';
    };

    if (!affiliateAccount) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="h-6 w-6 text-green-500" />
                            Join Affiliate Program
                        </CardTitle>
                        <CardDescription>
                            Earn 20-35% commission on every referral
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-300">
                            Share HackWebTools with your audience and earn passive income. Get your unique referral link and start earning today!
                        </p>
                        <Button className="w-full">
                            Apply Now
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="container mx-auto py-12 px-4 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            Affiliate Dashboard
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Track your referrals and earnings
                        </p>
                    </div>
                    <Badge className={`bg-${getTierColor(affiliateAccount.tier)}-600`}>
                        {affiliateAccount.tier.toUpperCase()} - {(affiliateAccount.commission_rate * 100)}% Commission
                    </Badge>
                </div>

                {/* Referral Link */}
                <Card className="bg-gradient-to-br from-green-950/40 to-emerald-950/40 border-green-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="h-5 w-5" />
                            Your Referral Link
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                value={affiliateAccount.referral_url}
                                readOnly
                                className="flex-1 font-mono text-sm bg-slate-950"
                            />
                            <Button onClick={() => copyToClipboard(affiliateAccount.referral_url)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                        <p className="text-sm text-slate-400">
                            Share this link on social media, blogs, or with your network. You'll earn commission on every successful referral!
                        </p>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid md:grid-cols-4 gap-6">
                        <Card className="bg-slate-900/50 border-blue-500/20">
                            <CardHeader className="pb-3">
                                <CardDescription className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Total Clicks
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.total_clicks}</div>
                                <p className="text-xs text-slate-500">
                                    {stats.clicks_this_month} this month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-green-500/20">
                            <CardHeader className="pb-3">
                                <CardDescription className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Conversions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.successful_conversions}</div>
                                <p className="text-xs text-slate-500">
                                    {stats.conversion_rate.toFixed(1)}% conversion rate
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-purple-500/20">
                            <CardHeader className="pb-3">
                                <CardDescription className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Total Earned
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {formatCurrency(stats.total_commission_earned)}
                                </div>
                                <p className="text-xs text-slate-500">
                                    {formatCurrency(stats.pending_commission)} pending
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-yellow-500/20">
                            <CardHeader className="pb-3">
                                <CardDescription className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    This Month
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {formatCurrency(stats.revenue_this_month * stats.commission_rate)}
                                </div>
                                <p className="text-xs text-slate-500">
                                    {stats.conversions_this_month} conversions
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Tier Progress */}
                {stats && stats.next_tier && (
                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-yellow-500" />
                                Tier Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progress to {stats.next_tier.toUpperCase()}</span>
                                    <span>{stats.referrals_to_next_tier} referrals needed</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                        style={{
                                            width: `${((stats.successful_conversions / (stats.successful_conversions + stats.referrals_to_next_tier)) * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-slate-400">
                                Unlock <strong>{stats.next_tier === 'silver' ? '30%' : '35%'}</strong> commission rate by reaching the next tier!
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs */}
                <Tabs defaultValue="commissions" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="commissions">Commissions</TabsTrigger>
                        <TabsTrigger value="payouts">Payouts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="commissions" className="space-y-4">
                        <Card className="bg-slate-900/50 border-slate-700">
                            <CardHeader>
                                <CardTitle>Recent Commissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {commissions.map((commission) => (
                                        <div
                                            key={commission.commission_id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-slate-950/50 border border-slate-800"
                                        >
                                            <div className="space-y-1">
                                                <div className="font-mono text-sm">{commission.commission_id}</div>
                                                <div className="text-xs text-slate-500">
                                                    {commission.customer_email}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(commission.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <div className="text-lg font-bold text-green-400">
                                                    {formatCurrency(commission.commission_amount)}
                                                </div>
                                                <Badge
                                                    variant={commission.status === 'approved' ? 'default' : 'secondary'}
                                                    className={commission.status === 'approved' ? 'bg-green-600' : ''}
                                                >
                                                    {commission.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payouts" className="space-y-4">
                        <Card className="bg-slate-900/50 border-slate-700">
                            <CardHeader>
                                <CardTitle>Payout History</CardTitle>
                                <CardDescription>
                                    Payouts are processed monthly on the 1st
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {payouts.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">
                                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No payouts yet</p>
                                        <p className="text-sm mt-2">
                                            Minimum payout threshold: ₹1,000
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Payout history will go here */}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Tips */}
                <Card className="bg-gradient-to-br from-blue-950/40 to-purple-950/40 border-blue-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            Tips to Maximize Earnings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>• Share your referral link on social media (Twitter, LinkedIn, Facebook)</li>
                            <li>• Create content about cybersecurity tools and include your affiliate link</li>
                            <li>• Add your referral link to your YouTube video descriptions</li>
                            <li>• Join cybersecurity communities and forums to share HackWebTools</li>
                            <li>• Reach higher tiers (Bronze → Silver → Gold) to earn up to 35% commission</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AffiliateDashboard;
