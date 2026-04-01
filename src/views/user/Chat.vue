<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 text-blue-800">AI Chat</h1>
    <div class="bg-white rounded shadow p-4 mb-4 min-h-[200px]">
      <div v-for="(msg, i) in messages" :key="i" class="mb-2">
        <div :class="msg.role === 'user' ? 'text-right' : 'text-left'">
          <span :class="msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" class="inline-block px-3 py-2 rounded">
            {{ msg.content }}
          </span>
        </div>
        <div v-if="msg.role === 'ai' && msg.source" class="text-xs text-gray-400 mt-1 text-left">
          Source: {{ msg.source }}
        </div>
        <div v-if="msg.role === 'ai' && msg.memories?.length" class="mt-2 text-left">
          <div class="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Memory entries used</div>
          <div class="space-y-2">
            <div v-for="memory in msg.memories" :key="memory.id" class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
              <div class="font-medium text-gray-800">{{ memory.prompt }}</div>
              <div class="mt-1 text-gray-600">{{ memory.response }}</div>
              <div class="mt-1 text-xs text-gray-400">ID: {{ memory.id }} | Type: {{ memory.type }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading" class="text-gray-400">AI is typing...</div>
    </div>
    <form @submit.prevent="sendMessage" class="flex gap-2">
      <input v-model="input" type="text" placeholder="Type your message..." class="flex-1 border p-2 rounded" required />
      <button :disabled="loading || !input" class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

type ChatMemory = {
  id: string;
  prompt: string;
  response: string;
  type: 'trained' | 'semantic';
};

type ChatMessage = {
  role: string;
  content: string;
  source?: string;
  memories?: ChatMemory[];
};

const input = ref('');
const messages = ref<ChatMessage[]>([]);
const loading = ref(false);

const sendMessage = async () => {
  if (!input.value) return;
  messages.value.push({ role: 'user', content: input.value });
  const userMessage = input.value;
  input.value = '';
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userMessage }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    messages.value.push({
      role: 'ai',
      content: res.data.response,
      source: res.data.source,
      memories: res.data.matchedMemories || []
    });
  } catch (err: any) {
    messages.value.push({ role: 'ai', content: err.response?.data?.msg || 'AI error' });
  } finally {
    loading.value = false;
  }
};
</script>
