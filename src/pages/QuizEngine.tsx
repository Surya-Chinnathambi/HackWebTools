import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, CheckCircle, XCircle, Award, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface QuizQuestion {
    id: string;
    question: string;
    question_type: string;
    options: string[];
    difficulty: string;
    points: number;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    category: string;
    total_questions: number;
    time_limit_minutes: number;
    passing_score: number;
    questions: QuizQuestion[];
}

const QuizEngine: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (quizStarted && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (quizStarted && timeLeft === 0) {
            handleSubmitQuiz();
        }
    }, [quizStarted, timeLeft]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/v1/quizzes/categories');
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const startQuiz = async (category: string) => {
        try {
            const response = await fetch(`/api/v1/quizzes/generate/${category}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const quizData = await response.json();
                setQuiz(quizData);
                setSelectedCategory(category);
                setTimeLeft(quizData.time_limit_minutes * 60);
                setQuizStarted(true);
                setCurrentQuestionIndex(0);
                setAnswers({});

                // Fetch leaderboard
                fetchLeaderboard(category);
            }
        } catch (error) {
            console.error('Failed to start quiz:', error);
        }
    };

    const fetchLeaderboard = async (category: string) => {
        try {
            const response = await fetch(`/api/v1/quizzes/leaderboard/${category}`);
            const data = await response.json();
            setLeaderboard(data);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        }
    };

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmitQuiz = async () => {
        if (!quiz) return;

        const startTime = quiz.time_limit_minutes * 60;
        const timeTaken = startTime - timeLeft;

        try {
            const response = await fetch('/api/v1/quizzes/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    quiz_id: quiz.id,
                    answers: answers,
                    time_taken_seconds: timeTaken
                })
            });

            if (response.ok) {
                const resultData = await response.json();
                setResult(resultData);
                setQuizSubmitted(true);

                // Refresh leaderboard
                if (selectedCategory) {
                    fetchLeaderboard(selectedCategory);
                }
            }
        } catch (error) {
            console.error('Failed to submit quiz:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!quizStarted) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">🎯 Quiz Arena</h1>
                    <p className="text-muted-foreground">
                        Test your cybersecurity knowledge and compete on the leaderboard
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <motion.div
                            key={category}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="uppercase">{category}</CardTitle>
                                    <CardDescription>
                                        10 questions • 15 minutes • 70% to pass
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        className="w-full"
                                        onClick={() => startQuiz(category)}
                                    >
                                        Start Quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    if (quizSubmitted && result) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                            {result.passed ? (
                                <Trophy className="w-16 h-16 text-yellow-500" />
                            ) : (
                                <Target className="w-16 h-16 text-muted-foreground" />
                            )}
                        </div>
                        <CardTitle className="text-3xl">
                            {result.passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}
                        </CardTitle>
                        <CardDescription>
                            {result.passed
                                ? `You passed with ${result.score}%!`
                                : `You scored ${result.score}%. Need 70% to pass.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{result.score}%</div>
                                <div className="text-sm text-muted-foreground">Score</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{result.correct_answers}/{result.total_questions}</div>
                                <div className="text-sm text-muted-foreground">Correct</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{formatTime(result.time_taken_seconds)}</div>
                                <div className="text-sm text-muted-foreground">Time</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{result.points_earned}</div>
                                <div className="text-sm text-muted-foreground">Points</div>
                            </div>
                        </div>

                        {/* Answer Review */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Answer Review</h3>
                            {result.answers_review.map((review: any, idx: number) => (
                                <Card key={idx} className={review.is_correct ? 'border-green-500' : 'border-red-500'}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-2 mb-2">
                                            {review.is_correct ? (
                                                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                                            ) : (
                                                <XCircle className="text-red-600 flex-shrink-0" size={20} />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium mb-2">{review.question}</p>
                                                <div className="text-sm space-y-1">
                                                    <p>
                                                        <span className="font-medium">Your answer:</span>{' '}
                                                        <span className={review.is_correct ? 'text-green-600' : 'text-red-600'}>
                                                            {review.user_answer}
                                                        </span>
                                                    </p>
                                                    {!review.is_correct && (
                                                        <p>
                                                            <span className="font-medium">Correct answer:</span>{' '}
                                                            <span className="text-green-600">{review.correct_answer}</span>
                                                        </p>
                                                    )}
                                                    <p className="text-muted-foreground italic">{review.explanation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-6">
                            <Button onClick={() => {
                                setQuizStarted(false);
                                setQuizSubmitted(false);
                                setResult(null);
                            }}>
                                Back to Quizzes
                            </Button>
                            <Button variant="outline" onClick={() => selectedCategory && startQuiz(selectedCategory)}>
                                Retry Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!quiz) return null;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.total_questions) * 100;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{quiz.title}</h1>
                    <p className="text-muted-foreground">
                        Question {currentQuestionIndex + 1} of {quiz.total_questions}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Clock size={20} />
                        <span className={timeLeft < 60 ? 'text-red-600' : ''}>{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Progress */}
            <Progress value={progress} className="mb-6" />

            {/* Question */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                        <Badge>{currentQuestion.difficulty}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(currentQuestion.id, idx.toString())}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${answers[currentQuestion.id] === idx.toString()
                                        ? 'border-primary bg-primary/10'
                                        : 'border-muted hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion.id] === idx.toString()
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-muted'
                                        }`}>
                                        {answers[currentQuestion.id] === idx.toString() && '✓'}
                                    </div>
                                    <span>{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-4 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>

                        {currentQuestionIndex < quiz.total_questions - 1 ? (
                            <Button
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                disabled={!answers[currentQuestion.id]}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmitQuiz}
                                disabled={Object.keys(answers).length !== quiz.total_questions}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Submit Quiz
                            </Button>
                        )}
                    </div>

                    {/* Answered count */}
                    <div className="mt-4 text-sm text-muted-foreground">
                        Answered: {Object.keys(answers).length} / {quiz.total_questions}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuizEngine;
