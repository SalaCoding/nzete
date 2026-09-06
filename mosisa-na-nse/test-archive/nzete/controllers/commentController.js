import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';

// --- Helper: sanitize text input for comments ---
function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  // Remove any HTML tags and trim
  return text.replace(/(<([^>]+)>)/gi, "").trim().slice(0, 2000); // Limit to 2000 chars
}

export async function createComment(req, res) {
  try {
    const { storyId } = req.params;
    const { text, userId, username, parentId } = req.body;

    // Security: Validate userId and username as string, and sanitize text
    if (!sanitizeText(text) || !userId || !username || typeof userId !== 'string' || typeof username !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    let ancestry = [];

    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ error: 'Invalid parentId' });
      }

      const parent = await Comment.findById(parentId);
      if (!parent) {
        return res.status(404).json({ error: 'Parent not found' });
      }
      ancestry = Array.isArray(parent.ancestry)
        ? [...parent.ancestry, parent._id]
        : [parent._id];
    }

    const newComment = await Comment.create({
      storyId: new mongoose.Types.ObjectId(storyId),
      text: sanitizeText(text),
      userId,
      username,
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
      ancestry
    });

    await Blog.findByIdAndUpdate(
      storyId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );

    req.io?.to?.(`story:${storyId}`).emit('comment:new', newComment);
    req.io?.to?.(`story:${storyId}`).emit('comment:count', { increment: 1 });

    res.status(201).json({ newComment });
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getComments(req, res) {
  try {
    const { storyId } = req.params;
    // Security: Validate storyId
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ error: 'Invalid storyId' });
    }
    const comments = await Comment.find({ storyId }).sort({ createdAt: 1 });
    const tree = buildCommentTree(comments);
    res.json({ comments: tree, commentsCount: comments.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function editComment(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;
    // Security: Only allow edit if text is valid
    if (!sanitizeText(text)) return res.status(400).json({ error: 'Text is empty or invalid' });

    const updated = await Comment.findByIdAndUpdate(
      id,
      { text: sanitizeText(text), updatedAt: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found' });

    req.io?.to?.(`story:${updated.storyId}`).emit('comment:edit', updated);
    res.json({ updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function likeStory(req, res) {
  try {
    const { id } = req.params; // story ID
    const { userId } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid userId' });
    }

    const story = await Blog.findById(id);
    if (!story) return res.status(404).json({ error: 'Story not found' });

    const alreadyLiked = story.likes.some(like => like.userId === userId);

    if (alreadyLiked) {
      story.likes = story.likes.filter(like => like.userId !== userId);
      story.likesCount = Math.max(0, story.likesCount - 1);
    } else {
      story.likes.push({ userId });
      story.likesCount += 1;
    }

    story.updatedAt = new Date();
    await story.save();

    req.io?.to?.(`story:${story._id}`).emit('story:like', {
      storyId: story._id,
      likesCount: story.likesCount,
      likedByUser: !alreadyLiked
    });

    res.json({
      storyId: story._id,
      likesCount: story.likesCount,
      likedByUser: !alreadyLiked
    });
  } catch (err) {
    console.error('❌ likeStory error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteComment(req, res) {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Not found' });

    await Comment.deleteOne({ _id: id });

    await Blog.findByIdAndUpdate(
      comment.storyId,
      { $inc: { commentsCount: -1 } },
      { new: true }
    );

    req.io?.to?.(`story:${comment.storyId}`).emit('comment:delete', { id });
    req.io?.to?.(`story:${comment.storyId}`).emit('comment:count', { increment: -1 });

    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function likeComment(req, res) {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.user?.id;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid userId' });
    }

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const wasDisliked = comment.dislikedBy.includes(userId);
    if (wasDisliked) {
      comment.dislikedBy = comment.dislikedBy.filter(uid => uid !== userId);
      comment.dislikesCount = comment.dislikedBy.length;
    }

    const alreadyLiked = comment.likes.some(like => like.userId === userId);
    if (alreadyLiked) {
      comment.likes = comment.likes.filter(like => like.userId !== userId);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      comment.likes.push({ userId });
      comment.likesCount += 1;
    }

    comment.updatedAt = new Date();
    await comment.save();

    req.io?.to?.(`story:${comment.storyId}`).emit('comment:like', {
      commentId: comment._id,
      likesCount: comment.likesCount,
      likedByUser: !alreadyLiked,
      dislikedByUser: false,
      dislikesCount: comment.dislikesCount
    });

    res.json({
      commentId: comment._id,
      likesCount: comment.likesCount,
      likedByUser: !alreadyLiked,
      dislikedByUser: false,
      dislikesCount: comment.dislikesCount
    });
  } catch (err) {
    console.error('❌ likeComment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function dislikeComment(req, res) {
  try {
    const userId = req.body.userId || req.user?.id;
    const { commentId } = req.params;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid userId' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId.toString() === userId.toString()) {
      return res.status(400).json({ error: 'You cannot dislike your own comment' });
    }

    const wasLiked = comment.likes.some(like => like.userId === userId);
    if (wasLiked) {
      comment.likes = comment.likes.filter(like => like.userId !== userId);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    }

    const alreadyDisliked = comment.dislikedBy.includes(userId);
    if (alreadyDisliked) {
      comment.dislikedBy = comment.dislikedBy.filter(uid => uid !== userId);
    } else {
      comment.dislikedBy.push(userId);
    }
    comment.dislikesCount = comment.dislikedBy.length;

    comment.updatedAt = new Date();
    await comment.save();

    req.io?.to?.(`story:${comment.storyId}`).emit('comment:dislike', {
      commentId: comment._id,
      dislikesCount: comment.dislikesCount,
      dislikedByUser: !alreadyDisliked,
      likesCount: comment.likesCount,
      likedByUser: false
    });

    res.json({
      commentId: comment._id,
      dislikesCount: comment.dislikesCount,
      dislikedByUser: !alreadyDisliked,
      likesCount: comment.likesCount,
      likedByUser: false
    });
  } catch (err) {
    console.error('Error disliking comment:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function getStoryCommentCount(req, res) {
  try {
    const { storyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ error: 'Invalid storyId' });
    }
    const blog = await Blog.findById(storyId).select('commentsCount');
    if (!blog) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json({ total: blog.commentsCount || 0 });
  } catch (err) {
    console.error('Error fetching comment count:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function buildCommentTree(flatComments) {
  const map = {};
  const roots = [];

  flatComments.forEach(c => {
    map[c._id] = { ...c.toObject(), replies: [] };
  });

  flatComments.forEach(c => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].replies.push(map[c._id]);
    } else {
      roots.push(map[c._id]);
    }
  });

  return roots;
}