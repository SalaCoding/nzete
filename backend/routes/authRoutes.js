import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { jwtOptions } from '../authConfig.js';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import authMiddleware from '../middleware/auth.middleware.js';
import sharp from 'sharp';
import rateLimit from 'express-rate-limit';

import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { createRequire } from 'module';

// Initialize Admin using Environment Variables
const require = createRequire(import.meta.url);

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();

if (!rawServiceAccount) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is missing!");
}

let serviceAccount;

try {
  serviceAccount = JSON.parse(rawServiceAccount);
} catch (e) {
  try {
    const fixedJson = rawServiceAccount
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t');
    
    serviceAccount = JSON.parse(fixedJson);
  } catch (finalError) {
    console.error("❌ Critical: Firebase Service Account JSON is malformed.");
    console.error("Error Detail:", finalError.message);
    process.exit(1);
  }
}

// Validate required Firebase fields
const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
const missing = requiredFields.filter(field => !serviceAccount[field]);

if (missing.length > 0) {
  console.error(`❌ Critical: Missing required Firebase fields: ${missing.join(', ')}`);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin Initialized Successfully");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ============================================================
// SECURITY CONSTANTS
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const ALLOWED_REGISTER_FIELDS = ['email', 'password', 'username'];
const ALLOWED_PROFILE_FIELDS = ['username', 'profilePicture'];
const ALLOWED_IMAGE_HOSTS = [
  'api.dicebear.com',
  'localhost',
  'lh3.googleusercontent.com', // Google Profile Pictures
];

const WEAK_PASSWORDS = [
  'password', 'password1', 'password123', '12345678', 'qwerty123',
  'letmein', 'welcome1', 'admin123', 'iloveyou1'
];

// ============================================================
// RATE LIMITERS
// ============================================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, please try again later' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts, please try again later' },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many uploads, please try again later' },
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(jwtOptions.signPayload(userId), secret, jwtOptions.sign);
};

const isValidString = (value, maxLength = 1000) => {
  return typeof value === 'string' && value.length <= maxLength;
};

const isAllowedImageUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ALLOWED_IMAGE_HOSTS.some(host => 
      parsed.hostname === host || parsed.hostname.endsWith('.' + host)
    );
  } catch {
    return false;
  }
};

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
  profilePicture: user.profilePicture,
  createdAt: user.createdAt,
  isPremiumNumbers: user.isPremiumNumbers,
  isPremiumStories: user.isPremiumStories
});

// ============================================================
// REGISTER (Optimized)
// ============================================================
router.post('/register', authLimiter, async (req, res) => {
  try {
    const extraFields = Object.keys(req.body).filter(
      key => !ALLOWED_REGISTER_FIELDS.includes(key)
    );
    if (extraFields.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid fields provided',
        fields: extraFields 
      });
    }

    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ 
        message: 'Email, password, and username are required' 
      });
    }

    if (!isValidString(email, 100) || !isValidString(password, 100) || !isValidString(username, 30)) {
      return res.status(400).json({ message: 'Invalid input types' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (normalizedUsername.length < 3) {
      return res.status(400).json({ 
        message: 'Username must be at least 3 characters long' 
      });
    }
    if (!USERNAME_REGEX.test(normalizedUsername)) {
      return res.status(400).json({ 
        message: 'Username can only contain letters, numbers, and underscores' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      });
    }
    if (WEAK_PASSWORDS.includes(password.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Password is too common, please choose a stronger one' 
      });
    }
    if (password.toLowerCase().includes(normalizedUsername.toLowerCase()) ||
        password.toLowerCase().includes(normalizedEmail.split('@')[0].toLowerCase())) {
      return res.status(400).json({ 
        message: 'Password cannot contain your username or email' 
      });
    }

    console.log('[SignUp] Register attempt:', {normalizedEmail, normalizedUsername});
    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email: normalizedEmail }).select('_id email').lean(),
      User.findOne({ username: normalizedUsername }).select('_id username').lean()
    ]);
    console.log('[SignUp] Query results:', {existingEmail, existingUsername});

    if (existingEmail || existingUsername) {
      return res.status(409).json({ 
        message: 'Email or username already in use' 
      });
    }

    // -----------------------------
    // EMAIL VERIFICATION SECTION
    // -----------------------------
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    const user = new User({
      email: normalizedEmail,
      password,
      username: normalizedUsername,
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedUsername)}`,
      verified: false,
      verificationToken,
      verificationExpires
    });

    await user.save();

    // Environment fallbacks insulate from breaking links with 'undefined' properties
    const baseUrl = process.env.FRONTEND_URL || process.env.EXPO_PUBLIC_FRONTEND_URL || 'onrender.com';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const verifyUrl = `${cleanBaseUrl}/verify-email?token=${verificationToken}`;

    // NON-BLOCKING OPTIMIZATION: Runs asynchronously in background to speed up app response
    sendEmail(
      normalizedEmail,
      "Verify your Nzete account",
      `Welcome to Nzete! Click the link to verify your email:\n\n${verifyUrl}\n\nThis link expires in 24 hours.`,
      `<p>Welcome to Nzete! Click <a href="${verifyUrl}">here</a> to verify your email. This link expires in 24 hours.</p>`
    ).catch(err => {
      console.error("Background Registration Email Delivery Failed:", err);
    });

    return res.status(201).json({
      message: "Verification email sent. Please check your inbox."
    });

  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Email or username already in use' 
      });
    }
    return res.status(500).json({ 
      message: 'Server error during registration' 
    });
  }
});

// ============================================================
// LOGIN
// ============================================================
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!isValidString(email, 100) || !isValidString(password, 100)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
      await bcryptjs.compare(password, '$2b$12$invalidhashtopreventtimingattacks');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.verified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in.',
        isUnverified: true 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save(); 

    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.error('[LOGIN] Error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// ============================================================
// GET CURRENT USER
// ============================================================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.verified) {
      return res.status(403).json({ message: "Email not verified", isUnverified: true });
    }
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('[GET /me]', err);
    return res.status(500).json({ message: 'Server error' });
  }
});
// ============================================================
// EMAIL VERIFICATION
// ============================================================
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });

    // Insulate the redirection targets from dropping down into 'undefined' string patterns
    const baseUrl = process.env.FRONTEND_URL || process.env.EXPO_PUBLIC_FRONTEND_URL || 'onrender.com';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    if (!user) {
      // Redirect to a frontend failure screen if link expires
      return res.redirect(`${cleanBaseUrl}/login?verified=false&reason=expired`);
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    // Smooth redirection back to your Expo mobile/web application 
    return res.redirect(`${cleanBaseUrl}/login?verified=true`);
  } catch (error) {
    console.error('[GET /verify-email] Error:', error);
    return res.status(500).json({ message: "Internal server error during verification" });
  }
});

// ============================================================
// RESEND VERIFICATION EMAIL
// ============================================================
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    // Mitigate user enumeration attacks by matching responses
    const genericSuccessMessage = { message: "If your account exists, a verification link has been sent." };
    
    if (!user) return res.status(200).json(genericSuccessMessage);
    if (user.verified) return res.status(200).json({ message: "Email is already verified." });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
    
    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    // Setup uniform fallback controls to lock path string outputs securely
    const baseUrl = process.env.FRONTEND_URL || process.env.EXPO_PUBLIC_FRONTEND_URL || 'onrender.com';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const verifyUrl = `${cleanBaseUrl}/verify-email?token=${verificationToken}`;
    
    // NON-BLOCKING OPTIMIZATION: Remove 'await' so email sends in the background
    sendEmail(
      user.email,
      "Verify your Nzete account",
      `Click this link to verify your account:\n\n${verifyUrl}\n\nLink expires in 24 hours.`,
      `<p>Click <a href="${verifyUrl}">here</a> to verify your account. This link expires in 24 hours.</p>`
    ).catch(err => {
      console.error("Background Email Delivery Failed:", err);
    });
    
    // The server responds instantly to the frontend now
    return res.json(genericSuccessMessage);
  } catch (error) {
    console.error('[POST /resend-verification] Error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ============================================================
// UPLOAD PROFILE PICTURE
// ============================================================
router.post('/upload', authMiddleware, uploadLimiter, async (req, res) => {
  const { image } = req.body;
  const userId = req.user._id;

  if (!image) return res.status(400).json({ error: 'No image provided' });
  if (!isValidString(image, 10 * 1024 * 1024)) return res.status(400).json({ error: 'Invalid image data size' });

  try {
    let base64Data = image;
    if (image.startsWith('data:image/')) {
      const matches = image.match(/^data:image\/(jpeg|png);base64,(.+)$/);
      if (!matches) return res.status(400).json({ error: 'Invalid base64 format' });
      base64Data = matches[2];
    }

    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 5 * 1024 * 1024) return res.status(413).json({ error: 'Image exceeds 5MB limit' });

    const type = await fileTypeFromBuffer(buffer);
    if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
      return res.status(400).json({ error: 'Only JPEG/PNG images allowed' });
    }

    let processedBuffer;
    try {
      const sharpInstance = sharp(buffer)
        .resize(500, 500, { fit: 'cover', withoutEnlargement: true })
        .flatten({ background: '#ffffff' }); // Cleaner approach to transparency layer handling

      if (type.mime === 'image/png') {
        processedBuffer = await sharpInstance.png({ compressionLevel: 9 }).toBuffer();
      } else {
        processedBuffer = await sharpInstance.jpeg({ quality: 85 }).toBuffer();
      }
    } catch (err) {
      return res.status(400).json({ error: 'Failed to compress image file parameters' });
    }

    const filename = `${userId}-${uuidv4()}.${type.ext}`;
    const uploadDir = path.join(__dirname, '../uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, processedBuffer);

    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: url },
      { new: true, runValidators: true, select: '-password' }
    );

    return res.json({ message: 'Profile picture updated', user: sanitizeUser(updatedUser) });

  } catch (err) {
    console.error('[POST /upload]', err);
    return res.status(500).json({ error: 'Server error during upload handling' });
  }
});

// ============================================================
// PATCH USER PROFILE
// ============================================================
router.patch('/user/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const extraFields = Object.keys(req.body).filter(key => !ALLOWED_PROFILE_FIELDS.includes(key));
    if (extraFields.length > 0) return res.status(400).json({ message: 'Invalid fields' });

    const { username, profilePicture } = req.body;
    const updateData = {};

    if (username !== undefined) {
      if (!isValidString(username, 30)) return res.status(400).json({ message: 'Invalid username' });
      const normalizedUsername = username.trim();
      if (normalizedUsername.length < 3 || !USERNAME_REGEX.test(normalizedUsername)) {
        return res.status(400).json({ message: 'Invalid username format' });
      }
      
      const existingUser = await User.findOne({ username: normalizedUsername, _id: { $ne: userId } }).select('_id').lean();
      if (existingUser) return res.status(409).json({ message: 'Username already in use' });

      updateData.username = normalizedUsername;
    }

    if (profilePicture !== undefined) {
      if (!isValidString(profilePicture, 500)) return res.status(400).json({ message: 'Invalid profile picture URL' });
      
      const host = req.get('host');
      if (!isAllowedImageUrl(profilePicture) && !profilePicture.includes(`${host}/uploads/`)) {
        return res.status(400).json({ message: 'Invalid picture source' });
      }
      updateData.profilePicture = profilePicture;
    }

    if (Object.keys(updateData).length === 0) return res.status(400).json({ message: 'No valid data' });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, select: '-password' }
    );

    return res.status(200).json({ message: 'Profile updated', user: sanitizeUser(updatedUser) });

  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Username in use' });
    return res.status(500).json({ message: 'Server error' });
  }
});

// ============================================================
// REQUEST PASSWORD RESET
// ============================================================
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required.' });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    const genericResponse = { message: "If an account matches that email, instructions have been sent." };

    // Prevent user enumeration attacks safely
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const rawResetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token string for secure database storage parameters
    user.resetPasswordToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();

    // Environment fallbacks to completely insulate your code from producing "undefined" URLs
    const baseUrl = process.env.FRONTEND_URL || process.env.EXPO_PUBLIC_FRONTEND_URL || 'onrender.com';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    // Corrected target path parameter assignment string map definition
    const resetUrl = `${cleanBaseUrl}/reset-password?token=${rawResetToken}`;

    // PERFORMANCE OPTIMIZATION: Dispatched in background without using 'await' to boost speed
    sendEmail(
      normalizedEmail,
      "Reset your Nzete password",
      `Click the link below to reset your password:\n\n${resetUrl}`,
      `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>` 
    ).catch(err => {
      console.error("Background Reset Email Delivery Failed:", err);
    });

    // Server returns an immediate responsive feedback confirmation straight back to the user interface
    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Reset Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// ============================================================
// RESET PASSWORD
// ============================================================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and new password required.' });

    // Hash the incoming plaintext token to match the database value
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Finalize Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


export default router;