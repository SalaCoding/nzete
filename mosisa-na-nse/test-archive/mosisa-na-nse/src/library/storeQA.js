import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';

// Generate or get device ID
const getOdioId = async () => {
  try {
    let odioId = await AsyncStorage.getItem('odioId');
    if (!odioId) {
      odioId = 'odio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      await AsyncStorage. setItem('odioId', odioId);
    }
    return odioId;
  } catch (_error) {
    return 'odio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
};

export const useQAStore = create((set, get) => ({
  qas: [],
  currentQA: null,
  categories: [],
  stats: null,
  isLoading: false,
  error: null,
  
  // Quiz state
  quizScore: 0,
  quizTotal: 0,
  answeredIds: [],
  
  // Score state
  scores: [],
  bestScore: null,
  lastScore: null,

  // Fetch all Q&As
  fetchQAs: async (page = 1, limit = 20, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit), 
        ... filters 
      });
      const response = await fetch(`${API_URL}/api/qa/qas?${params}`);
      const data = await response.json();

      if (! response.ok) throw new Error(data. error || 'Failed to fetch Q&As');

      set({ qas: data. qas || [], isLoading: false });
      return data;
    } catch (err) {
      console.error('[fetchQAs] error:', err. message);
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  // Fetch random Q&A
  fetchRandomQA: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { answeredIds } = get();
      const params = new URLSearchParams({
        ... filters,
        exclude: answeredIds.join(','),
      });

      const response = await fetch(`${API_URL}/api/qa/qa/random?${params}`);
      const data = await response.json();

      if (! response.ok) {
        if (data.noMore) {
          set({ currentQA: null, isLoading: false });
          return { success: false, noMore: true };
        }
        throw new Error(data. error || 'Failed to fetch random Q&A');
      }

      set({ currentQA: data, isLoading: false });
      return { success: true, qa: data };
    } catch (err) {
      console. error('[fetchRandomQA] error:', err.message);
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  // Check answer
  checkAnswer: async (qaId, userAnswer) => {
    try {
      const response = await fetch(`${API_URL}/api/qa/qa/${qaId}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAnswer }),
      });

      const data = await response.json();

      if (! response.ok) throw new Error(data. error || 'Failed to check answer');

      set(state => ({
        quizTotal: state.quizTotal + 1,
        quizScore: data.isCorrect ? state.quizScore + 1 : state.quizScore,
        answeredIds: [...state.answeredIds, qaId],
      }));

      return data;
    } catch (err) {
      console.error('[checkAnswer] error:', err.message);
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  // Save score to database
  saveScore: async (correctCount, wrongCount, totalQuestions, category = 'all') => {
    try {
      const odioId = await getOdioId();
      const percentage = totalQuestions > 0 
        ? Math.round((correctCount / totalQuestions) * 100) 
        : 0;

      const response = await fetch(`${API_URL}/api/qa/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          odioId,
          correctCount,
          wrongCount,
          totalQuestions,
          percentage,
          category,
        }),
      });

      const data = await response. json();

      if (!response.ok) throw new Error(data.error || 'Failed to save score');

      // Update lastScore immediately
      set({ lastScore: data. score });

      return { success: true, score: data.score };
    } catch (err) {
      console.error('[saveScore] error:', err.message);
      return { success: false, error: err.message };
    }
  },

  // Fetch scores from database (most recent first)
  fetchScores: async (limit = 10) => {
    try {
      const odioId = await getOdioId();
      const response = await fetch(`${API_URL}/api/qa/scores/${odioId}? limit=${limit}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch scores');

      const scores = data.scores || [];
      set({ 
        scores,
        lastScore: scores.length > 0 ?  scores[0] : null,
      });
      return scores;
    } catch (err) {
      console.error('[fetchScores] error:', err.message);
      return [];
    }
  },

  // Fetch best score
  fetchBestScore: async () => {
    try {
      const odioId = await getOdioId();
      const response = await fetch(`${API_URL}/api/qa/score/best/${odioId}`);
      
      const contentType = response.headers. get('content-type');
      if (!contentType || ! contentType.includes('application/json')) {
        console.error('[fetchBestScore] Response is not JSON');
        return null;
      }

      const data = await response.json();

      if (!response. ok) throw new Error(data.error || 'Failed to fetch best score');

      set({ bestScore: data.bestScore });
      return data. bestScore;
    } catch (err) {
      console. error('[fetchBestScore] error:', err.message);
      set({ bestScore: null });
      return null;
    }
  },

  // Delete all scores (reset)
  deleteAllScores: async () => {
    try {
      const odioId = await getOdioId();
      const response = await fetch(`${API_URL}/api/qa/scores/${odioId}`, {
        method: 'DELETE',
      });

      const data = await response. json();

      if (!response.ok) throw new Error(data.error || 'Failed to delete scores');

      set({ scores: [], bestScore: null, lastScore: null });
      return { success: true };
    } catch (err) {
      console.error('[deleteAllScores] error:', err.message);
      return { success: false, error: err.message };
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await fetch(`${API_URL}/api/qa/qa/categories`);
      const data = await response.json();

      if (!response. ok) throw new Error(data.error || 'Failed to fetch categories');

      set({ categories: data. categories || [] });
      return data.categories || [];
    } catch (err) {
      console.error('[fetchCategories] error:', err.message);
      set({ error: err.message });
      return [];
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const response = await fetch(`${API_URL}/api/qa/qa/stats`);
      const data = await response.json();

      if (!response. ok) throw new Error(data.error || 'Failed to fetch stats');

      set({ stats: data });
      return data;
    } catch (err) {
      console.error('[fetchStats] error:', err.message);
      set({ error: err.message });
      return null;
    }
  },

  // Reset quiz
  resetQuiz: () => {
    set({
      quizScore: 0,
      quizTotal: 0,
      answeredIds: [],
      currentQA: null,
    });
  },

  // Clear current QA
  clearCurrentQA: () => set({ currentQA: null }),
}));