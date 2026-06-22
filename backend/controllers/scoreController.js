import Score from '../models/Score.js';

// Save a new score
export const saveScore = async (req, res) => {
  try {
    const { odioId, correctCount, wrongCount, totalQuestions, percentage, category } = req.body;

    if (!odioId) {
      return res.status(400). json({ error: 'odioId is required' });
    }

    const score = await Score.create({
      odioId,
      correctCount,
      wrongCount,
      totalQuestions,
      percentage,
      category: category || 'all',
    });

    res.status(201).json({
      success: true,
      score,
    });
  } catch (error) {
    console.error('Save score error:', error);
    res.status(500). json({ error: 'Failed to save score' });
  }
};

// Get scores for a user
export const getScores = async (req, res) => {
  try {
    const { odioId } = req.params;
    const { limit = 10 } = req.query;

    const scores = await Score. find({ odioId })
      .sort({ createdAt: -1 })
      . limit(parseInt(limit));

    res.json({
      success: true,
      scores,
    });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ error: 'Failed to get scores' });
  }
};

// Get best score for a user
export const getBestScore = async (req, res) => {
  try {
    const { odioId } = req.params;

    const bestScore = await Score. findOne({ odioId })
      . sort({ percentage: -1 })
      .limit(1);

    res.json({
      success: true,
      bestScore,
    });
  } catch (error) {
    console.error('Get best score error:', error);
    res.status(500).json({ error: 'Failed to get best score' });
  }
};

// Delete all scores for a user (reset)
export const deleteScores = async (req, res) => {
  try {
    const { odioId } = req. params;

    const result = await Score. deleteMany({ odioId });

    res.json({
      success: true,
      message: 'All scores deleted',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Delete scores error:', error);
    res.status(500).json({ error: 'Failed to delete scores' });
  }
};