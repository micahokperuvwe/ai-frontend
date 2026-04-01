import { defineStore } from 'pinia';
import axios from 'axios';

export const useAIMemoryListStore = defineStore('aiMemoryList', {
  state: () => ({
    memories: [],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchMemories() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/ai/memories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.memories = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.msg || 'Failed to fetch AI memory';
      } finally {
        this.loading = false;
      }
    }
  }
});
