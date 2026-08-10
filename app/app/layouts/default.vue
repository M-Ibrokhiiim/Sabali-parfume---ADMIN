<template>
  <div 
    class="min-h-screen flex flex-col font-sans select-none pb-24 md:pb-28 transition-colors duration-500"
    :class="store.isDarkMode.value ? 'bg-black text-white' : 'bg-zinc-50 text-black'"
  >
    <!-- Header -->
    <header 
      class="border-b sticky top-0 z-50 py-5 px-6 backdrop-blur-md transition-all duration-500"
      :class="store.isDarkMode.value ? 'border-white/10 bg-black/80' : 'border-black/10 bg-white/80'"
    >
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <h1 
          class="logo text-2xl tracking-[8px] font-black uppercase transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
        >
          SABALI
        </h1>
        
        <div class="flex items-center gap-4">
          <!-- Brutalist Theme Toggle Button -->
          <button 
            @click="store.toggleTheme" 
            class="border p-2.5 flex items-center justify-center transition-all duration-300 rounded-full"
            :class="store.isDarkMode.value 
              ? 'border-white/20 text-white hover:text-black hover:bg-white hover:border-white' 
              : 'border-black/20 text-black hover:text-white hover:bg-black hover:border-black'"
            :title="store.isDarkMode.value ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <!-- Sun Icon (shown in dark mode to switch to light) -->
            <svg v-if="store.isDarkMode.value" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
            <!-- Moon Icon (shown in light mode to switch to dark) -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          </button>

          <!-- Status Indicator -->
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span 
              class="text-[9px] uppercase tracking-[0.2em] font-bold transition-colors duration-500"
              :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'"
            >
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Bottom Navigation Bar (Fixed at the bottom of the screen) -->
    <nav 
      class="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl py-3 px-6 pb-5 md:pb-5 transition-all duration-500"
      :class="store.isDarkMode.value ? 'bg-black/90 border-white/10' : 'bg-white/90 border-black/10'"
    >
      <div class="max-w-md mx-auto flex items-center justify-around relative">
        
        <!-- Products Tab -->
        <NuxtLink 
          to="/" 
          class="flex flex-col items-center justify-center gap-1 group py-1 text-center flex-1 transition-all duration-300"
          :class="[
            route.path === '/' 
              ? (store.isDarkMode.value ? 'text-white scale-105' : 'text-black scale-105') 
              : (store.isDarkMode.value ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70')
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 transition-transform duration-300 group-hover:scale-110">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18m-18 0-1.25-6.25a2.25 2.25 0 0 1 2.25-2.25h12.5a2.25 2.25 0 0 1 2.25 2.25l-1.25 6.25m-18 0v6.75A2.25 2.25 0 0 0 4.5 21.75h15a2.25 2.25 0 0 0 2.25-2.25v-6.75" />
          </svg>
          <span class="text-[9px] uppercase tracking-[0.2em] font-semibold transition-all">Products</span>
          <div 
            class="h-[3px] rounded-full transition-all duration-500 absolute bottom-[-8px] w-6" 
            :class="[
              route.path === '/' ? 'opacity-100' : 'opacity-0 scale-x-0',
              store.isDarkMode.value ? 'bg-white' : 'bg-black'
            ]"
          ></div>
        </NuxtLink>

        <!-- Add Product Tab (Floating Centerpiece) -->
        <NuxtLink 
          to="/add" 
          class="flex flex-col items-center justify-center text-center flex-1 transition-all duration-300 relative"
        >
          <div 
            class="flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300 -translate-y-4 shadow-2xl"
            :class="[
              route.path === '/add'
                ? (store.isDarkMode.value ? 'border-white bg-white text-black scale-110' : 'border-black bg-black text-white scale-110')
                : (store.isDarkMode.value ? 'border-white/10 text-white/70 hover:border-white/40 bg-zinc-950' : 'border-black/15 text-black/70 hover:border-black/40 bg-white')
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span 
            class="text-[9px] uppercase tracking-[0.2em] font-semibold -mt-2 transition-colors"
            :class="[
              route.path === '/add'
                ? (store.isDarkMode.value ? 'text-white font-bold' : 'text-black font-bold')
                : (store.isDarkMode.value ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70')
            ]"
          >
            New
          </span>
        </NuxtLink>

        <!-- Profile Tab -->
        <NuxtLink 
          to="/profile" 
          class="flex flex-col items-center justify-center gap-1 group py-1 text-center flex-1 transition-all duration-300"
          :class="[
            route.path === '/profile' 
              ? (store.isDarkMode.value ? 'text-white scale-105' : 'text-black scale-105') 
              : (store.isDarkMode.value ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70')
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 transition-transform duration-300 group-hover:scale-110">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span class="text-[9px] uppercase tracking-[0.2em] font-semibold">Profile</span>
          <div 
            class="h-[3px] rounded-full transition-all duration-500 absolute bottom-[-8px] w-6" 
            :class="[
              route.path === '/profile' ? 'opacity-100' : 'opacity-0 scale-x-0',
              store.isDarkMode.value ? 'bg-white' : 'bg-black'
            ]"
          ></div>
        </NuxtLink>

      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useStore } from '~/composables/useStore'

const route = useRoute()
const store = useStore()

onMounted(() => {
  store.initStore()
  store.fetchProducts()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

.logo {
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 0.35em;
}

body {
  background-color: black;
  color: white;
  font-family: 'Space Grotesk', sans-serif;
}
</style>
