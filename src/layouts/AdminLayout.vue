<template>
  <div class="min-h-screen flex font-sans bg-gray-100">
    <aside class="w-64 bg-slate-900 text-white p-6 flex flex-col shadow-xl">
      <div class="text-2xl font-bold mb-8 text-center text-red-500">Admin Panel</div>
      <nav class="flex-1 space-y-2">
        <router-link to="/admin/dashboard" class="block py-2 px-4 rounded hover:bg-slate-800 transition">Dashboard</router-link>
        <router-link to="/admin/users" class="block py-2 px-4 rounded hover:bg-slate-800 transition">Users</router-link>
        <a href="#" class="block py-2 px-4 rounded hover:bg-slate-800 transition">AI Memory</a>
      </nav>
      <div class="mt-auto">
        <a href="#" class="block py-2 px-4 rounded bg-red-700 hover:bg-red-600 text-center transition">Logout</a>
      </div>
    </aside>
    <main class="flex-1 p-6 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
