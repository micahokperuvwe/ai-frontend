<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
    
    <div class="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-100 font-bold text-gray-600 uppercase text-sm">
            <th class="p-3">Email</th>
            <th class="p-3">Role</th>
            <th class="p-3">Plan</th>
            <th class="p-3">Premium Expiry</th>
            <th class="p-3">Days Remaining</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in admin.users" :key="user._id" class="border-b hover:bg-gray-50">
            <td class="p-3 font-medium">{{ user.email }}</td>
            <td class="p-3">
                <span :class="{'bg-purple-100 text-purple-800': user.role==='admin', 'bg-gray-100 text-gray-800': user.role!=='admin'}" class="px-2 py-1 rounded text-xs font-bold uppercase">
                    {{ user.role }}
                </span>
            </td>
            <td class="p-3">
              <span :class="{'bg-yellow-100 text-yellow-800': user.plan==='premium', 'bg-blue-100 text-blue-800': user.plan!=='premium'}" class="px-2 py-1 rounded text-xs font-bold uppercase">
                  {{ user.plan }}
              </span>
            </td>
            <td class="p-3 text-gray-600">
                {{ formatDate(user.planExpiry) }}
            </td>
            <td class="p-3">
                <span v-if="user.plan === 'premium' && user.planExpiry" :class="getDaysRemaining(user.planExpiry) < 5 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'">
                    {{ getDaysRemaining(user.planExpiry) }} Days
                </span>
                <span v-else class="text-gray-400">-</span>
            </td>
            <td class="p-3">
                <div v-if="user.plan === 'premium'" class="flex gap-2">
                    <input type="date" :value="formatDateInput(user.planExpiry)" @change="updateExpiry(user._id, ($event.target as HTMLInputElement).value)" class="border rounded p-1 text-sm" />
                </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '../../stores/admin';

const admin = useAdminStore();

const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
};

const formatDateInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
}

const updateExpiry = async (id: string, date: string) => {
    if (!date) return;
    if (confirm('Update expiry date?')) {
        await admin.updateUserExpiry(id, date);
    }
};

const getDaysRemaining = (dateString?: string) => {
    if (!dateString) return 0;
    const expiry = new Date(dateString);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
};

onMounted(() => {
    admin.fetchUsers();
});
</script>
