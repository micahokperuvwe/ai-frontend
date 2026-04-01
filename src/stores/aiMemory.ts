import { defineStore } from 'pinia';
import axios from 'axios';

export const useAIMemoryStore = defineStore('aiMemory', {
  state: () => ({
    notes: '',
    flashcards: [],
    quiz: [],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchNotes(topic: string) {
      this.loading = true;
      this.error = null;
      try {
        const authToken = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/ai/generate',
          { topic, type: 'notes' },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        this.notes = response.data.content;
      } catch (err: any) {
        this.error = err.response?.data?.msg || 'Failed to fetch notes';
      } finally {
        this.loading = false;
      }
    },
    async fetchFlashcards(topic: string) {
      this.loading = true;
      this.error = null;
      try {
        const authToken = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/ai/generate',
          { topic, type: 'flashcards' },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        // Try to parse JSON, fallback to string
        try {
          this.flashcards = JSON.parse(response.data.content);
        } catch {
          this.flashcards = response.data.content;
        }
      } catch (err: any) {
        this.error = err.response?.data?.msg || 'Failed to fetch flashcards';
      } finally {
        this.loading = false;
      }
    },
    async fetchQuiz(topic: string) {
      this.loading = true;
      this.error = null;
      try {
        const authToken = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/ai/generate',
          { topic, type: 'quiz' },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        // Try to parse JSON, fallback to string
        try {
          this.quiz = JSON.parse(response.data.content);
        } catch {
          this.quiz = response.data.content;
        }
      } catch (err: any) {
        this.error = err.response?.data?.msg || 'Failed to fetch quiz';
      } finally {
        this.loading = false;
      }
    }
  }
});
