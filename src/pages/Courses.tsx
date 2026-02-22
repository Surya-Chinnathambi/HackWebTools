import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumGate, PremiumBadge } from '@/components/PremiumGate';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Course, Challenge } from '@/types/subscription';
import { BookOpen, Trophy, Clock, Star, Search, Filter, Play, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample Courses Data
const SAMPLE_COURSES: Course[] = [
    {
        id: 'web-app-pentesting-101',
        title: 'Web Application Penetration Testing 101',
        description: 'Learn the fundamentals of web app security testing including OWASP Top 10, authentication bypasses, and more.',
        thumbnail: '🌐',
        tier: 'free',
        duration: 120,
        difficulty: 'beginner',
        category: 'Web Security',
        enrolledCount: 5420,
        rating: 4.8,
        instructor: 'Sarah Chen',
        modules: [
            {
                id: 'mod1',
                title: 'Introduction to Web Security',
                description: 'Understanding the web security landscape',
                content: 'Module content here...',
                duration: 30,
                resources: []
            }
        ],
        prerequisites: []
    },
    {
        id: 'advanced-sqli',
        title: 'Advanced SQL Injection Techniques',
        description: 'Master blind SQLi, time-based attacks, second-order injection, and database-specific exploits.',
        thumbnail: '💉',
        tier: 'pro',
        duration: 180,
        difficulty: 'advanced',
        category: 'Web Security',
        enrolledCount: 2100,
        rating: 4.9,
        instructor: 'Marcus Johnson',
        modules: [],
        prerequisites: ['web-app-pentesting-101']
    },
    {
        id: 'api-security-mastery',
        title: 'API Security Testing Mastery',
        description: 'Learn to test REST, GraphQL, and SOAP APIs for authentication flaws, injection, and business logic issues.',
        thumbnail: '🔌',
        tier: 'pro',
        duration: 150,
        difficulty: 'intermediate',
        category: 'API Security',
        enrolledCount: 1850,
        rating: 4.7,
        instructor: 'Alex Rivera',
        modules: [],
        prerequisites: []
    },
    {
        id: 'cloud-pentesting',
        title: 'Cloud Penetration Testing (AWS/Azure/GCP)',
        description: 'Discover misconfigurations, privilege escalation, and data exposure in cloud environments.',
        thumbnail: '☁️',
        tier: 'enterprise',
        duration: 240,
        difficulty: 'advanced',
        category: 'Cloud Security',
        enrolledCount: 980,
        rating: 5.0,
        instructor: 'Dr. Emily Watson',
        modules: [],
        prerequisites: ['api-security-mastery']
    },
    {
        id: 'network-pentesting',
        title: 'Network Penetration Testing Fundamentals',
        description: 'Learn network scanning, exploitation, lateral movement, and post-exploitation techniques.',
        thumbnail: '🌐',
        tier: 'free',
        duration: 90,
        difficulty: 'beginner',
        category: 'Network Security',
        enrolledCount: 3200,
        rating: 4.6,
        instructor: 'John Smith',
        modules: [],
        prerequisites: []
    },
    {
        id: 'mobile-app-security',
        title: 'Mobile Application Security Testing',
        description: 'Test Android and iOS apps for common vulnerabilities, reverse engineering, and runtime manipulation.',
        thumbnail: '📱',
        tier: 'pro',
        duration: 200,
        difficulty: 'intermediate',
        category: 'Mobile Security',
        enrolledCount: 1650,
        rating: 4.8,
        instructor: 'Priya Sharma',
        modules: [],
        prerequisites: []
    }
];

// Sample Challenges Data
const SAMPLE_CHALLENGES: Challenge[] = [
    {
        id: 'basic-sqli',
        title: 'SQL Injection: Login Bypass',
        description: 'Bypass authentication using SQL injection',
        difficulty: 'easy',
        category: 'Web Security',
        tier: 'free',
        points: 50,
        flag: 'FLAG{sql_1nj3ct10n_b4s1c}',
        hints: ['Try commenting out the password check', 'Use -- to comment'],
        resources: [],
        completedBy: 8500,
        tags: ['sqli', 'authentication', 'web']
    },
    {
        id: 'blind-sqli',
        title: 'Blind SQL Injection',
        description: 'Extract database information without seeing direct output',
        difficulty: 'medium',
        category: 'Web Security',
        tier: 'pro',
        points: 150,
        flag: 'FLAG{bl1nd_sqli_m4st3r}',
        hints: [],
        resources: [],
        completedBy: 2100,
        tags: ['sqli', 'blind', 'advanced']
    },
    {
        id: 'xss-dom',
        title: 'DOM-Based XSS',
        description: 'Exploit client-side JavaScript vulnerabilities',
        difficulty: 'medium',
        category: 'Web Security',
        tier: 'pro',
        points: 120,
        flag: 'FLAG{d0m_xss_pwn3d}',
        hints: [],
        resources: [],
        completedBy: 1800,
        tags: ['xss', 'dom', 'javascript']
    },
    {
        id: 'advanced-rce',
        title: 'Remote Code Execution Chain',
        description: 'Chain multiple vulnerabilities to achieve RCE',
        difficulty: 'expert',
        category: 'Web Security',
        tier: 'enterprise',
        points: 500,
        flag: 'FLAG{rce_ch41n_m4st3r}',
        hints: [],
        resources: [],
        completedBy: 320,
        tags: ['rce', 'chain', 'advanced']
    }
];

const Courses: React.FC = () => {
    const { user, hasAccess } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [activeTab, setActiveTab] = useState('courses');

    const filteredCourses = SAMPLE_COURSES.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
        return matchesSearch && matchesDifficulty;
    });

    const filteredChallenges = SAMPLE_CHALLENGES.filter(challenge => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
        return matchesSearch && matchesDifficulty;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner':
            case 'easy':
                return 'bg-green-500';
            case 'intermediate':
            case 'medium':
                return 'bg-yellow-500';
            case 'advanced':
            case 'hard':
                return 'bg-orange-500';
            case 'expert':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Courses & Challenges
                </h1>
                <p className="text-xl text-muted-foreground">
                    Master cybersecurity through structured learning paths and hands-on challenges
                </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses and challenges..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('all')}
                        size="sm"
                    >
                        All Levels
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('beginner')}
                        size="sm"
                    >
                        Beginner
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('intermediate')}
                        size="sm"
                    >
                        Intermediate
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('advanced')}
                        size="sm"
                    >
                        Advanced
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="courses">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Courses ({filteredCourses.length})
                    </TabsTrigger>
                    <TabsTrigger value="challenges">
                        <Trophy className="h-4 w-4 mr-2" />
                        Challenges ({filteredChallenges.length})
                    </TabsTrigger>
                </TabsList>

                {/* Courses Tab */}
                <TabsContent value="courses" className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const canAccess = hasAccess('courses') || course.tier === 'free';
                            const isEnrolled = user?.completedCourses?.includes(course.id);

                            return (
                                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="text-4xl">{course.thumbnail}</div>
                                            <div className="flex flex-col gap-2">
                                                {course.tier !== 'free' && <PremiumBadge tier={course.tier as 'pro' | 'enterprise'} />}
                                                <Badge className={getDifficultyColor(course.difficulty)}>
                                                    {course.difficulty}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {course.duration}min
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                                {course.rating}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                {course.enrolledCount.toLocaleString()}
                                            </div>
                                        </div>
                                        {isEnrolled && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Progress</span>
                                                    <span>45%</span>
                                                </div>
                                                <Progress value={45} />
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        {canAccess ? (
                                            <Button className="w-full" onClick={() => navigate(`/courses/${course.id}`)}>
                                                <Play className="h-4 w-4 mr-2" />
                                                {isEnrolled ? 'Continue Learning' : 'Start Course'}
                                            </Button>
                                        ) : (
                                            <Button className="w-full" variant="outline" onClick={() => navigate('/pricing')}>
                                                <Lock className="h-4 w-4 mr-2" />
                                                Unlock with {course.tier}
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* Challenges Tab */}
                <TabsContent value="challenges" className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChallenges.map((challenge) => {
                            const canAccess = hasAccess('premium-challenges') || challenge.tier === 'free';
                            const isCompleted = user?.completedChallenges?.includes(challenge.id);

                            return (
                                <Card key={challenge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge className={getDifficultyColor(challenge.difficulty)}>
                                                {challenge.difficulty}
                                            </Badge>
                                            <div className="flex flex-col gap-2">
                                                {challenge.tier !== 'free' && <PremiumBadge tier={challenge.tier as 'pro' | 'enterprise'} />}
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                                        <CardDescription>{challenge.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Points</span>
                                            <Badge variant="secondary" className="font-bold">
                                                {challenge.points} pts
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Completion</span>
                                            <span>{challenge.completedBy.toLocaleString()} users</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {challenge.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        {canAccess ? (
                                            <Button className="w-full" onClick={() => navigate(`/challenges/${challenge.id}`)}>
                                                <Trophy className="h-4 w-4 mr-2" />
                                                {isCompleted ? '✓ Completed' : 'Start Challenge'}
                                            </Button>
                                        ) : (
                                            <Button className="w-full" variant="outline" onClick={() => navigate('/pricing')}>
                                                <Lock className="h-4 w-4 mr-2" />
                                                Unlock with {challenge.tier}
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Upgrade CTA for Free Users */}
            {user?.tier === 'free' && (
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            Unlock Premium Content
                        </CardTitle>
                        <CardDescription>
                            Get access to 50+ courses and 100+ challenges with Pro or Enterprise
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => navigate('/pricing')} className="bg-gradient-to-r from-amber-500 to-orange-500">
                            View Pricing Plans
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default Courses;
