import { create } from 'zustand';
import { fetchProtected } from '../lib/api';
import { API_URL } from '../constants/api';

const gt = (score, min) => Number(score) > Number(min);

export const useStoryStore = create((set, get) => ({
  token: null,
  userId: null,

  stories: [],
  ratedStories: [],
  allRatedStories: [],
  allRatedStoriesLoading: false,
  allRatedStoriesError: null,
  currentStory: null,
  isLoading: false,
  error: null,

  ratingStats: null,
  ratingStatsLoading: false,
  ratingStatsError: null,

  setToken: (token) => set({ token }),
  setUserId: (userId) => set({ userId }),
  setCurrentStory: (story) => set({ currentStory: story }),

  fetchAllStories: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const json = await fetchProtected(`/api/blog/stories?page=${page}&limit=${limit}`);
      const data = Array.isArray(json) ? json : (json. stories || json. data || []);
      set({ stories: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  fetchRatedStories: async () => {
    const { userId } = get();
    if (!userId) return;

    set({ isLoading: true, error: null });
    try {
      const json = await fetchProtected(`/api/blog/user/rated-stories`);
      const ratedWithScore = (json?. stories ??  []).map(story => {
        const myRating = story. rating ??  (
          story.interactions?. find(
            i => String(i.userId) === String(userId) && i.type === 'rating'
          )?.score ??  0
        );
        return { ...story, rating: myRating };
      });
      set({ ratedStories: ratedWithScore, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  // NEW: Fetch all stories rated by any user
  fetchAllRatedStories: async (minScore = 1) => {
    set({ allRatedStoriesLoading: true, allRatedStoriesError: null });
    try {
      const response = await fetch(`${API_URL}/api/blog/stories/all-rated? minScore=${minScore}`);
      const data = await response.json();

      if (! response.ok) {
        throw new Error(data.error || 'Failed to fetch rated stories');
      }

      set({
        allRatedStories: data. stories || [],
        allRatedStoriesLoading: false
      });
      return { success: true, stories: data.stories };
    } catch (err) {
      set({ allRatedStoriesError: err.message, allRatedStoriesLoading: false });
      return { success: false, error: err.message };
    }
  },

  fetchRatingStats: async () => {
    const { userId } = get();
    if (!userId) return;

    set({ ratingStatsLoading: true, ratingStatsError: null });

    try {
      const stats = await fetchProtected(`/api/blog/user/${userId}/ratingStats`);
      set({ ratingStats: stats, ratingStatsLoading: false });
    } catch (err) {
      set({ ratingStatsError: err.message, ratingStatsLoading: false });
    }
  },

  createStory: async (title, content, image, audioUrl) => {
    set({ isLoading: true, error: null });
    try {
      const clean = {
        title: typeof title === 'string' ? title.trim() : '',
        content: typeof content === 'string' ?  content.replace(/<[^>]*>? /gm, '').trim() : '',
        image: typeof image === 'string' ? image.trim() : null,
        audioUrl: typeof audioUrl === 'string' ?  audioUrl.trim() : null,
      };
      if (! clean.title || !clean.content || !clean.image || !clean.audioUrl) {
        set({ isLoading: false, error: 'Missing required story fields.' });
        return { success: false, error: 'Missing required story fields.' };
      }
      const data = await fetchProtected(`/api/blog/story`, {
        method: 'POST',
        body: JSON.stringify(clean),
      });
      const article = data.article || data. story || data;
      set((state) => ({ stories: [...state.stories, article], isLoading: false }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  mapInteractionsToRatings: (story) => {
    return (story.interactions || []). map(i => ({
      user: i.userId,
      score: i.score,
      createdAt: i. updatedAt
    }));
  },

  getMyRatedAbove: (min = 2) => {
    const { stories, userId } = get();
    return stories.filter(story =>
      story?. interactions?.some(i => i.userId === userId && gt(i.score, min))
    );
  },

  getPopularAbove: (min = 2) => {
    const { stories } = get();
    return (stories || []).filter(story =>
      story?.interactions?.some(
        i => i. type === 'rating' && gt(i. score, min)
      )
    );
  },

  getRatingDistribution: (scope = 'all') => {
    const { stories, userId, mapInteractionsToRatings } = get();
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const s of stories || []) {
      for (const r of mapInteractionsToRatings(s)) {
        if (scope === 'user' && String(r.user) !== String(userId)) continue;
        const score = Number(r.score);
        if (counts[score] != null) counts[score] += 1;
      }
    }

    return Object.entries(counts). map(([star, count]) => ({
      star: Number(star),
      count
    }));
  },

  likeStory: async (storyId) => {
    const { userId, token } = get();
    if (!storyId || typeof storyId !== "string" || !userId || typeof userId !== "string" || !token || typeof token !== "string") {
      const errorMsg = 'Invalid storyId, userId, or token for likeStory. ';
      set({ error: errorMsg });
      return { storyId, likesCount: null, likedByUser: null, error: errorMsg };
    }
    try {
      const res = await fetchProtected(`/api/blog/story/${storyId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId }),
      });
      if (! res || typeof res !== 'object') throw new Error('No response from likeStory.');
      set((state) => ({
        currentStory: state.currentStory && state.currentStory._id === storyId ?  {
          ...state. currentStory,
          likesCount: res.likesCount ??  state.currentStory. likesCount,
          likedByUser: res.likedByUser ?? state. currentStory.likedByUser
        } : state. currentStory
      }));
      return {
        storyId: res.storyId ??  storyId,
        likesCount: res.likesCount ?? 0,
        likedByUser: res.likedByUser ?? false
      };
    } catch (err) {
      set({ error: err.message });
      return { storyId, likesCount: null, likedByUser: null, error: err.message };
    }
  },
}));