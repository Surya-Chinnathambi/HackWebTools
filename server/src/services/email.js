/**
 * Email service for sending transactional emails
 * Currently using console logging for development
 * In production, integrate with SendGrid, Resend, or similar service
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${FRONTEND_URL}/verify-email/${token}`;

    // TODO: Replace with actual email service (SendGrid, Resend, etc.)
    console.log('\n📧 ===== VERIFICATION EMAIL =====');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify your HackWebTools account`);
    console.log(`\nHi ${name},\n`);
    console.log(`Welcome to HackWebTools! Please verify your email address by clicking the link below:\n`);
    console.log(`${verificationUrl}\n`);
    console.log(`This link will expire in 24 hours.\n`);
    console.log('If you did not create this account, please ignore this email.\n');
    console.log('================================\n');

    // In production, uncomment and configure:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
    const msg = {
      to: email,
      from: 'noreply@hacktools.suryachinnathambi.tech',
      subject: 'Verify your HackWebTools account',
      text: `Hi ${name},\n\nWelcome to HackWebTools! Please verify your email address by visiting: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you did not create this account, please ignore this email.`,
      html: `
        <h2>Welcome to HackWebTools!</h2>
        <p>Hi ${name},</p>
        <p>Thanks for signing up! Please verify your email address to get started.</p>
        <p><a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a></p>
        <p>Or copy and paste this link: ${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create this account, please ignore this email.</p>
      `,
    };
  
    await sgMail.send(msg);
    */

    return true;
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

    // TODO: Replace with actual email service
    console.log('\n📧 ===== PASSWORD RESET EMAIL =====');
    console.log(`To: ${email}`);
    console.log(`Subject: Reset your HackWebTools password`);
    console.log(`\nHi ${name},\n`);
    console.log(`We received a request to reset your password. Click the link below to set a new password:\n`);
    console.log(`${resetUrl}\n`);
    console.log(`This link will expire in 1 hour.\n`);
    console.log('If you did not request this, please ignore this email and your password will remain unchanged.\n');
    console.log('===================================\n');

    // In production, uncomment and configure:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
    const msg = {
      to: email,
      from: 'noreply@hacktools.suryachinnathambi.tech',
      subject: 'Reset your HackWebTools password',
      text: `Hi ${name},\n\nWe received a request to reset your password. Visit this link to set a new password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to set a new password.</p>
        <p><a href="${resetUrl}" style="background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>
        <p>Or copy and paste this link: ${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };
  
    await sgMail.send(msg);
    */

    return true;
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email, name) => {
    console.log('\n📧 ===== WELCOME EMAIL =====');
    console.log(`To: ${email}`);
    console.log(`Subject: Welcome to HackWebTools!`);
    console.log(`\nHi ${name},\n`);
    console.log('Welcome to HackWebTools - your cybersecurity learning platform!\n');
    console.log('Here are some quick tips to get started:\n');
    console.log('1. Complete your first tool: Visit /tools and learn about Nmap');
    console.log('2. Take a quiz: Test your knowledge after each tool');
    console.log('3. Try a lab: Practice SQL injection in a safe environment');
    console.log('4. Earn your first certificate: Complete a learning path\n');
    console.log(`Get started now: ${FRONTEND_URL}/dashboard\n`);
    console.log('Happy hacking! 🚀\n');
    console.log('===========================\n');

    return true;
};

/**
 * Send subscription confirmation email
 */
export const sendSubscriptionEmail = async (email, name, tier, amount) => {
    console.log('\n📧 ===== SUBSCRIPTION EMAIL =====');
    console.log(`To: ${email}`);
    console.log(`Subject: Welcome to HackWebTools ${tier.toUpperCase()}!`);
    console.log(`\nHi ${name},\n`);
    console.log(`Thank you for upgrading to ${tier.toUpperCase()}! 🎉\n`);
    console.log(`You now have access to:\n`);

    if (tier === 'pro') {
        console.log('- Unlimited vulnerability scans');
        console.log('- 50+ premium challenges');
        console.log('- 20+ structured courses');
        console.log('- Professional certificates');
        console.log('- Priority support');
    } else if (tier === 'enterprise') {
        console.log('- Everything in Pro');
        console.log('- 1-on-1 mentorship sessions');
        console.log('- Custom CTF creation');
        console.log('- White-label certificates');
        console.log('- 24/7 priority support');
    }

    console.log(`\nAmount: $${amount}`);
    console.log(`\nGet started: ${FRONTEND_URL}/courses\n`);
    console.log('================================\n');

    return true;
};

/**
 * Send weekly digest email
 */
export const sendWeeklyDigest = async (email, name, stats) => {
    console.log('\n📧 ===== WEEKLY DIGEST =====');
    console.log(`To: ${email}`);
    console.log(`Subject: Your Weekly Progress Summary`);
    console.log(`\nHi ${name},\n`);
    console.log('Here\'s your learning summary for this week:\n');
    console.log(`- Tools completed: ${stats.toolsCompleted || 0}`);
    console.log(`- Quizzes taken: ${stats.quizzesTaken || 0}`);
    console.log(`- Current streak: ${stats.streak || 0} days`);
    console.log(`- XP gained: ${stats.xpGained || 0}\n`);
    console.log('Keep up the great work! 💪\n');
    console.log(`Continue learning: ${FRONTEND_URL}/dashboard\n`);
    console.log('============================\n');

    return true;
};

/**
 * Send certificate email
 */
export const sendCertificateEmail = async (email, name, certificateName, downloadUrl) => {
    console.log('\n📧 ===== CERTIFICATE EMAIL =====');
    console.log(`To: ${email}`);
    console.log(`Subject: 🎓 You earned a certificate!`);
    console.log(`\nCongratulations ${name}!\n`);
    console.log(`You've earned: ${certificateName}\n`);
    console.log(`Download your certificate: ${downloadUrl}\n`);
    console.log('Share it on LinkedIn and showcase your skills! 🌟\n');
    console.log('================================\n');

    return true;
};
