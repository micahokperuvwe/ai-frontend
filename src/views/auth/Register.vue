<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="p-8 bg-white shadow-md rounded-md">
      <h1 class="text-2xl font-bold mb-4">Register</h1>
      <form @submit.prevent="handleRegister">
        <input v-model="name" type="text" placeholder="Name" class="block w-full p-2 mb-2 border rounded" required />
        <input v-model="email" type="email" placeholder="Email" class="block w-full p-2 mb-2 border rounded" required />
        <input v-model="password" type="password" placeholder="Password" class="block w-full p-2 mb-2 border rounded" required />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" class="block w-full p-2 mb-4 border rounded" required />
        <button type="submit" class="w-full bg-green-600 text-white p-2 rounded mb-2">Register</button>
      </form>
      <div class="flex flex-col gap-2 mt-2">
        <button class="w-full bg-red-600 text-white p-2 rounded flex items-center justify-center gap-2"><span>Continue with Google</span></button>
        <button class="w-full bg-gray-800 text-white p-2 rounded flex items-center justify-center gap-2"><span>Continue with GitHub</span></button>
      </div>
      <p class="mt-4 text-sm">
        Already have an account? <router-link to="/login" class="text-blue-500">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const auth = useAuthStore();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match');
    return;
  }
  if (!name.value.trim()) {
    alert('Name is required');
    return;
  }
  const success = await auth.register(name.value, email.value, password.value);
  if (success) {
    alert('Registration successful! Please login.');
    router.push('/login');
  } else {
    alert(auth.error);
  }
};
</script>
