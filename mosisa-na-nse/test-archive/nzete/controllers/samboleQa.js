import QA from '../models/Sambole.js';
import mongoose from 'mongoose';

// Validation helpers
const sanitizeInput = (input, maxLength = 500) => {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
};

// Create a new Q&A
export const createQA = async (req, res) => {
  try {
    const { question, answer, category, difficulty, language } = req.body;

    const cleanQuestion = sanitizeInput(question, 500);
    const cleanAnswer = sanitizeInput(answer, 1000);
    const cleanCategory = sanitizeInput(category, 50) || 'general';

    if (!cleanQuestion || ! cleanAnswer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const existing = await QA. findOne({
      question: { $regex: new RegExp(`^${cleanQuestion}$`, 'i') }
    });

    if (existing) {
      return res. status(400).json({ error: 'This question already exists' });
    }

    const qa = new QA({
      question: cleanQuestion,
      answer: cleanAnswer,
      category: cleanCategory,
      difficulty: difficulty || 'easy',
      language: language || 'lingala',
      createdBy: req.user?._id || req.user?.id,
    });

    await qa.save();

    res.status(201).json({
      message: 'Q&A created successfully',
      qa,
    });

  } catch (error) {
    console.error('[createQA] error:', error);
    res. status(500).json({ error: 'Failed to create Q&A' });
  }
};

// Create multiple Q&As at once
export const createBulkQA = async (req, res) => {
  try {
    const { items } = req.body;

    if (! Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    if (items.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 items per request' });
    }

    const qas = items.map(item => ({
      question: sanitizeInput(item. question, 500),
      answer: sanitizeInput(item. answer, 1000),
      category: sanitizeInput(item.category, 50) || 'general',
      difficulty: item.difficulty || 'easy',
      language: item.language || 'lingala',
      createdBy: req.user?._id || req.user?.id,
    })). filter(qa => qa.question && qa. answer);

    const created = await QA. insertMany(qas, { ordered: false });

    res.status(201). json({
      message: `${created.length} Q&As created successfully`,
      count: created.length,
    });

  } catch (error) {
    console. error('[createBulkQA] error:', error);
    res.status(500).json({ error: 'Failed to create Q&As' });
  }
};

// Get all Q&As with pagination and filters
export const getAllQA = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query. page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const { category, difficulty, language, search } = req.query;

    const filter = { isActive: true };

    if (category) filter. category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.language = language;
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }

    const [qas, total] = await Promise. all([
      QA.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      QA. countDocuments(filter),
    ]);

    res.json({
      qas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + qas.length < total,
      },
    });

  } catch (error) {
    console.error('[getAllQA] error:', error);
    res.status(500).json({ error: 'Failed to fetch Q&As' });
  }
};

// Get a single Q&A by ID
export const getQAById = async (req, res) => {
  try {
    const { id } = req. params;

    if (!mongoose.Types. ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Q&A ID' });
    }

    const qa = await QA.findById(id). lean();

    if (!qa) {
      return res.status(404).json({ error: 'Q&A not found' });
    }

    await QA.findByIdAndUpdate(id, { $inc: { 'stats.timesViewed': 1 } });

    res.json(qa);

  } catch (error) {
    console.error('[getQAById] error:', error);
    res.status(500).json({ error: 'Failed to fetch Q&A' });
  }
};

// Get a random Q&A (for quiz mode)
export const getRandomQA = async (req, res) => {
  try {
    const { category, difficulty, exclude } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter. difficulty = difficulty;

    if (exclude) {
      const excludeIds = exclude.split(',').filter(id => mongoose. Types.ObjectId. isValid(id));
      if (excludeIds. length > 0) {
        filter._id = { $nin: excludeIds. map(id => new mongoose.Types.ObjectId(id)) };
      }
    }

    const count = await QA. countDocuments(filter);

    if (count === 0) {
      return res.status(404). json({ error: 'No Q&As found', noMore: true });
    }

    const random = Math.floor(Math.random() * count);
    const qa = await QA.findOne(filter).skip(random).lean();

    if (qa) {
      await QA.findByIdAndUpdate(qa._id, { $inc: { 'stats.timesViewed': 1 } });
    }

    res.json(qa);

  } catch (error) {
    console.error('[getRandomQA] error:', error);
    res.status(500).json({ error: 'Failed to fetch random Q&A' });
  }
};

// Check answer - supports multiple valid answers separated by |
export const checkAnswer = async (req, res) => {
  try {
    const { id } = req. params;
    const { userAnswer } = req. body;

    if (!mongoose.Types. ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Q&A ID' });
    }

    if (! userAnswer) {
      return res.status(400).json({ error: 'User answer is required' });
    }

    const qa = await QA.findById(id);

    if (!qa) {
      return res.status(404).json({ error: 'Q&A not found' });
    }

    // Normalize user answer
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();

    // Split stored answer by | to get all valid answers
    const validAnswers = qa. answer
      .split('|')
      .map(a => a.toLowerCase().trim());

    // Check if user answer matches any valid answer
    const isCorrect = validAnswers.some(
      validAnswer => normalizedUserAnswer === validAnswer
    );

    // Update stats
    if (isCorrect) {
      await QA.findByIdAndUpdate(id, { $inc: { 'stats. timesAnsweredCorrectly': 1 } });
    } else {
      await QA.findByIdAndUpdate(id, { $inc: { 'stats.timesAnsweredIncorrectly': 1 } });
    }

    // Return display answer
    const displayAnswer = validAnswers. length > 1
      ? validAnswers.join(' to ')
      : qa. answer;

    res.json({
      isCorrect,
      correctAnswer: displayAnswer,
      userAnswer,
      validAnswers,
    });

  } catch (error) {
    console. error('[checkAnswer] error:', error);
    res.status(500).json({ error: 'Failed to check answer' });
  }
};

// Update a Q&A
export const updateQA = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, difficulty, language, isActive } = req. body;

    if (!mongoose.Types. ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Q&A ID' });
    }

    const updateData = {};

    if (question) updateData.question = sanitizeInput(question, 500);
    if (answer) updateData.answer = sanitizeInput(answer, 1000);
    if (category) updateData.category = sanitizeInput(category, 50);
    if (difficulty) updateData.difficulty = difficulty;
    if (language) updateData. language = language;
    if (typeof isActive === 'boolean') updateData. isActive = isActive;

    const qa = await QA. findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!qa) {
      return res.status(404).json({ error: 'Q&A not found' });
    }

    res.json({
      message: 'Q&A updated successfully',
      qa,
    });

  } catch (error) {
    console.error('[updateQA] error:', error);
    res.status(500).json({ error: 'Failed to update Q&A' });
  }
};

// Delete a Q&A
export const deleteQA = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res. status(400).json({ error: 'Invalid Q&A ID' });
    }

    const qa = await QA.findByIdAndDelete(id);

    if (!qa) {
      return res. status(404).json({ error: 'Q&A not found' });
    }

    res.json({ message: 'Q&A deleted successfully' });

  } catch (error) {
    console.error('[deleteQA] error:', error);
    res.status(500).json({ error: 'Failed to delete Q&A' });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await QA.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('[getCategories] error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get Q&A stats
export const getQAStats = async (req, res) => {
  try {
    const stats = await QA. aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: 1 },
          totalViews: { $sum: '$stats.timesViewed' },
          totalCorrectAnswers: { $sum: '$stats. timesAnsweredCorrectly' },
          totalIncorrectAnswers: { $sum: '$stats. timesAnsweredIncorrectly' },
          categories: { $addToSet: '$category' },
        },
      },
      {
        $project: {
          _id: 0,
          totalQuestions: 1,
          totalViews: 1,
          totalCorrectAnswers: 1,
          totalIncorrectAnswers: 1,
          totalCategories: { $size: '$categories' },
          successRate: {
            $cond: [
              { $eq: [{ $add: ['$totalCorrectAnswers', '$totalIncorrectAnswers'] }, 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$totalCorrectAnswers', { $add: ['$totalCorrectAnswers', '$totalIncorrectAnswers'] }] },
                  100
                ]
              }
            ]
          }
        },
      },
    ]);

    res.json(stats[0] || {
      totalQuestions: 0,
      totalViews: 0,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      totalCategories: 0,
      successRate: 0,
    });

  } catch (error) {
    console.error('[getQAStats] error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};