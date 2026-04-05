import express from 'express';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  createQA,
  createBulkQA,
  getAllQA,
  getQAById,
  getRandomQA,
  checkAnswer,
  updateQA,
  deleteQA,
  getCategories,
  getQAStats,
} from '../controllers/samboleQa.js';
import {
  saveScore,
  getScores,
  getBestScore,
  deleteScores,
} from '../controllers/scoreController.js';

const router = express. Router();

// Rate limiters
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later.' },
});

const answerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { error: 'Too many answer attempts, please slow down.' },
});

// Public routes - QA
router.get('/qas', getAllQA);
router.get('/qa/random', getRandomQA);
router.get('/qa/categories', getCategories);
router.get('/qa/stats', getQAStats);
router.get('/qa/:id', getQAById);
router. post('/qa/:id/check', answerLimiter, checkAnswer);

// Public routes - Score (ADD THESE 4 LINES)
router.post('/score', saveScore);
router. get('/scores/:odioId', getScores);
router.get('/score/best/:odioId', getBestScore);
router.delete('/scores/:odioId', deleteScores);

// Protected routes (require authentication)
router. post('/qa', authMiddleware, createLimiter, createQA);
router. post('/qa/bulk', authMiddleware, createLimiter, createBulkQA);
router.patch('/qa/:id', authMiddleware, updateQA);
router.delete('/qa/:id', authMiddleware, deleteQA);

export default router;