// /library/commentsStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getStoryComments,
  addStoryComment,
  editStoryComment,
  deleteStoryComment,
  getStoryCommentCount,
  likeComment,
  dislikeComment
} from '../constants/commentsApi';
import { useAuthUserStore } from './authUserStore';

// Factory for an empty story slice
const emptyStory = () => ({
  byId: {},
  rootIds: [],
  childrenByParent: {},
  count: 0,
  loading: false,
  posting: false,
  error: null,
  lastSyncAt: null
});

export const useCommentsStore = create(
  persist(
    (set, get) => ({
      byStory: {},

      // Ensure a story slice exists
      ensureStory: (storyId) =>
        set((state) => {
          if (state.byStory[storyId]) return state;
          return { byStory: { ...state.byStory, [storyId]: emptyStory() } };
        }),

      // Merge multiple comments into store
      upsertMany: (storyId, comments) => {
        const state = get();
        state.ensureStory(storyId);
        const cur = state.byStory[storyId];
        const byId = { ...cur.byId };
        const childrenByParent = { ...cur.childrenByParent };
        const rootIds = new Set(cur.rootIds);

        for (const c of comments) {
          byId[c._id] = { ...byId[c._id], ...c };
          const pid = c.parentId ?? null;
          if (pid === null) {
            rootIds.add(c._id);
          } else {
            const arr = childrenByParent[pid] ? [...childrenByParent[pid]] : [];
            if (!arr.includes(c._id)) arr.unshift(c._id);
            childrenByParent[pid] = arr;
          }
        }

        set({
          byStory: {
            ...state.byStory,
            [storyId]: { ...cur, byId, childrenByParent, rootIds: Array.from(rootIds) }
          }
        });
      },

      // Merge a single comment
      upsertOne: (storyId, comment) => get().upsertMany(storyId, [comment]),

      // Remove a comment
      removeOne: (storyId, id, { adjustCount = false } = {}) => {
        const state = get();
        const cur = state.byStory[storyId];
        if (!cur) return;

        const byId = { ...cur.byId };
        const childrenByParent = { ...cur.childrenByParent };
        const rootIds = cur.rootIds.filter((rid) => rid !== id);
        const parentId = byId[id]?.parentId ?? null;

        delete byId[id];
        if (parentId !== null) {
          childrenByParent[parentId] = (childrenByParent[parentId] || []).filter(
            (cid) => cid !== id
          );
        }
        delete childrenByParent[id];

        set({
          byStory: {
            ...state.byStory,
            [storyId]: { ...cur, byId, rootIds, childrenByParent },
            count: adjustCount ? Math.max(0, (cur.count || 0) - 1) : cur.count
          }
        });
      },

      load: async (storyId, opts) => {
        const { user } = useAuthUserStore.getState();
        if (!storyId || !user?._id) return;

        const state = get();
        state.ensureStory(storyId);

        set((prev) => ({
          byStory: {
            ...prev.byStory,
            [storyId]: { ...prev.byStory[storyId], loading: true, error: null }
          }
        }));

        try {
          const since = opts?.since ?? get().byStory[storyId]?.lastSyncAt;
          const { comments = [] } = await getStoryComments(storyId, { since });
          get().upsertMany(storyId, comments);

          set((prev) => ({
            byStory: {
              ...prev.byStory,
              [storyId]: {
                ...prev.byStory[storyId],
                loading: false,
                lastSyncAt: new Date().toISOString()
              }
            }
          }));
        } catch (e) {
          set((prev) => ({
            byStory: {
              ...prev.byStory,
              [storyId]: {
                ...prev.byStory[storyId],
                loading: false,
                error: e?.message ?? 'Failed to load comments'
              }
            }
          }));
        }
      },

      post: async (storyId, text, parentId = null) => {
        const { user, token } = useAuthUserStore.getState();
        if (!storyId || !user?._id || !text?.trim()) return;

        get().ensureStory(storyId);

        // Normalise parentId: null for root, string for reply
        const safeParentId = parentId || null;

        // Optimistic comment
        const tempId = `temp-${Date.now()}`;
        const optimistic = {
          _id: tempId,
          storyId,
          parentId: safeParentId,
          text: text.trim(),
          userId: user._id,
          username: user.username,
          likesCount: 0,
          likedByUser: false,
          createdAt: new Date().toISOString(),
          optimistic: true
        };
        get().upsertOne(storyId, optimistic);

        try {
          const payload = {
            text: text.trim(),
            parentId: safeParentId, // ✅ backend expects this
            userId: user._id,
            username: user.username
          };

          const { newComment, error } = await addStoryComment(storyId, payload, token);
          if (error) throw new Error(error);

          // Replace temp with real comment
          if (newComment?._id) {
            get().removeOne(storyId, tempId);
            get().upsertOne(storyId, newComment);
          } else {
            // If backend didn't return the comment, reload from server
            await get().load(storyId);
          }
        } catch (err) {
          console.error('Failed to post comment:', err);
          get().removeOne(storyId, tempId);
        }
      },

      edit: async (storyId, commentId, text) => {
        const { token } = useAuthUserStore.getState();
        if (!storyId || !commentId || !text?.trim()) return;

        const prev = get().byStory[storyId]?.byId[commentId];
        if (!prev) return;

        // Optimistic update
        get().upsertOne(storyId, { ...prev, text, updatedAt: new Date().toISOString() });

        try {
          const { updated, error } = await editStoryComment(commentId, { text }, token);
          if (error) throw new Error(error);
          if (updated?._id) get().upsertOne(storyId, updated);
        } catch (err) {
          console.error(err);
          get().upsertOne(storyId, prev); // rollback
        }
      },

remove: async (storyId, commentId) => {
  const { token } = useAuthUserStore.getState();
  if (!storyId || !commentId) return;

  // Soft delete locally (sets deletedAt)
  const prev = get().byStory[storyId]?.byId[commentId];
  if (!prev) return;
  get().upsertOne(storyId, { ...prev, deletedAt: new Date().toISOString(), text: '', username: null });

  try {
    const { deleted, error } = await deleteStoryComment(commentId, token);
    if (error || !deleted) throw new Error(error || 'Delete failed');
    // Hard delete from local state and adjust count
    get().removeOne(storyId, commentId, { adjustCount: true });
    await get().refreshCount(storyId);
  } catch (error) {
    console.error('Failed to delete comment:', error);
    // Rollback soft delete
    get().upsertOne(storyId, prev);
    await get().refreshCount(storyId);
  }
},

likeOne: async (storyId, commentId) => {
  const { user, token } = useAuthUserStore.getState();
  if (!storyId || !commentId || !user?._id) return;

  const prev = get().byStory[storyId]?.byId[commentId];
  if (!prev) return;

  // Optimistic arrays
  let likedBy = Array.isArray(prev.likedBy) ? [...prev.likedBy] : [];
  let dislikedBy = Array.isArray(prev.dislikedBy) ? [...prev.dislikedBy] : [];

  // Toggle like
  if (likedBy.includes(user._id)) {
    likedBy = likedBy.filter(uid => uid !== user._id);
  } else {
    likedBy.push(user._id);
    // Remove dislike if present!
    dislikedBy = dislikedBy.filter(uid => uid !== user._id);
  }

  // Optimistic update
  get().upsertOne(storyId, {
    ...prev,
    likedBy,
    likesCount: likedBy.length,
    dislikedBy,
    dislikesCount: dislikedBy.length,
  });

  try {
    const res = await likeComment(commentId, user._id, token);
    get().upsertOne(storyId, {
      ...prev,
      likedBy: res?.likedBy ?? likedBy,
      likesCount: res?.likesCount ?? likedBy.length,
      dislikedBy: res?.dislikedBy ?? dislikedBy,
      dislikesCount: res?.dislikesCount ?? dislikedBy.length,
    });
  } catch (err) {
    console.error(err);
    get().upsertOne(storyId, prev);
  }
},

dislikeOne: async (storyId, commentId) => {
  const { user, token } = useAuthUserStore.getState();
  if (!storyId || !commentId || !user?._id) return;

  const prev = get().byStory[storyId]?.byId[commentId];
  if (!prev) return;

  // Optimistic arrays
  let dislikedBy = Array.isArray(prev.dislikedBy) ? [...prev.dislikedBy] : [];
  let likedBy = Array.isArray(prev.likedBy) ? [...prev.likedBy] : [];

  // Toggle dislike
  if (dislikedBy.includes(user._id)) {
    dislikedBy = dislikedBy.filter(uid => uid !== user._id);
  } else {
    dislikedBy.push(user._id);
    // Remove like if present!
    likedBy = likedBy.filter(uid => uid !== user._id);
  }

  // Optimistic update
  get().upsertOne(storyId, {
    ...prev,
    dislikedBy,
    dislikesCount: dislikedBy.length,
    likedBy,
    likesCount: likedBy.length,
  });

  try {
    const res = await dislikeComment(commentId, user._id, token);
    get().upsertOne(storyId, {
      ...prev,
      dislikedBy: res?.dislikedBy ?? dislikedBy,
      dislikesCount: res?.dislikesCount ?? dislikedBy.length,
      likedBy: res?.likedBy ?? likedBy,
      likesCount: res?.likesCount ?? likedBy.length,
    });
  } catch (err) {
    console.error(err);
    get().upsertOne(storyId, prev);
  }
},
      refreshCount: async (storyId) => {
      try {
        const res = await getStoryCommentCount(storyId);

        // Handle different possible field names from backend
        const total =
          res?.total ??
          res?.count ??
          res?.commentsCount ??
          0;

        set((prev) => {
          const currentStory = prev.byStory[storyId] || emptyStory();
          return {
            byStory: {
              ...prev.byStory,
              [storyId]: {
                ...currentStory,
                count: total
              }
            }
          };
        });
      } catch (err) {
        console.error('Failed to refresh comment count:', err);
      }
    }
    }),
    {
      name: 'comments-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1.0
    }
  )
)