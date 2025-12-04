import { create } from 'zustand';
import { API_URL } from '../constants/api';

console.log('API_URL is', API_URL);

export const useNumberStore = create((set, get) => ({
  numbers: [],
  allGroups: [],
  fetchedGroups: [],
  loading: false,
  error: null,

  // Fetch by group batches
  fetchGroups: async (groups) => {
    set({ loading: true, error: null });
    try {
      const groupQuery = groups.map(encodeURIComponent).join(',');
      const url = `${API_URL}/api/number?groups=${groupQuery}`;
      console.log('Fetching groups:', groups, 'from', url);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      console.log('Fetched data for groups', groups, ':', data.data); // <-- LOG
      set({
        numbers: [
          ...get().numbers,
          ...data.data.filter(
            n => !get().numbers.some(
              existing => existing.value === n.value && existing.group === n.group
            )
          )
        ],
        fetchedGroups: [...get().fetchedGroups, ...groups],
        loading: false,
      });
    } catch (err) {
      console.error('fetchGroups failed:', err.message);
      set({ error: err.message, loading: false });
    }
  },

  // Fetch all groups
  fetchAllGroups: async () => {
    set({ loading: true, error: null });
    try {
      const url = `${API_URL}/api/number/groups`;
      console.log('Fetching groups from', url);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const groups = await res.json();
      set({ allGroups: groups, loading: false });
      console.log('Groups:', groups);
    } catch (err) {
      console.error('fetchAllGroups failed:', err.message);
      set({ error: err.message, loading: false });
    }
  },

  // Add a new number-word pair
  addNumber: async ({ value, word, group }) => {
    set({ loading: true, error: null });
    try {
      console.log('Adding number:', { value, word, group });
      const url = `${API_URL}/api/number/motango`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, word, group })
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const saved = await res.json();
      set({ numbers: [...get().numbers, saved], loading: false });
      console.log('Added number:', saved);
    } catch (err) {
      console.error('addNumber failed:', err.message);
      set({ error: err.message, loading: false });
    }
  },

  // Seed the database (call once)
  seedNumbers: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Seeding numbers');
      const url = `${API_URL}/api/number/seed`;
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const summary = await res.json();
      console.log('Seed summary:', summary);
      set({ loading: false });
      return summary;
    } catch (err) {
      console.error('seedNumbers failed:', err.message);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // Get a number by value
  fetchByValue: async (value) => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching by value:', value);
      const url = `${API_URL}/api/number/${value}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const item = await res.json();
      set({ loading: false });
      console.log('Fetched item:', item);
      return item;
    } catch (err) {
      console.error('fetchByValue failed:', err.message);
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // Reset store
  reset: () => {
    console.log('Resetting store');
    set({
      numbers: [],
      fetchedGroups: [],
      error: null
    });
  }
}));