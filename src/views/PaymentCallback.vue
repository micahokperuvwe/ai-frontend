<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <h1 class="text-2xl font-bold mb-4">Processing Payment...</h1>
    <p v-if="status">{{ status }}</p>
    <router-link v-if="done" to="/user/dashboard" class="mt-4 text-blue-500 underline">Return to Dashboard</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import axios from 'axios'; 

// In a real app, we might call backend to verify reference: GET /api/payment/verify?reference=...
// But relying on Webhook is safer for state update. 
// Here we just accept the user back.

const route = useRoute();
const status = ref('Verifying...');
const done = ref(false);

onMounted(() => {
    const reference = route.query.reference;
    if (reference) {
        status.value = 'Payment Successful! Your plan will be updated shortly.';
        // Optionally call backend to force a check if webhook is slow
    } else {
        status.value = 'No reference found.';
    }
    done.value = true;
});
</script>
