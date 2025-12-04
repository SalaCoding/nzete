import { API_URL } from './api';

const API_BASE_URL = API_URL;

/**
 * Posts a new comment to a story.
 * Security: Payload is validated for required fields.
 */
export async function addStoryComment(storyId, payload, token) {
  if (
    !payload?.text ||
    !payload?.userId ||
    !payload?.username ||
    typeof payload.text !== "string" ||
    payload.text.length > 2000 ||
    typeof payload.userId !== "string" ||
    typeof payload.username !== "string"
  ) {
    return { newComment: null, error: 'Invalid payload' };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/story/${storyId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { newComment: null, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { newComment: data.newComment || null };
  } catch (err) {
    return { newComment: null, error: err.message };
  }
}

/**
 * Fetches all comments for a specific story and reconstructs ancestry.
 * Security: Validates storyId format.
 */
export async function getStoryComments(storyId) {
  if (!storyId || typeof storyId !== "string") {
    return { comments: [], commentsCount: 0, error: 'Invalid storyId' };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/story/${storyId}/comments`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return { comments: [], commentsCount: 0, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    const flatComments = data.comments || [];

    const { tree, count } = buildCommentTree(flatComments);

    return { comments: tree, commentsCount: count };
  } catch (err) {
    return { comments: [], commentsCount: 0, error: err.message };
  }
}

/**
 * Deletes a comment by ID.
 * Security: Validates commentId format.
 */
export async function deleteStoryComment(commentId, token) {
  if (!commentId || typeof commentId !== "string") {
    return { deleted: false, storyId: null, newCount: null, error: 'Invalid commentId' };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      return { deleted: false, storyId: null, newCount: null, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return {
      deleted: data.deleted || false,
      storyId: data.storyId ?? null,
      newCount: data.newCount ?? null
    };
  } catch (err) {
    return { deleted: false, storyId: null, newCount: null, error: err.message };
  }
}

/**
 * Gets the total comment count for a story.
 * Security: Validates storyId format.
 */
export async function getStoryCommentCount(storyId) {
  if (!storyId || typeof storyId !== "string") {
    return { total: 0 };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/story/${storyId}/comments/count`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error(`Failed to fetch comment count: ${res.status} ${res.statusText}`);
      return { total: 0 };
    }

    const data = await res.json();
    return { total: data.total ?? data.commentsCount ?? data.count ?? 0 };
  } catch (err) {
    console.error('Error fetching comment count:', err);
    return { total: 0 };
  }
}

/**
 * Likes a comment.
 * Security: Validates IDs and userId.
 */
export async function likeComment(commentId, userId, token) {
  if (
    !commentId ||
    typeof commentId !== "string" ||
    !userId ||
    typeof userId !== "string"
  ) {
    return {
      commentId,
      likesCount: null,
      likedByUser: null,
      dislikesCount: null,
      dislikedByUser: null,
      error: 'Invalid commentId or userId'
    };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/comment/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      return {
        commentId,
        likesCount: null,
        likedByUser: null,
        dislikesCount: null,
        dislikedByUser: null,
        error: `HTTP ${res.status}`
      };
    }

    const data = await res.json();
    return {
      commentId: data.commentId ?? data.comment?._id ?? commentId,
      likesCount: data.likesCount ?? data.comment?.likesCount ?? 0,
      likedByUser: data.likedByUser ?? data.comment?.likedByUser ?? false,
      dislikesCount: data.dislikesCount ?? data.comment?.dislikesCount ?? 0,
      dislikedByUser: data.dislikedByUser ?? data.comment?.dislikedByUser ?? false
    };
  } catch (err) {
    return {
      commentId,
      likesCount: null,
      likedByUser: null,
      dislikesCount: null,
      dislikedByUser: null,
      error: err.message
    };
  }
}

/**
 * Dislikes a comment.
 * Security: Validates IDs and userId.
 */
export async function dislikeComment(commentId, userId, token) {
  if (
    !commentId ||
    typeof commentId !== "string" ||
    !userId ||
    typeof userId !== "string"
  ) {
    return {
      commentId,
      likesCount: null,
      likedByUser: null,
      dislikesCount: null,
      dislikedByUser: null,
      error: 'Invalid commentId or userId'
    };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/comments/${commentId}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      return {
        commentId,
        likesCount: null,
        likedByUser: null,
        dislikesCount: null,
        dislikedByUser: null,
        error: `HTTP ${res.status}`
      };
    }

    const data = await res.json();
    return {
      commentId: data.commentId ?? commentId,
      likesCount: data.likesCount ?? data.comment?.likesCount ?? 0,
      likedByUser: data.likedByUser ?? data.comment?.likedByUser ?? false,
      dislikesCount: data.dislikesCount ?? data.comment?.dislikesCount ?? 0,
      dislikedByUser: data.dislikedByUser ?? data.comment?.dislikedByUser ?? true
    };
  } catch (err) {
    return {
      commentId,
      likesCount: null,
      likedByUser: null,
      dislikesCount: null,
      dislikedByUser: null,
      error: err.message
    };
  }
}

/**
 * Likes or unlikes a story.
 * Security: Validates IDs and userId.
 */
export async function likeStory(storyId, userId, token) {
  if (
    !storyId ||
    typeof storyId !== "string" ||
    !userId ||
    typeof userId !== "string"
  ) {
    return {
      storyId,
      likesCount: null,
      likedByUser: null,
      error: 'Invalid storyId or userId'
    };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/story/${storyId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      return {
        storyId,
        likesCount: null,
        likedByUser: null,
        error: `HTTP ${res.status}`
      };
    }

    const data = await res.json();
    return {
      storyId: data.storyId ?? storyId,
      likesCount: data.likesCount ?? 0,
      likedByUser: data.likedByUser ?? false
    };
  } catch (err) {
    return {
      storyId,
      likesCount: null,
      likedByUser: null,
      error: err.message
    };
  }
}

/**
 * Builds a nested comment tree from a flat array, preserving ancestry arrays.
 */
function buildCommentTree(flatComments) {
  const map = {};
  const roots = [];

  flatComments.forEach(comment => {
    map[comment._id] = { ...comment, replies: [], ancestry: comment.ancestry || [] };
  });

  flatComments.forEach(comment => {
    if (comment.parentId && map[comment.parentId]) {
      map[comment.parentId].replies.push(map[comment._id]);
    } else {
      roots.push(map[comment._id]);
    }
  });

  return { tree: roots, count: flatComments.length };
}