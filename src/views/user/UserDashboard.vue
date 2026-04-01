
<template>
  <div class="p-8 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold text-blue-800 mb-4">User Dashboard</h1>
    <p class="mb-6">Your API Key and usage info:</p>
    <div class="bg-white shadow rounded p-6 mb-6">
      <div class="mb-4">
        <span class="font-bold">API Key:</span>
        <span class="font-mono select-all bg-gray-100 px-2 py-1 rounded">{{ apiKey || 'Loading...' }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">Usage Limit:</span>
        <span class="font-mono">{{ apiKeyUses === -1 ? 'Unlimited' : apiUsage + ' / ' + apiKeyUses }}</span>
      </div>
      <button @click="refreshApiKey" :disabled="loading" class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Get New API Key</button>
      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
      <div v-if="loading" class="text-gray-500 mt-2">Processing...</div>
    </div>
    <div class="text-gray-500 text-sm">Flashcards, AI Notes, and Quiz are now available in their own pages.</div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const apiKey = ref('');
const apiKeyUses = ref(0);
const apiUsage = ref(0);
const loading = ref(false);
const error = ref('');

const fetchUserInfo = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    apiKey.value = res.data.apiKey;
    apiKeyUses.value = res.data.apiKeyUses;
    apiUsage.value = res.data.apiUsage;
  } catch (err: any) {
    error.value = err.response?.data?.msg || 'Failed to fetch user info';
  } finally {
    loading.value = false;
  }
};

const refreshApiKey = async () => {
  loading.value = true;
  error.value = '';
  try {
    // Call backend endpoint to generate new API key (assume /api/auth/me with PATCH or a dedicated endpoint)
    const res = await axios.patch('http://localhost:5000/api/auth/me', {}, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    apiKey.value = res.data.apiKey;
  } catch (err: any) {
    error.value = err.response?.data?.msg || 'Failed to refresh API key';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>
