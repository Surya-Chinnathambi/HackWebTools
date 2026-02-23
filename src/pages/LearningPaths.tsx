import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, BookOpen, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface PathModule {
    id: string;
    title: string;
    description: string;
    estimated_hours: number;
    topics: string[];
    resources: string[];
    quiz_id?: string;
    challenge_id?: string;
    order: number;
}

interface LearningPath {
    id: string;
    name: string;
    level: string;
    description: string;
    icon: string;
    color: string;
    estimated_total_hours: number;
    modules: PathModule[];
    prerequisites: string[];
    completion_percentage_required: number;
    skills_gained: string[];
    certificate_awarded: string;
}

interface UserPathProgress {
    path_id: string;
    enrolled_at: string;
    completed_modules: string[];
    current_module: string | null;
    completion_percentage: number;
    is_completed: boolean;
    completed_at: string | null;
    time_spent_hours: number;
}

interface PathResponse {
    path: LearningPath;
    user_progress: UserPathProgress | null;
    is_locked: boolean;
    unlock_requirements: string | null;
}

const LearningPaths: React.FC = () => {
    const [paths, setPaths] = useState<PathResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPath, setSelectedPath] = useState<PathResponse | null>(null);

    useEffect(() => {
        fetchPaths();
    }, []);

    const fetchPaths = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/learning-paths`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPaths(data);
            }
        } catch (error) {
            console.error('Failed to fetch learning paths:', error);
        } finally {
            setLoading(false);
        }
    };

    const enrollInPath = async (pathId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/learning-paths/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ path_id: pathId })
            });

            if (response.ok) {
                fetchPaths(); // Refresh paths
            } else {
                const error = await response.json();
                alert(error.detail);
            }
        } catch (error) {
            console.error('Failed to enroll:', error);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-green-500';
            case 'intermediate': return 'bg-orange-500';
            case 'advanced': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getLevelBadgeColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-orange-100 text-orange-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Learning Paths</h1>
                <p className="text-muted-foreground">
                    Structured curriculum from beginner to advanced cybersecurity
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paths.map((pathResponse) => {
                    const { path, user_progress, is_locked, unlock_requirements } = pathResponse;
                    const isEnrolled = user_progress !== null;
                    const completionPct = user_progress?.completion_percentage || 0;

                    return (
                        <motion.div
                            key={path.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card
                                className={`relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${is_locked ? 'opacity-60' : ''
                                    }`}
                                onClick={() => setSelectedPath(pathResponse)}
                            >
                                {/* Colored header bar */}
                                <div
                                    className="h-2"
                                    style={{ backgroundColor: path.color }}
                                />

                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl">{path.icon}</span>
                                            <div>
                                                <CardTitle className="text-xl">{path.name}</CardTitle>
                                                <Badge className={`mt-1 ${getLevelBadgeColor(path.level)}`}>
                                                    {path.level.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                        {is_locked && <Lock className="text-muted-foreground" size={20} />}
                                    </div>
                                    <CardDescription className="mt-2">
                                        {path.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {/* Progress bar for enrolled users */}
                                    {isEnrolled && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Progress</span>
                                                <span className="text-sm text-muted-foreground">{completionPct}%</span>
                                            </div>
                                            <Progress value={completionPct} />
                                            {user_progress.is_completed && (
                                                <div className="flex items-center gap-2 mt-2 text-green-600">
                                                    <CheckCircle size={16} />
                                                    <span className="text-sm font-medium">Completed!</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <BookOpen size={16} />
                                            <span>{path.modules.length} modules</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock size={16} />
                                            <span>{path.estimated_total_hours} hours</span>
                                        </div>
                                        {isEnrolled && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Award size={16} />
                                                <span>{user_progress.completed_modules.length}/{path.modules.length} modules done</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Lock message */}
                                    {is_locked && unlock_requirements && (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                                            <p className="text-sm text-yellow-800">{unlock_requirements}</p>
                                        </div>
                                    )}

                                    {/* Action button */}
                                    {!is_locked && !isEnrolled && (
                                        <Button
                                            className="w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                enrollInPath(path.id);
                                            }}
                                        >
                                            Enroll Now
                                        </Button>
                                    )}

                                    {isEnrolled && (
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPath(pathResponse);
                                            }}
                                        >
                                            Continue Learning
                                            <ChevronRight size={16} className="ml-2" />
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Path details modal would go here */}
            {selectedPath && (
                <PathDetailsModal
                    pathResponse={selectedPath}
                    onClose={() => setSelectedPath(null)}
                    onRefresh={fetchPaths}
                />
            )}
        </div>
    );
};

// Separate component for path details modal
const PathDetailsModal: React.FC<{
    pathResponse: PathResponse;
    onClose: () => void;
    onRefresh: () => void;
}> = ({ pathResponse, onClose, onRefresh }) => {
    const { path, user_progress } = pathResponse;

    const completeModule = async (moduleId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/learning-paths/complete-module`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    path_id: path.id,
                    module_id: moduleId,
                    time_spent_minutes: 30 // Default time
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to complete module:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">{path.icon}</span>
                                <h2 className="text-3xl font-bold">{path.name}</h2>
                            </div>
                            <p className="text-muted-foreground">{path.description}</p>
                        </div>
                        <Button variant="ghost" onClick={onClose}>✕</Button>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Skills You'll Gain:</h3>
                        <div className="flex flex-wrap gap-2">
                            {path.skills_gained.map((skill, idx) => (
                                <Badge key={idx} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>

                    {/* Modules */}
                    <div>
                        <h3 className="font-semibold mb-4">Modules ({path.modules.length})</h3>
                        <div className="space-y-4">
                            {path.modules.map((module) => {
                                const isCompleted = user_progress?.completed_modules.includes(module.id);
                                const isCurrent = user_progress?.current_module === module.id;

                                return (
                                    <Card key={module.id} className={isCurrent ? 'border-primary' : ''}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {isCompleted ? (
                                                            <CheckCircle className="text-green-600" size={20} />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full border-2 border-muted" />
                                                        )}
                                                        <h4 className="font-semibold">{module.title}</h4>
                                                        {isCurrent && <Badge>Current</Badge>}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>⏱️ {module.estimated_hours}h</span>
                                                        <span>📚 {module.topics.length} topics</span>
                                                    </div>
                                                </div>
                                                {user_progress && !isCompleted && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => completeModule(module.id)}
                                                    >
                                                        Mark Complete
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Certificate */}
                    {user_progress?.is_completed && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-800">
                                <Award size={24} />
                                <div>
                                    <p className="font-semibold">Certificate Earned!</p>
                                    <p className="text-sm">{path.certificate_awarded}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningPaths;
