<template>
  <div class="min-h-screen flex flex-col font-sans">
    <header class="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      <div class="text-xl font-bold tracking-wide">AI Learning Platform</div>
      <nav class="space-x-4">
        <router-link to="/user/agent" class="hover:text-blue-200 transition">agent</router-link>
        <router-link to="/user/chat" class="hover:text-blue-200 transition">chat</router-link>
        <router-link to="/user/dashboard" class="hover:text-blue-200 transition">Dashboard</router-link>
        <a href="#" class="hover:text-blue-200 transition">Logout</a>
      </nav>
    </header>
    <main class="flex-grow bg-blue-50">
      <router-view />
    </main>
    <footer class="bg-blue-800 text-white p-2 text-center text-sm">
      &copy; 2025 AI Learning
    </footer>
  </div>
</template>
