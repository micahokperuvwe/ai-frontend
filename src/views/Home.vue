<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white selection:bg-purple-500 selection:text-white">
    <!-- Navbar -->
    <nav class="container mx-auto px-6 py-6 flex justify-between items-center">
      <div class="text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        NodemonAI
      </div>
      <div class="space-x-6">
        <router-link to="/login" class="text-gray-300 hover:text-white transition font-medium">Login</router-link>
        <router-link to="/register" class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold shadow-lg hover:shadow-cyan-500/50 transition transform hover:-translate-y-1">
          Get Started
        </router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="container mx-auto px-6 pt-20 pb-32 text-center">
      <h1 class="text-5xl md:text-7xl font-bold mb-8 leading-tight">
        Master Any Subject with <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI-Powered Learning</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
        Generate notes, quizzes, and flashcards instantly. Your personal AI tutor that tracks your progress and adapts to your style.
      </p>
      <div class="flex justify-center gap-4">
        <router-link to="/register" class="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full shadow-xl hover:bg-gray-100 transition transform hover:scale-105">
          Start for Free
        </router-link>
        <router-link to="/pricing" class="px-8 py-4 border border-gray-600 rounded-full font-bold hover:bg-white/10 transition">
          View Plans
        </router-link>
      </div>
    </header>

    <!-- Features Grid -->
    <section class="container mx-auto px-6 py-20">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition group">
          <div class="text-4xl mb-4 group-hover:scale-110 transition duration-300">📝</div>
          <h3 class="text-xl font-bold mb-2">Smart Notes</h3>
          <p class="text-gray-400">Turn messy thoughts into structured, easy-to-read study guides in seconds.</p>
        </div>
        <div class="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition group">
          <div class="text-4xl mb-4 group-hover:scale-110 transition duration-300">🧠</div>
          <h3 class="text-xl font-bold mb-2">AI Memory</h3>
          <p class="text-gray-400">Our system remembers your questions and gets smarter the more you use it.</p>
        </div>
        <div class="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition group">
          <div class="text-4xl mb-4 group-hover:scale-110 transition duration-300">⚡</div>
          <h3 class="text-xl font-bold mb-2">Instant Quizzes</h3>
          <p class="text-gray-400">Test your knowledge immediately with auto-generated quizzes from your material.</p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="container mx-auto px-6 py-24 text-center">
      <div class="p-12 rounded-3xl bg-gradient-to-r from-indigo-800 to-purple-800 shadow-2xl">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your brain?</h2>
        <p class="text-indigo-200 mb-8 max-w-xl mx-auto">Join thousands of students who are learning faster and smarter with NodemonAI.</p>
        <router-link to="/register" class="inline-block px-10 py-5 bg-white text-indigo-900 font-bold rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          Create Free Account
        </router-link>
      </div>
    </section>

    <footer class="border-t border-white/10 bg-black/20 py-8 text-center text-gray-500 text-sm">
      &copy; 2025 NodemonAI. Built with Vue 3 & Tailwind.
    </footer>
  </div>
</template>

<script setup lang="ts">
// Simple landing page, no logic needed yet
</script>
