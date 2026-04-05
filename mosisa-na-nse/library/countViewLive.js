import { create } from 'zustand';
import { useAuthUserStore, fetchProtected } from './authUserStore';
//import { API_URL } from '../constants/api';

const userIdFrom = (user) => user?.id || user?._id || user?.userId || null;

export const useCountViewLive = create((set, get) => ({
  stories: {},

  setStoryViews: (storyId, totalViews, userViewCount) =>
    set((state) => ({
      stories: {
        ...state.stories,
        [storyId]: {
          ...(state.stories[storyId] || {}),
          totalViews: typeof totalViews === 'number' ? totalViews : 0,
          userViewCount: typeof userViewCount === 'number' ? userViewCount : 0,
        },
      },
    })),

  // Record a view on the backend and update store
  recordView: async (storyId, userId) => {
    // Try to get userId from auth store if not provided
    if (!userId) {
      const user = useAuthUserStore.getState().user;
      userId = userIdFrom(user);
    }
    if (!storyId || !userId) {
      console.warn('Missing storyId or userId in recordView');
      return;
    }
    try {
      const data = await fetchProtected(`/api/blog/story/${storyId}/view`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: { 'Content-Type': 'application/json' },
      });
      // Defensive default to 0 if undefined
      get().setStoryViews(
        storyId,
        typeof data.totalViews === 'number' ? data.totalViews : 0,
        typeof data.userViewCount === 'number' ? data.userViewCount : 0
      );
    } catch (err) {
      console.error('View recording failed:', err);
    }
  },

  // Update views from socket event
  updateViewsFromSocket: (storyId, totalViews) =>
    set((state) => ({
      stories: {
        ...state.stories,
        [storyId]: {
          ...(state.stories[storyId] || {}),
          totalViews: typeof totalViews === 'number' ? totalViews : 0,
        },
      },
    })),
}));