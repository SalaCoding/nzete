import express from 'express';
import NumberWord from '../models/NumberWord.js';
import { numbers } from '../feedNumbers/numbers.js';

const router = express.Router();

// Seed endpoint
router.post('/seed', async (req, res) => {
  let created = 0, updated = 0, skipped = 0, errors = 0;
  const valuesSet = new Set(numbers.map(n => n.value));
  try {
    for (const n of numbers) {
      try {
        const existing = await NumberWord. findOne({ value: n.value });
        if (existing && existing.word === n.word && existing.group === n.group) {
          skipped++;
          continue;
        }
        const result = await NumberWord.updateOne(
          { value: n.value },
          { $set: { word: n.word, group: n.group }, $setOnInsert: { value: n.value } },
          { upsert: true }
        );
        if (result.upsertedCount === 1 || result.upsertedId) {
          created++;
        } else {
          updated++;
        }
      } catch (err) {
        errors++;
        console. error(`Failed to upsert for value ${n.value}:`, err);
      }
    }
    const deleteResult = await NumberWord.deleteMany({ value: { $nin: Array.from(valuesSet) } });
    const removed = deleteResult.deletedCount || 0;
    const summary = { created, updated, skipped, removed, errors };
    console.log(summary);
    res. json(summary);
  } catch (err) {
    res.status(500). json({ error: err.message });
  }
});

// Add one entry
router.post('/motango', async (req, res) => {
  const { value, word, group } = req.body;
  console.log('Received new number-word pair:', { value, word, group });

  if (typeof value === 'undefined' || typeof word === 'undefined' || typeof group === 'undefined') {
    return res.status(400).json({ error: 'value, word, and group are required' });
  }

  const numericValue = Number(value);
  if (! Number.isFinite(numericValue)) {
    return res.status(400).json({ error: 'invalid_value', message: 'value must be a number' });
  }

  try {
    const existing = await NumberWord. findOne({ value: numericValue });
    if (existing) {
      return res.status(409). json({ error: 'NumberWord with this value already exists' });
    }
    const numberWord = new NumberWord({ value: numericValue, word, group });
    await numberWord.save();
    res.status(201).json(numberWord);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: 'invalid_request', message: err. message });
    }
    res.status(500). json({ error: err.message });
  }
});

// Get all groups, sorted numerically
router.get('/groups', async (req, res) => {
  try {
    const groups = await NumberWord.distinct('group');
    console.log('Fetched groups oyo:', groups);
    groups.sort((a, b) => {
      const aNum = parseInt(String(a). split('-')[0], 10) || 0;
      const bNum = parseInt(String(b).split('-')[0], 10) || 0;
      return aNum - bNum;
    });
    res.json(groups);
  } catch (err) {
    res. status(500).json({ error: err. message });
  }
});

// Fetch by groups (comma-separated)
router.get('/', async (req, res) => {
  try {
    if (req.query. groups) {
      const groupArr = req.query. groups.split(','). map(g => g.trim());
      const all = await NumberWord. find({ group: { $in: groupArr } }). sort({ value: 1 });
      return res.json({ data: all });
    }

    const page = Math.max(parseInt(req.query. page || '1', 10) || 1, 1);
    const limit = Math.max(parseInt(req. query.limit || '100', 10) || 1, 1);
    const skip = (page - 1) * limit;

    // FIX: remove console.log from Promise.all
    const [all, total] = await Promise.all([
      NumberWord.find().sort({ value: 1 }).skip(skip). limit(limit),
      NumberWord.countDocuments()
    ]);

    console.log('Fetched all numbers:', all. length, 'items');
    res. json({
      data: all,
      total,
      page,
      pageCount: total === 0 ? 0 : Math. ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by value — validate inside handler for Express 5 compatibility
router.get('/:value', async (req, res) => {
  try {
    // Validate that value contains only digits
    if (!/^\d+$/.test(req. params.value)) {
      return res.status(400).json({ error: 'invalid_value', message: 'value must be a number' });
    }
    
    const num = Number(req.params. value);
    if (! Number.isFinite(num)) {
      return res. status(400).json({ error: 'invalid_value', message: 'value must be a number' });
    }
    
    const item = await NumberWord.findOne({ value: num });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('get by value handler error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;