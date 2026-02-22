import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const progressItemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        enum: ['tool', 'page', 'course', 'challenge', 'lab', 'quiz'],
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    score: Number,
    timeSpent: Number // in seconds
});

const streakSchema = new mongoose.Schema({
    current: {
        type: Number,
        default: 0
    },
    longest: {
        type: Number,
        default: 0
    },
    lastVisit: {
        type: Date,
        default: Date.now
    }
});

const achievementSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: {
        type: Date,
        default: Date.now
    },
    tier: String
});

const userSchema = new mongoose.Schema({
    // Basic Info
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password required if not OAuth user
        },
        select: false // Don't include password in queries by default
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: String,

    // OAuth
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },

    // Subscription
    tier: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
        index: true
    },
    subscription: {
        planId: String,
        status: {
            type: String,
            enum: ['active', 'canceled', 'past_due', 'trialing'],
            default: 'active'
        },
        stripeCustomerId: String,
        stripeSubscriptionId: String,
        currentPeriodEnd: Date,
        cancelAtPeriodEnd: {
            type: Boolean,
            default: false
        }
    },

    // Usage Limits
    usage: {
        scansToday: {
            type: Number,
            default: 0
        },
        apiCallsToday: {
            type: Number,
            default: 0
        },
        labsThisMonth: {
            type: Number,
            default: 0
        },
        lastReset: {
            type: Date,
            default: Date.now
        }
    },

    // Progress Tracking
    progress: {
        completedItems: [progressItemSchema],
        totalPoints: {
            type: Number,
            default: 0
        },
        level: {
            type: Number,
            default: 1
        },
        xp: {
            type: Number,
            default: 0
        }
    },

    // Engagement
    streak: streakSchema,
    achievements: [achievementSchema],

    // Courses & Challenges
    completedCourses: [{
        type: String
    }],
    completedChallenges: [{
        type: String
    }],
    completedLabs: [{
        type: String
    }],

    // Quizzes
    quizScores: [{
        quizId: String,
        score: Number,
        totalQuestions: Number,
        completedAt: Date,
        timeSpent: Number
    }],

    // Learning Paths
    learningPaths: [{
        pathId: String,
        pathName: String,
        startedAt: Date,
        completedAt: Date,
        progress: Number, // percentage
        currentTopic: String
    }],

    // Certificates
    certificates: [{
        certificateId: String,
        type: String,
        name: String,
        issuedAt: Date,
        verificationCode: String,
        downloadUrl: String
    }],

    // Email Verification
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpiry: Date,

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpiry: Date,

    // Settings
    settings: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        weeklyDigest: {
            type: Boolean,
            default: true
        },
        darkMode: {
            type: Boolean,
            default: true
        },
        telegramLinked: {
            type: Boolean,
            default: false
        },
        telegramChatId: String,
        telegramToken: String
    },

    // Admin
    role: {
        type: String,
        enum: ['user', 'admin', 'instructor'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    loginHistory: [{
        timestamp: Date,
        ip: String,
        userAgent: String
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ tier: 1 });
userSchema.index({ 'subscription.stripeCustomerId': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for completion percentage
userSchema.virtual('completionPercentage').get(function () {
    const totalItems = 700; // Approximate total tools/pages
    const completed = this.progress.completedItems.length;
    return Math.round((completed / totalItems) * 100);
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak method
userSchema.methods.updateStreak = function () {
    const now = new Date();
    const lastVisit = this.streak.lastVisit;

    // Reset time to midnight for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastVisitDate = new Date(lastVisit.getFullYear(), lastVisit.getMonth(), lastVisit.getDate());

    const daysDiff = Math.floor((today - lastVisitDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
        // Same day, no change
        return false;
    } else if (daysDiff === 1) {
        // Consecutive day
        this.streak.current += 1;
        if (this.streak.current > this.streak.longest) {
            this.streak.longest = this.streak.current;
        }
    } else {
        // Streak broken
        this.streak.current = 1;
    }

    this.streak.lastVisit = now;
    return true;
};

// Mark item as completed
userSchema.methods.markCompleted = function (itemId, itemType, score = null, timeSpent = null) {
    // Check if already completed
    const existing = this.progress.completedItems.find(
        item => item.itemId === itemId && item.itemType === itemType
    );

    if (!existing) {
        this.progress.completedItems.push({
            itemId,
            itemType,
            score,
            timeSpent
        });

        // Award XP based on item type
        const xpMap = {
            tool: 10,
            page: 5,
            course: 50,
            challenge: 30,
            lab: 40,
            quiz: 20
        };

        const xpGained = xpMap[itemType] || 10;
        this.progress.xp += xpGained;
        this.progress.totalPoints += xpGained;

        // Level up check (100 XP per level)
        const newLevel = Math.floor(this.progress.xp / 100) + 1;
        if (newLevel > this.progress.level) {
            this.progress.level = newLevel;
            return { levelUp: true, newLevel };
        }

        return { levelUp: false, xpGained };
    }

    return null;
};

// Get recommended next topic
userSchema.methods.getRecommendedTopic = function () {
    const completedTools = this.progress.completedItems
        .filter(item => item.itemType === 'tool')
        .map(item => item.itemId);

    // Simple recommendation logic (can be enhanced)
    if (completedTools.length === 0) {
        return { category: 'Beginner', topic: 'nmap', reason: 'Start with the basics' };
    }

    if (completedTools.length < 10) {
        return { category: 'Beginner', topic: 'wireshark', reason: 'Continue building foundations' };
    }

    if (completedTools.length < 30) {
        return { category: 'Intermediate', topic: 'burp-suite', reason: 'Ready for web security' };
    }

    return { category: 'Advanced', topic: 'metasploit', reason: 'Level up your skills' };
};

// Reset daily usage
userSchema.methods.resetDailyUsage = function () {
    const now = new Date();
    const lastReset = this.usage.lastReset;

    const daysDiff = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 1) {
        this.usage.scansToday = 0;
        this.usage.apiCallsToday = 0;
        this.usage.lastReset = now;
        return true;
    }

    return false;
};

// Clean sensitive data for client
userSchema.methods.toSafeObject = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.verificationToken;
    delete obj.verificationTokenExpiry;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpiry;
    delete obj.__v;
    return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
