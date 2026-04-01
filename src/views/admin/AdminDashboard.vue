<template>
  <div class="p-8 bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    <!-- Stats Section -->
    <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
        <h3 class="text-gray-500 font-bold">Total Users</h3>
        <p class="text-3xl font-bold">{{ admin.stats.users }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
        <h3 class="text-gray-500 font-bold">AI Memories</h3>
        <p class="text-3xl font-bold">{{ admin.stats.memories }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
        <h3 class="text-gray-500 font-bold">Agent Logs</h3>
        <p class="text-3xl font-bold">{{ admin.stats.agentLogs }}</p>
      </div>
    </div>

    <!-- AI Training Section -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Train AI Memory</h2>
      <form @submit.prevent="trainAI" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Prompt / Keyword (Regex supported)</label>
          <input v-model="prompt" type="text" class="w-full border p-2 rounded focus:ring focus:ring-blue-200" placeholder="e.g. ^hello$" required />
        </div>
        <div>
          <label class="block text-sm font-medium">Desired Response</label>
          <textarea v-model="response" class="w-full border p-2 rounded focus:ring focus:ring-blue-200 h-32" placeholder="The AI should answer..." required></textarea>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">Add to Memory</button>
      </form>
    </div>

    <!-- Bulk Import Section -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Bulk Import from Text</h2>
      <p class="text-sm text-gray-500 mb-2">Paste course material, articles, or notes here. The AI will extract Q&A pairs automatically.</p>
      <form @submit.prevent="bulkImport" class="space-y-4">
        <div>
           <textarea v-model="bulkText" class="w-full border p-2 rounded focus:ring focus:ring-green-200 h-32" placeholder="Paste large text here..." required></textarea>
        </div>
        <button type="submit" :disabled="importing" class="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition disabled:opacity-50">
            {{ importing ? 'Analyzing & Importing...' : 'Auto-Generate Memories' }}
        </button>
      </form>
    </div>

    <!-- Memory List Section -->
    <div class="bg-white p-6 rounded-lg shadow flex flex-col h-[500px]">
      <h2 class="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Existing Memories</h2>
      <div class="flex-1 overflow-y-auto space-y-3">
        <div v-for="mem in admin.memories" :key="mem._id" class="p-3 border rounded bg-gray-50 group hover:bg-gray-100 transition">
          <div class="flex justify-between items-start">
            <div class="font-mono text-sm text-blue-600 font-bold">{{ mem.prompt }}</div>
            <button @click="deleteMem(mem._id)" class="text-red-400 hover:text-red-600">×</button>
          </div>
          <div class="text-sm text-gray-600 mt-1 line-clamp-2 group-hover:line-clamp-none">{{ mem.response }}</div>
        </div>
        <div v-if="admin.memories.length === 0" class="text-gray-400 text-center py-8">No memories trained yet.</div>
      </div>
    </div>

    <!-- Users List Section -->
    <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Recent Users</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100 font-bold text-gray-600 uppercase text-sm">
              <th class="p-3">Email</th>
              <th class="p-3">Plan</th>
              <th class="p-3">API Uses</th>
              <th class="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in admin.users" :key="user._id" class="border-b hover:bg-gray-50">
              <td class="p-3">{{ user.email }}</td>
              <td class="p-3">
                <span :class="{'bg-yellow-100 text-yellow-800': user.plan==='premium', 'bg-blue-100 text-blue-800': user.plan!=='premium'}" class="px-2 py-1 rounded text-xs font-bold uppercase">
                    {{ user.plan }}
                </span>
              </td>
              <td class="p-3 font-mono">{{ user.apiKeyUses === -1 ? '∞' : user.apiUsage + ' / ' + user.apiKeyUses }}</td>
              <td class="p-3">{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../../stores/admin';

const admin = useAdminStore();
const prompt = ref('');
const response = ref('');
const bulkText = ref('');
const importCount = ref(10);
const importing = ref(false);

const trainAI = async () => {
    try {
        const success = await admin.addMemory(prompt.value, response.value);
        if (success) {
            prompt.value = '';
            response.value = '';
            alert('Memory Added');
            admin.fetchStats(); // Update stats
        } else {
            alert('Failed to add memory: ' + (admin.error || 'Unknown error'));
        }
    } catch (e: any) {
        alert('System Error: ' + e.message);
        console.error(e);
    }
};

const bulkImport = async () => {
    if (!bulkText.value) return;
    importing.value = true;
    try {
        const result = await admin.autoImportMemory(bulkText.value, importCount.value);
        if (result) {
            alert(result);
            bulkText.value = '';
            admin.fetchStats();
        } else {
            alert('Import failed: ' + (admin.error || 'Unknown error'));
        }
    } catch (e: any) {
        alert('System Error: ' + e.message);
        console.error(e);
    } finally {
        importing.value = false;
    }
};

const deleteMem = async (id: string) => {
    if (confirm('Delete this memory?')) {
        await admin.deleteMemory(id);
        admin.fetchStats();
    }
};

onMounted(() => {
    admin.fetchStats();
    admin.fetchUsers();
    admin.fetchMemories();
});
</script>
