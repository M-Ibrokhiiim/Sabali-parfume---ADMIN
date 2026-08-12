<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="space-y-1 border-b pb-4 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/10' : 'border-black/10'">
      <span 
        class="text-[9px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
        :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'"
      >{{ store.t('storeInsights') }}</span>
      <h2 
        class="text-xl uppercase tracking-[0.25em] font-extrabold transition-colors duration-500"
        :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
      >
        {{ store.t('profileStats') }}
      </h2>
    </div>

    <!-- Admin Profile Card -->
    <div 
      class="border p-8 flex flex-col items-center justify-center text-center gap-5 transition-all duration-500 relative"
      :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/10'"
    >
      <!-- Notification Bell -->
      <div class="absolute top-5 right-5 cursor-pointer group">
        <div class="relative">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor" 
            class="w-7 h-7 transition-transform group-hover:rotate-12 duration-300"
            :class="store.isDarkMode.value ? 'text-white/60 group-hover:text-white' : 'text-black/60 group-hover:text-black'"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span 
            class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border transition-all duration-500"
            :class="store.isDarkMode.value 
              ? 'bg-white text-black border-zinc-950' 
              : 'bg-black text-white border-white'"
          >
            1
          </span>
        </div>
      </div>

      <!-- Monochrome Branding Avatar -->
      <div 
        class="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border flex items-center justify-center transition-all duration-500"
        :class="store.isDarkMode.value ? 'border-white/20 bg-black' : 'border-black/20 bg-zinc-100'"
      >
        <img :src="store.adminPic.value || ProfilePic" class="w-full h-full object-cover" />
      </div>

      <!-- User Name -->
      <h3 
        class="text-base uppercase tracking-[0.15em] font-extrabold transition-colors duration-500" 
        :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
      >
        {{ store.adminName.value }}
      </h3>

      <!-- Additional Information -->
      <div class="space-y-1">
        <p class="text-xs font-light" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">
          admin@sabali-parfums.com
        </p>
      </div>

      <!-- Edit Button -->
      <NuxtLink 
        to="/profile-edit"
        class="px-5 py-2 text-xs font-black uppercase tracking-[0.15em] border transition-all duration-300 rounded-none inline-block mt-2"
        :class="store.isDarkMode.value 
          ? 'bg-white text-black border-white hover:bg-black hover:text-white' 
          : 'bg-black text-white border-black hover:bg-white hover:text-black'"
      >
        {{ store.t('editProfile') }}
      </NuxtLink>
    </div>

    <!-- CATEGORY DISTRIBUTION METRICS -->
    <div 
      class="border p-6 space-y-5 transition-all duration-500"
      :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'"
    >
      <div class="border-b pb-3 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/5' : 'border-black/5'">
        <h4 class="text-xs uppercase tracking-[0.2em] font-extrabold">{{ store.t('categoryDistribution') }}</h4>
      </div>

      <div class="space-y-4">
        <!-- Men Bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-[10px] uppercase tracking-[0.15em]" :class="store.isDarkMode.value ? 'text-white/70' : 'text-black/70'">
            <span>{{ store.t('menPerfumes') }}</span>
            <span class="font-bold">{{ menPercentage }}% ({{ categoryCounts.Men }} {{ store.t('styles') }})</span>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden transition-colors duration-500" :class="store.isDarkMode.value ? 'bg-zinc-900' : 'bg-zinc-200'">
            <div class="h-full transition-all duration-700" :class="store.isDarkMode.value ? 'bg-white' : 'bg-black'" :style="{ width: `${menPercentage}%` }"></div>
          </div>
        </div>

        <!-- Women Bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-[10px] uppercase tracking-[0.15em]" :class="store.isDarkMode.value ? 'text-white/70' : 'text-black/70'">
            <span>{{ store.t('womenPerfumes') }}</span>
            <span class="font-bold">{{ womenPercentage }}% ({{ categoryCounts.Women }} {{ store.t('styles') }})</span>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden transition-colors duration-500" :class="store.isDarkMode.value ? 'bg-zinc-900' : 'bg-zinc-200'">
            <div class="h-full transition-all duration-700" :class="store.isDarkMode.value ? 'bg-white' : 'bg-black'" :style="{ width: `${womenPercentage}%` }"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '~/composables/useStore'
import ProfilePic from "../assets/pic/AccountPic.png"

const store = useStore()
const { products } = store

// Calculations
const productsCount = computed(() => products.value.length)

// Category distribution
const categoryCounts = computed(() => {
  const counts = { Men: 0, Women: 0 }
  products.value.forEach(p => {
    if (counts[p.category] !== undefined) {
      counts[p.category]++
    }
  })
  return counts
})

const menPercentage = computed(() => {
  if (productsCount.value === 0) return 0
  return Math.round((categoryCounts.value.Men / productsCount.value) * 100)
})

const womenPercentage = computed(() => {
  if (productsCount.value === 0) return 0
  return Math.round((categoryCounts.value.Women / productsCount.value) * 100)
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
