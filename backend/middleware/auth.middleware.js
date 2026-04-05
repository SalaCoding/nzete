import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { jwtOptions } from '../authConfig.js';

export default async function authMiddleware(req, res, next) {
  console.log('✅ Auth middleware running', req.method, req.originalUrl);
  try {
    // 1. Extract and validate Authorization header
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      console.warn('[AUTH] Missing Authorization header');
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const [scheme, token] = authHeader.split(' ');
    if (!scheme || scheme !== 'Bearer' || !token) {
      console.warn('[AUTH] Invalid authorization format');
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

    // 2. Ensure JWT secret is configured
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'Internal server error' });
    }

    // 3. Verify token and extract payload
    let payload;
    try {
      payload = jwt.verify(token, secret);
      console.log('[AUTH] Decoded JWT payload:', payload);

    } catch (err) {
      console.warn('[AUTH] Invalid or expired token');
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 4. Extract user ID and fetch user
    const userId = jwtOptions.extractUserId(payload); // should return a string
    // ✅ Add this log here
console.log('[AUTH] Looking up user ID:', userId);
    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      console.warn(`[AUTH] No user found for ID: ${userId}`);
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    console.log(`[AUTH] ${req.method} ${req.originalUrl} → ✅ ${user.email}`);

    // 5. Attach normalized user to request
    req.user = {
      ...user.toObject(),
      id: user._id.toString() // ensures downstream compatibility
    };

    next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
