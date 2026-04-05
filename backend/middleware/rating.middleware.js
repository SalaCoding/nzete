// validation middleware for rating
export default function validateRating(req, res, next) {
  // 1. Ensure auth middleware ran first
  const userId = req.user?.id;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  // 2. Normalize and validate the score
  const rawScore = req.body.score;
  const score    = Number(rawScore);

  if (
    Number.isNaN(score) ||
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5
  ) {
    return res
      .status(400)
      .json({ error: 'Rating score must be an integer between 1 and 5' });
  }

  // 3. Attach cleaned data for downstream
  req.body.userId = userId;
  req.body.score  = score;

  next();
}
