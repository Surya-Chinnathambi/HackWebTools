import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart,
    Users,
    DollarSign,
    TrendingUp,
    Activity,
    Crown,
    BookOpen,
    Trophy,
    AlertCircle
} from 'lucide-react';

interface AnalyticsMetrics {
    totalEvents: number;
    pageViews: number;
    signups: number;
    subscriptions: number;
    toolUsage: number;
    challengeCompletions: number;
    courseEnrollments: number;
    revenue: number;
    byTier: {
        free: number;
        pro: number;
        enterprise: number;
    };
    topPages: Array<{ name: string; count: number }>;
    topTools: Array<{ name: string; count: number }>;
}

interface FunnelData {
    visitors: number;
    signups: number;
    pricingViews: number;
    purchases: number;
    signupRate: string;
    purchaseRate: string;
}

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
    const [funnel, setFunnel] = useState<FunnelData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin (you can add admin role check here)
        if (!user || user.tier !== 'enterprise') {
            navigate('/');
            return;
        }

        fetchAnalytics();
    }, [user, navigate]);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);

            // Fetch metrics
            const metricsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/analytics/summary`);
            const metricsData = await metricsRes.json();
            setMetrics(metricsData);

            // Fetch funnel
            const funnelRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/analytics/funnel`);
            const funnelData = await funnelRes.json();
            setFunnel(funnelData);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor platform performance and user engagement
                    </p>
                </div>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    ADMIN
                </Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`$${metrics?.revenue.toFixed(2) || 0}`}
                    icon={<DollarSign className="h-8 w-8 text-green-500" />}
                    description="All-time earnings"
                    trend="+12% from last month"
                />
                <MetricCard
                    title="Active Subscriptions"
                    value={((metrics?.byTier.pro || 0) + (metrics?.byTier.enterprise || 0)).toString()}
                    icon={<Users className="h-8 w-8 text-blue-500" />}
                    description="Paying customers"
                    trend={`${metrics?.byTier.pro || 0} Pro, ${metrics?.byTier.enterprise || 0} Enterprise`}
                />
                <MetricCard
                    title="Total Signups"
                    value={metrics?.signups.toString() || '0'}
                    icon={<TrendingUp className="h-8 w-8 text-purple-500" />}
                    description="All users"
                    trend={`${metrics?.byTier.free || 0} free users`}
                />
                <MetricCard
                    title="Engagement"
                    value={metrics?.toolUsage.toString() || '0'}
                    icon={<Activity className="h-8 w-8 text-orange-500" />}
                    description="Tool uses today"
                    trend={`${metrics?.challengeCompletions || 0} challenges completed`}
                />
            </div>

            {/* Conversion Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        Conversion Funnel
                    </CardTitle>
                    <CardDescription>Track user journey from visitor to customer</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <FunnelStep
                            label="Visitors"
                            count={funnel?.visitors || 0}
                            percentage={100}
                            color="bg-blue-500"
                        />
                        <FunnelStep
                            label="Signups"
                            count={funnel?.signups || 0}
                            percentage={parseFloat(funnel?.signupRate || '0')}
                            color="bg-green-500"
                        />
                        <FunnelStep
                            label="Pricing Views"
                            count={funnel?.pricingViews || 0}
                            percentage={funnel?.visitors ? ((funnel.pricingViews / funnel.visitors) * 100) : 0}
                            color="bg-yellow-500"
                        />
                        <FunnelStep
                            label="Purchases"
                            count={funnel?.purchases || 0}
                            percentage={parseFloat(funnel?.purchaseRate || '0')}
                            color="bg-purple-500"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Analytics */}
            <Tabs defaultValue="users" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Pages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {metrics?.topPages.map((page, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm">{page.name}</span>
                                            <Badge variant="secondary">{page.count} views</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Tools</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {metrics?.topTools.map((tool, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm">{tool.name}</span>
                                            <Badge variant="secondary">{tool.count} uses</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <MetricCard
                            title="Course Enrollments"
                            value={metrics?.courseEnrollments.toString() || '0'}
                            icon={<BookOpen className="h-8 w-8 text-blue-500" />}
                            description="Total enrollments"
                        />
                        <MetricCard
                            title="Challenge Completions"
                            value={metrics?.challengeCompletions.toString() || '0'}
                            icon={<Trophy className="h-8 w-8 text-yellow-500" />}
                            description="Challenges solved"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="revenue" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pro Subscriptions</p>
                                        <p className="text-2xl font-bold">{metrics?.byTier.pro || 0}</p>
                                    </div>
                                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                        ${((metrics?.byTier.pro || 0) * 19).toFixed(2)}/mo
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Enterprise Subscriptions</p>
                                        <p className="text-2xl font-bold">{metrics?.byTier.enterprise || 0}</p>
                                    </div>
                                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                        ${((metrics?.byTier.enterprise || 0) * 49).toFixed(2)}/mo
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                                        <p className="text-3xl font-bold">
                                            ${(((metrics?.byTier.pro || 0) * 19) + ((metrics?.byTier.enterprise || 0) * 49)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Tips */}
            <Card className="bg-blue-500/5 border-blue-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <AlertCircle className="h-5 w-5" />
                        Quick Tips
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p>• Monitor your conversion funnel to identify drop-off points</p>
                    <p>• Focus on improving the pricing page → purchase conversion rate</p>
                    <p>• Popular tools show what content resonates with users</p>
                    <p>• Aim for 2-5% visitor → signup and 10-20% pricing → purchase conversion</p>
                </CardContent>
            </Card>
        </div>
    );
};

// Metric Card Component
interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    description?: string;
    trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description, trend }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                {trend && <p className="text-xs text-green-600 dark:text-green-400 mt-2">{trend}</p>}
            </CardContent>
        </Card>
    );
};

// Funnel Step Component
interface FunnelStepProps {
    label: string;
    count: number;
    percentage: number;
    color: string;
}

const FunnelStep: React.FC<FunnelStepProps> = ({ label, count, percentage, color }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">
                    {count.toLocaleString()} ({percentage.toFixed(1)}%)
                </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
                <div
                    className={`${color} h-3 rounded-full transition-all`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
