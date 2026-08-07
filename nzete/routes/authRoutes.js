import express from 'express';
import crypto from 'crypto';
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
    const baseUrl = process.env.FRONTEND_URL || 'onrender.com';
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
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Server error during logout' });
  }
});
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

    // CRITICAL FIX: Fall back to your app's explicit scheme if verification expires
    if (!user) {
      console.log("[Verification] Token expired or invalid.");
      return res.redirect(`mosisananse://login?verified=false&reason=expired`);
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    console.log(`[Verification] User ${user.email} successfully verified.`);

    // CRITICAL FIX: Redirect using your custom app scheme prefix!
    // This tells the phone's browser to instantly minimize and hand execution back to your Expo mobile app.
    return res.redirect(`mosisananse://login?verified=true`);

  } catch (error) {
    console.error('[GET /verify-email] Error:', error);
    return res.status(500).json({ message: "Internal server error during verification" });
  }
});
router.get("/check-status", authMiddleware, async (req, res) => {
  try {
    // 💡 Always fetch cleanly from the database to bypass stale token payloads
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the fresh data value matching your schema property name
    return res.status(200).json({ 
      success: true, 
      verified: user.verified 
    });

  } catch (err) {
    console.error("STATUS CHECK ENGINE ERROR:", err);
    return res.status(500).json({ error: "Server error checking status" });
  }
});
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
    const baseUrl = process.env.FRONTEND_URL || 'https://mosisa-ya-nzete.onrender.com';
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
router.post('/upload', authMiddleware, uploadLimiter, async (req, res) => {
  const { image } = req.body;
  const userId = req.user._id;

  if (!image) return res.status(400).json({ error: 'No image provided' });

  try {
    let base64Data = image;

    // Accept jpeg, jpg, png
    if (image.startsWith('data:image/')) {
      const matches = image.match(/^data:image\/(jpeg|jpg|png);base64,(.+)$/);
      if (!matches) return res.status(400).json({ error: 'Invalid base64 format' });
      base64Data = matches[2];
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Real size check
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image exceeds 5MB limit' });
    }

    const type = await fileTypeFromBuffer(buffer);
    if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
      return res.status(400).json({ error: 'Only JPEG/PNG images allowed' });
    }

    // Resize + compress
    let processedBuffer;
    try {
      const sharpInstance = sharp(buffer)
        .resize(500, 500, { fit: 'cover', withoutEnlargement: true })
        .flatten({ background: '#ffffff' });

      processedBuffer =
        type.mime === 'image/png'
          ? await sharpInstance.png({ compressionLevel: 9 }).toBuffer()
          : await sharpInstance.jpeg({ quality: 85 }).toBuffer();
    } catch (err) {
      return res.status(400).json({ error: 'Failed to compress image file parameters' });
    }

    const filename = `${userId}-${uuidv4()}.${type.ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, processedBuffer);

    const BASE_URL = process.env.BACKEND_URL || 'https://nzete.onrender.com';
    const url = `${BASE_URL}/uploads/${filename}`;

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
      
      const host = process.env.BACKEND_URL || 'https://nzete.onrender.com';
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
    const baseUrl = process.env.FRONTEND_URL || 'https://mosisa-ya-nzete.onrender.com';
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
router.post("/change-username", authMiddleware, async (req, res) => {
  try {
    let { newUsername } = req.body;

    // Validate
    if (!newUsername || newUsername.trim().length < 3) {
      return res.status(400).json({ message: "Username too short" });
    }

    // Trim
    newUsername = newUsername.trim();

    // Enforce capital first letter for display
    const displayUsername = 
      newUsername.charAt(0).toUpperCase() + newUsername.slice(1).toLowerCase();

    // Normalize for DB (schema stores lowercase)
    const normalized = displayUsername.toLowerCase();

    // Check if username already exists (case-insensitive)
    const existing = await User.findOne({ username: normalized });
    if (existing) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Update using normalized value
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username: normalized },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return capitalized version for UI
    return res.json({
      message: "Username updated successfully",
      username: displayUsername
    });

  } catch (err) {
    console.error("CHANGE USERNAME ERROR:", err);

    if (err.code === 11000) {
      return res.status(409).json({ message: "Username already taken" });
    }

    return res.status(500).json({ message: "Server error" });
  }
});
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully" });

  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/support", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nzete Support</title>

        <style>
            :root {
                --primary: #0066cc;
                --text-dark: #222;
                --text-light: #555;
                --bg-light: #f5f7fa;
                --white: #fff;
                --radius: 12px;
                --shadow: 0 4px 20px rgba(0,0,0,0.08);
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                background: var(--bg-light);
                margin: 0;
                padding: 0;
                color: var(--text-dark);
            }

            .container {
                max-width: 900px;
                margin: 40px auto;
                background: var(--white);
                padding: 40px;
                border-radius: var(--radius);
                box-shadow: var(--shadow);
            }

            h1 {
                font-size: 34px;
                margin-bottom: 20px;
                color: var(--text-dark);
                text-align: center;
            }

            h2 {
                font-size: 24px;
                margin-top: 35px;
                margin-bottom: 10px;
                color: var(--text-dark);
            }

            p {
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 15px;
                color: var(--text-light);
            }

            ul {
                margin: 10px 0 20px 20px;
                padding: 0;
            }

            ul li {
                margin-bottom: 8px;
                font-size: 16px;
                color: var(--text-light);
            }

            .email {
                font-weight: bold;
                color: var(--primary);
            }

            .footer {
                margin-top: 50px;
                font-size: 14px;
                color: #777;
                text-align: center;
            }

            /* Responsive */
            @media (max-width: 600px) {
                .container {
                    padding: 20px;
                    margin: 20px;
                }

                h1 {
                    font-size: 28px;
                }

                h2 {
                    font-size: 20px;
                }
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>Nzete Support</h1>

            <h2>Contact Email</h2>
            <p class="email">salaarnold14@gmail.com</p>

            <h2>FAQ</h2>
            <p><strong>What is Nzete?</strong><br>
            Nzete is a learning and reading companion designed to help users explore stories and improve reading skills.</p>

            <p><strong>I cannot log in.</strong><br>
            Ensure your email and password are correct. If issues continue, contact us.</p>

            <p><strong>How do I delete my account?</strong><br>
            Email <span class="email">salaarnold14@gmail.com</span> with the subject “Delete My Account”.</p>

            <h2>Privacy Policy</h2>
            <p>Nzete collects only essential information such as email, username, and basic usage data.</p>
            <ul>
                <li>We do NOT collect advertising identifiers</li>
                <li>We do NOT collect device tracking data</li>
                <li>We do NOT collect location data</li>
                <li>We do NOT collect cross‑app tracking data</li>
            </ul>
            <p>We do not sell or share your data for advertising.</p>

            <h2>Terms of Service</h2>
            <p>By using Nzete, you agree not to misuse the app, attempt unauthorized access, or upload harmful content.</p>
            <p>All content is protected by copyright.</p>
            <p>For questions, email <span class="email">salaarnold14@gmail.com</span>.</p>

            <h2>App Description</h2>
            <p>Nzete – Learn & Read with Fun. Your interactive learning companion designed to make reading enjoyable, engaging, and accessible.</p>

            <div class="footer">
                © ${new Date().getFullYear()} Nzete App — All Rights Reserved
            </div>
        </div>
    </body>
    </html>
  `);
});

export default router;