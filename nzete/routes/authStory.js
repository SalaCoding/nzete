import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import slugify from 'slugify';
import path from 'path';
import { fileURLToPath } from 'url';
import { io } from '../server.js';

import Blog from '../models/Blog.js';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../middleware/auth.middleware.js';
import sharp from 'sharp';

import {
  createComment,
  getComments,
  editComment,
  deleteComment,
  likeComment,
  likeStory,
  getStoryCommentCount,
  dislikeComment
} from '../controllers/commentController.js';

import { story as fololo } from "../seed/seedFololo.js";

// Helper: find story by ObjectId or slug
async function findStoryByIdOrSlug(idOrSlug) {
  if (! idOrSlug) return null;
  let clean = typeof idOrSlug === 'string' ?  idOrSlug. trim(). toLowerCase() : String(idOrSlug);

  const isObjectId = mongoose.Types.ObjectId.isValid(clean);
  if (! isObjectId && !/^[a-z0-9-]+$/.test(clean)) return null;
  const query = isObjectId ?  { _id: clean } : { slug: clean };
  const story = await Blog.findOne(query). lean();
  if (!story) return null;
  if (!Array.isArray(story.interactions)) story.interactions = [];
  if (!Array.isArray(story.comments)) story.comments = [];
  return story;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path. dirname(__filename);
const router = express.Router();

// Rate limiters (defined once)
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again later.' }
});

const answerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { error: 'Too many answer attempts, please slow down.' }
});

// --- CONFIGURE THE SEED STORY AND IMAGE ---
const storyData = fololo;
const imagePath = path.resolve(storyData.imagePath);
const storyTitle = storyData. title;
const storySlug = slugify(storyTitle, { lower: true, strict: true });

// --- Helper: Read and encode image as base64 ---
function getBase64Image(imagePath) {
  if (!fs.existsSync(imagePath)) {
    console.warn(`⚠️ Image not found: ${imagePath}`);
    return null;
  }
  const ext = path.extname(imagePath). slice(1). toLowerCase() || "png";
  const mime = ext ?  `image/${ext}` : "image/png";
  const base64 = fs.readFileSync(imagePath, "base64");
  return `data:${mime};base64,${base64}`;
}

// --- Main seeding function ---
async function seedStory() {
  if (!storySlug) {
    console.error("🚫 Computed empty slug.  Aborting.");
    return;
  }

  const existing = await Blog.findOne({ slug: storySlug }). lean();
  const drift = await Blog.findOne({ title: storyTitle, slug: { $ne: storySlug } }).lean();
  if (drift) {
    console.warn(`⚠️ Title "${storyTitle}" exists with mismatched slug (${drift.slug}). `);
  }

  const image = getBase64Image(imagePath);

  const updateFields = {
    title: storyTitle,
    content: storyData. content,
    ...(image ?  { image } : {}),
    updatedAt: new Date()
  };

  if (existing?. content === updateFields.content && existing?.image === updateFields.image) {
    console.log(`⚠️ No content/image change detected for "${storySlug}". Skipping update.`);
    return;
  }

  try {
    const res = await Blog.updateOne(
      { slug: storySlug },
      {
        $set: updateFields,
        $unset: { ratings: "" },
        $setOnInsert: { slug: storySlug, createdAt: new Date() }
      },
      { upsert: true }
    );
    const created = res.upsertedCount === 1 || Boolean(res.upsertedId);
    console. log(created
      ? `✅ Created "${storyTitle}" (slug: ${storySlug}). `
      : `✅ Updated "${storyTitle}" (slug: ${storySlug}).`
    );
  } catch (err) {
    console. error("🚫 Failed to seed story:", err);
  }
}

// ============================================================
// BLOG ROUTES
// ============================================================

router.post('/blog', authMiddleware, createLimiter, async (req, res) => {
  try {
    let { title, content, image, audioUrl, category } = req.body;
    title = title?. trim();
    content = content?.trim();
    image = image?.trim();
    audioUrl = audioUrl?.trim();
    category = category?.trim();

    if (!title || !content || !image || !audioUrl) {
      return res. status(400).json({ error: 'Title, content, image, and audioUrl are required' });
    }
    if (title.length > 100 || content.length > 10000) {
      return res.status(400).json({ error: 'Title or content too long' });
    }

    const slug = slugify(title, { lower: true, strict: true });
    const existingBlog = await Blog. findOne({ slug });
    if (existingBlog) {
      return res. status(400).json({ error: 'Story with this title already exists' });
    }

    let processedImage = image;
    try {
      const matches = image.match(/^data:image\/(jpeg|png);base64,(. +)$/);
      if (! matches) throw new Error('Invalid image encoding');
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length > 5 * 1024 * 1024) throw new Error('Image too large');
      processedImage = `data:image/${mimeType};base64,${(await sharp(buffer)
        [mimeType === 'png' ? 'png' : 'jpeg'](
          mimeType === 'png' ? { compressionLevel: 9 } : { quality: 90 }
        ). toBuffer()). toString('base64')}`;
    } catch (err) {
      console.error('❌ Sharp image error:', err);
      return res.status(400).json({ error: 'Image validation failed: ' + err.message });
    }

    const article = new Blog({
      title,
      slug,
      content,
      image: processedImage,
      audioUrl,
      category: category || undefined,
      interactions: [],
      totalRatings: 0,
      totalViews: 0,
      bookmarksCount: 0,
      completionsCount: 0,
      commentsCount: 0,
      likesCount: 0,
      dislikesCount: 0,
    });

    article.interactions.push({
      userId: req.user._id. toString(),
      type: 'rating',
      score: 5,
    });
    article. totalRatings = 1;
    await article.save();

    res.status(201). json({
      article: {
        _id: article._id,
        slug: article.slug,
        title: article.title,
        content: article.content,
        category: article.category,
        interactions: article.interactions,
        totalRatings: article.totalRatings,
        totalViews: article.totalViews,
        bookmarksCount: article. bookmarksCount,
        completionsCount: article.completionsCount,
        commentsCount: article. commentsCount,
        likesCount: article.likesCount,
        dislikesCount: article. dislikesCount,
        image: article.image,
        audioUrl: article.audioUrl
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400). json({ error: 'Story with this title or slug already exists' });
    }
    console.error('❌ Blog POST error:', error);
    res.status(500).json({ error: 'An error occurred while saving story: ' + error.message });
  }
});

router.post('/story/:id/like', authMiddleware, likeStory);

router.get("/stories", async (req, res) => {
  try {
    const stories = await Blog.find().sort({ title: 1 }). lean();
    res. json(stories);
  } catch (error) {
    console.error("Error getting all stories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/story/:storyId", async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await findStoryByIdOrSlug(storyId);
    if (!story) return res.status(404). json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    console. error("Error fetching story:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/user/rated-stories', authMiddleware, async (req, res) => {
  try {
    const userId = req.user. id;
    const userIdMatch = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const stories = await Blog.find({
      interactions: { 
        $elemMatch: { 
          userId: userIdMatch, 
          type: 'rating', 
          score: { $gt: 0 }
        } 
      }
    })
    .select('_id title content interactions category slug')
    .lean();

    const formatted = stories.map(story => {
      const userRatings = story. interactions
        ?.filter(i => String(i.userId) === String(userIdMatch) && i.type === 'rating')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      const latest = userRatings?.[0] || {};
      return {
        id: story._id,
        title: story.title,
        content: story.content,
        category: story.category ??  null,
        slug: story.slug ??  null,
        rating: latest.score ??  0,
        ratedAt: latest.updatedAt ??  null,
        interactions: story.interactions
      };
    });

    formatted.sort((a, b) => new Date(b.ratedAt) - new Date(a.ratedAt));
    res.json({ stories: formatted });
  } catch (error) {
    console.error('Error fetching rated stories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/check', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?. id;
    const storyId = req.query.storyId;
    if (!storyId) return res.status(400).json({ error: 'Missing storyId' });
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    const story = await findStoryByIdOrSlug(storyId);
    if (!story) return res.status(404). json({ error: 'Story not found' });

    const userRating = story.interactions. find(i =>
      String(i.userId) === String(userId) &&
      (i.type === 'rating' || i.score > 0)
    );

    res.json({
      score: userRating?. score ??  0,
      rated: Boolean(userRating),
      userId,
      storyId
    });
  } catch (err) {
    console.error('Rating check failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/story/:storyId/rate', authMiddleware, async (req, res) => {
  const { storyId } = req.params;
  const { score } = req.body;
  const userId = req.user. id;

  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ error: 'A rating score between 1 and 5 is required.' });
  }

  try {
    const story = await Blog.findById(storyId);
    if (!story) {
      return res. status(404).json({ error: 'Story not found.' });
    }

    if (! Array.isArray(story.interactions)) {
      story.interactions = [];
    }
    
    const existingRatingIndex = story.interactions.findIndex(
      i => String(i.userId) === String(userId) && i.type === 'rating'
    );

    if (existingRatingIndex > -1) {
      story.interactions[existingRatingIndex].score = score;
      story.interactions[existingRatingIndex].updatedAt = new Date();
    } else {
      story. interactions.push({
        userId,
        type: 'rating',
        score,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const allRatings = story.interactions.filter(i => i. type === 'rating' && i.score > 0);
    story.totalRatings = allRatings.length;
    story.averageRating = allRatings.reduce((acc, i) => acc + i.score, 0) / (allRatings. length || 1);

    await story. save();

    io.to(`story:${storyId}`).emit('story:rated', { 
      storyId, 
      newRating: score,
      averageRating: story.averageRating 
    });

    res.status(200).json({
      message: 'Rating submitted successfully.',
      score: score,
      averageRating: story.averageRating,
    });

  } catch (error) {
    console.error('❌ Rating submission error:', error);
    res.status(500).json({ error: 'An error occurred while submitting the rating.' });
  }
});

router.get("/user/:userId/ratingStats", async (req, res) => {
  try {
    const { userId } = req. params;
    const result = await Blog.aggregate([
      {
        $match: {
          interactions: {
            $elemMatch: {
              userId,
              type: "rating",
              score: { $gt: 0 }
            }
          }
        }
      },
      {
        $project: {
          category: 1,
          ratings: {
            $filter: {
              input: "$interactions",
              as: "i",
              cond: {
                $and: [
                  { $eq: ["$$i.userId", userId] },
                  { $eq: ["$$i. type", "rating"] },
                  { $gt: ["$$i.score", 0] }
                ]
              }
            }
          }
        }
      },
      { $unwind: "$ratings" },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgScore: { $avg: "$ratings.score" },
          lastRatedAt: { $max: "$ratings.updatedAt" }
        }
      },
      { $sort: { count: -1 } },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: "$count" },
          averageScore: { $avg: "$avgScore" },
          lastRatedAt: { $max: "$lastRatedAt" },
          mostRatedCategory: { $first: "$_id" }
        }
      },
      {
        $project: {
          _id: 0,
          totalRatings: 1,
          averageScore: 1,
          lastRatedAt: 1,
          mostRatedCategory: 1
        }
      }
    ]);

    res. json(
      result[0] || {
        userId,
        totalRatings: 0,
        averageScore: 0,
        mostRatedCategory: null,
        lastRatedAt: null
      }
    );
  } catch (error) {
    console.error("Error computing rating stats:", error);
    res.status(500).json({ error: "Failed to compute rating stats" });
  }
});

router.get('/stories/all-rated', async (req, res) => {
  try {
    const minScore = parseFloat(req.query.minScore) || 1;

    const stories = await Blog.find({
      interactions: {
        $elemMatch: {
          type: 'rating',
          score: { $gte: minScore }
        }
      }
    })
      .select('_id title slug content category interactions totalRatings averageRating createdAt')
      .lean();

    const storiesWithStats = stories.map(story => {
      const ratings = story.interactions?. filter(i => i.type === 'rating') || [];
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings
        : 0;

      return {
        id: story._id,
        _id: story._id,
        title: story.title,
        slug: story. slug,
        content: story.content,
        category: story.category,
        interactions: story.interactions,
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    });

    storiesWithStats.sort((a, b) => b.averageRating - a. averageRating);

    res.json({ stories: storiesWithStats });

  } catch (error) {
    console.error('[GET /stories/all-rated] error:', error);
    res.status(500). json({ error: 'Failed to fetch rated stories' });
  }
});

// ============================================================
// COMMENTS ROUTES
// ============================================================
router.post('/story/:storyId/comment', authMiddleware, createComment);
router.get('/story/:storyId/comments', getComments);
router.patch('/comment/:id', authMiddleware, editComment);
router. delete('/comment/:id', authMiddleware, deleteComment);
router.post('/comments/:commentId/dislike', authMiddleware, dislikeComment);
router.post('/comment/:id/like', authMiddleware, likeComment);
router.get('/story/:storyId/comments/count', getStoryCommentCount);

// ============================================================
// VIEW COUNTER
// ============================================================
router.post('/story/:storyId/view', async (req, res) => {
  const { storyId } = req.params;
  const { userId } = req. body;
  try {
    const story = await Blog.findById(storyId);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    if (!Array. isArray(story. interactions)) story.interactions = [];
    let interaction = story.interactions.find(
      i => String(i.userId) === String(userId) && i.type === 'view'
    );
    if (!interaction) {
      interaction = { userId, type: 'view', viewCount: 1 };
      story.interactions. push(interaction);
      story.totalViews = typeof story.totalViews === 'number' ? story.totalViews + 1 : 1;
    } else {
      interaction.viewCount += 1;
    }
    await story.save();
    io.to(`story:${storyId}`).emit('story:viewed', { storyId, totalViews: story. totalViews });
    res.json({
      totalViews: story.totalViews,
      userViewCount: interaction. viewCount
    });
  } catch (err) {
    res.status(500). json({ error: err.message });
  }
});

export default router;