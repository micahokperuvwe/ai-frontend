<template>
  <div class="p-8 bg-white min-h-screen">
    <h1 class="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Basic -->
      <div class="border p-6 rounded shadow hover:shadow-lg transition">
        <h2 class="text-xl font-bold">Basic</h2>
        <p class="text-4xl font-bold my-4">$10<span class="text-sm font-normal">/mo</span></p>
        <ul class="mb-6 space-y-2">
            <li>1,000 AI Calls</li>
            <li>Standard Support</li>
        </ul>
        <button @click="subscribe('basic', 10)" class="w-full bg-blue-600 text-white py-2 rounded">Choose Basic</button>
      </div>

      <!-- Pro -->
      <div class="border p-6 rounded shadow hover:shadow-lg transition border-blue-500">
        <h2 class="text-xl font-bold">Pro</h2>
        <p class="text-4xl font-bold my-4">$30<span class="text-sm font-normal">/mo</span></p>
        <ul class="mb-6 space-y-2">
            <li>10,000 AI Calls</li>
            <li>Priority Processing</li>
        </ul>
        <button @click="subscribe('pro', 30)" class="w-full bg-blue-600 text-white py-2 rounded">Choose Pro</button>
      </div>

      <!-- Premium -->
      <div class="border p-6 rounded shadow hover:shadow-lg transition bg-gray-900 text-white">
        <h2 class="text-xl font-bold text-yellow-500">Premium</h2>
        <p class="text-4xl font-bold my-4">$100<span class="text-sm font-normal">/mo</span></p>
        <ul class="mb-6 space-y-2">
            <li>Unlimited AI Calls</li>
            <li>Agent Mode Enabled</li>
            <li>24/7 Support</li>
        </ul>
        <button @click="subscribe('premium', 100)" class="w-full bg-yellow-500 text-black py-2 rounded font-bold">Go Premium</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

const subscribe = async (plan: string, amount: number) => {
    if (!auth.isAuthenticated) {
        alert('Please login first');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/api/payment/initialize', {
            plan,
            amount: amount, // Backend expects dollars? My controller said "amount * 100" for kobo/cents. Let's assume passed amount is in currency units.
            // My controller: amount * 100. So passing 10 -> 1000 cents. Correct.
        }, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });

        if (response.data.status) {
            // Redirect to Paystack
            window.location.href = response.data.data.authorization_url;
        } else {
            alert('Payment initialization failed');
        }
    } catch (error) {
        console.error(error);
        alert('Payment Error');
    }
};
</script>
