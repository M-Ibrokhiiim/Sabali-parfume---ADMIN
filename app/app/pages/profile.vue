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
      class="border p-6 flex items-center gap-4 md:gap-6 transition-all duration-500"
      :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/10'"
    >
      <!-- Monochrome Branding Avatar -->
      <div 
        class="w-16 h-16 md:w-20 md:h-20 border flex items-center justify-center font-black text-xl tracking-[0.1em] transition-all duration-500"
        :class="store.isDarkMode.value ? 'border-white/20 bg-black text-white' : 'border-black/20 bg-zinc-100 text-black'"
      >
        SB
      </div>
      <div class="space-y-1 flex-1 min-w-0">
        <p class="text-[9px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('authorizedAccount') }}</p>
        <h3 class="text-base uppercase tracking-[0.15em] font-extrabold truncate" :class="store.isDarkMode.value ? 'text-white' : 'text-black'">SABALI SELLER</h3>
        <p class="text-xs font-light truncate" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">admin@sabali-parfums.com</p>
      </div>
      <span 
        class="text-[9px] uppercase tracking-[0.2em] font-black border px-3 py-1 self-start transition-all duration-500"
        :class="store.isDarkMode.value ? 'border-white bg-white text-black' : 'border-black bg-black text-white'"
      >
        {{ store.t('owner') }}
      </span>
    </div>

    <!-- STATISTICS GRID -->
    <div class="grid grid-cols-2 gap-4">
      
      <!-- Total Products -->
      <div 
        class="border p-5 space-y-2 transition-all duration-500"
        :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'"
      >
        <span class="text-[9px] uppercase tracking-[0.2em] font-bold block" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('totalStyles') }}</span>
        <p class="text-3xl font-black tracking-tight">{{ productsCount }}</p>
        <span class="text-[8px] uppercase tracking-[0.15em] block" :class="store.isDarkMode.value ? 'text-white/20' : 'text-black/20'">{{ store.t('activePerfumes') }}</span>
      </div>

      <!-- Total Stock Units -->
      <div 
        class="border p-5 space-y-2 transition-all duration-500"
        :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'"
      >
        <span class="text-[9px] uppercase tracking-[0.2em] font-bold block" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('stockUnits') }}</span>
        <p class="text-3xl font-black tracking-tight">{{ totalStock }}</p>
        <span class="text-[8px] uppercase tracking-[0.15em] block" :class="store.isDarkMode.value ? 'text-white/20' : 'text-black/20'">{{ store.t('availableWarehouse') }}</span>
      </div>

      <!-- Out of Stock Warnings -->
      <div 
        class="border p-5 space-y-2 transition-all duration-500"
        :class="[
          store.isDarkMode.value 
            ? 'bg-zinc-950 border-white/10 text-white' 
            : 'bg-white border-black/10 text-black',
          outOfStockCount > 0 ? (store.isDarkMode.value ? 'border-amber-600/30' : 'border-amber-500/40 bg-amber-50/20') : ''
        ]"
      >
        <span class="text-[9px] uppercase tracking-[0.2em] font-bold block" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('depletedStock') }}</span>
        <p class="text-3xl font-black tracking-tight" :class="outOfStockCount > 0 ? 'text-amber-500' : (store.isDarkMode.value ? 'text-white' : 'text-black')">
          {{ outOfStockCount }}
        </p>
        <span class="text-[8px] uppercase tracking-[0.15em] block" :class="store.isDarkMode.value ? 'text-white/20' : 'text-black/20'">{{ store.t('zeroStock') }}</span>
      </div>

      <!-- Est Revenue -->
      <div 
        class="border p-5 space-y-2 transition-all duration-500"
        :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'"
      >
        <span class="text-[9px] uppercase tracking-[0.2em] font-bold block" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('estRevenue') }}</span>
        <p class="text-3xl font-black tracking-tight text-green-500">${{ estimatedRevenue }}</p>
        <span class="text-[8px] uppercase tracking-[0.15em] block" :class="store.isDarkMode.value ? 'text-white/20' : 'text-black/20'">{{ store.t('basedOnSales') }}</span>
      </div>

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

        <!-- Unisex Bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-[10px] uppercase tracking-[0.15em]" :class="store.isDarkMode.value ? 'text-white/70' : 'text-black/70'">
            <span>{{ store.t('unisexPerfumes') }}</span>
            <span class="font-bold">{{ unisexPercentage }}% ({{ categoryCounts.Unisex }} {{ store.t('styles') }})</span>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden transition-colors duration-500" :class="store.isDarkMode.value ? 'bg-zinc-900' : 'bg-zinc-200'">
            <div class="h-full transition-all duration-700" :class="store.isDarkMode.value ? 'bg-white' : 'bg-black'" :style="{ width: `${unisexPercentage}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- BACKEND INTEGRATION / API CONFIGURATION CARD -->
    <div 
      class="border p-6 space-y-5 transition-all duration-500"
      :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'"
    >
      <div class="border-b pb-3 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/5' : 'border-black/5'">
        <h4 class="text-xs uppercase tracking-[0.2em] font-extrabold">{{ store.t('backendConnection') }}</h4>
      </div>

      <div class="space-y-4">
        <p class="text-xs leading-relaxed font-light" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">
          {{ store.t('backendDesc') }}
        </p>

        <!-- API Url form -->
        <div class="space-y-2">
          <label class="block text-[9px] uppercase tracking-[0.2em] font-bold" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('backendUrl') }}</label>
          <div class="flex gap-2">
            <input 
              v-model="apiUrlInput"
              type="url" 
              placeholder="http://localhost:3000"
              class="flex-1 border px-4 py-3 text-xs tracking-wide focus:outline-none transition-all duration-500 rounded-none"
              :class="store.isDarkMode.value 
                ? 'bg-black border-white/10 text-white focus:border-white' 
                : 'bg-zinc-50 border-black/10 text-black focus:border-black'"
            />
            <button 
              @click="saveApiUrl"
              class="px-5 text-xs font-black uppercase tracking-[0.15em] border transition-all duration-300 rounded-none"
              :class="store.isDarkMode.value 
                ? 'bg-white text-black border-white hover:bg-black hover:text-white' 
                : 'bg-black text-white border-black hover:bg-white hover:text-black'"
            >
              {{ store.t('connect') }}
            </button>
          </div>
        </div>

        <!-- Connection Indicators -->
        <div class="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] border-t pt-4 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/5' : 'border-black/5'">
          <span :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('targetEndpoint') }}</span>
          <span class="font-bold select-all" :class="store.isDarkMode.value ? 'text-white/80' : 'text-black/80'">{{ store.apiBaseUrl.value }}</span>
        </div>

        <div class="flex items-center justify-between text-[10px] uppercase tracking-[0.15em]">
          <span :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('syncProtocol') }}</span>
          <span class="text-green-500 font-bold flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
            {{ store.t('activeHybrid') }}
          </span>
        </div>
      </div>
    </div>

    <!-- SYSTEM CACHE / UTILITY ACTIONS -->
    <div 
      class="border p-5 flex items-center justify-between transition-all duration-500"
      :class="store.isDarkMode.value 
        ? 'border-red-950 bg-red-950/5 text-white' 
        : 'border-red-100 bg-red-50/30 text-black'"
    >
      <div class="space-y-0.5">
        <h5 class="text-[10px] uppercase tracking-[0.15em] font-bold text-red-500">{{ store.t('dbCacheReset') }}</h5>
        <p class="text-[9px] font-light uppercase tracking-wide" :class="store.isDarkMode.value ? 'text-red-500/60' : 'text-red-500/80'">{{ store.t('dbCacheDesc') }}</p>
      </div>
      <button 
        @click="resetStoreToDefault"
        class="px-4 py-2 border bg-black text-red-500 hover:text-white transition-all duration-300 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold"
        :class="store.isDarkMode.value 
          ? 'border-red-900/50 hover:bg-red-950/20 hover:border-red-500' 
          : 'border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-500'"
      >
        {{ store.t('wipeCache') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '~/composables/useStore'

const store = useStore()
const { products, updateApiBaseUrl } = store

const apiUrlInput = ref('')

onMounted(() => {
  apiUrlInput.value = store.apiBaseUrl.value
})

// Calculations
const productsCount = computed(() => products.value.length)

const totalStock = computed(() => {
  return products.value.reduce((acc, p) => acc + (p.stock || 0), 0)
})

const outOfStockCount = computed(() => {
  return products.value.filter(p => (p.stock || 0) === 0).length
})

const estimatedRevenue = computed(() => {
  return products.value.reduce((acc, p) => acc + ((p.sales || 0) * (p.price || 0)), 0)
})

// Category distribution
const categoryCounts = computed(() => {
  const counts = { Men: 0, Women: 0, Unisex: 0 }
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

const unisexPercentage = computed(() => {
  if (productsCount.value === 0) return 0
  return Math.round((categoryCounts.value.Unisex / productsCount.value) * 100)
})

// Save API url
const saveApiUrl = () => {
  let url = apiUrlInput.value.trim()
  if (!url) {
    url = 'http://localhost:3000'
  }
  // Trim trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  updateApiBaseUrl(url)
  store.fetchProducts()
}

// Reset store
const resetStoreToDefault = () => {
  if (confirm(store.t('confirmWipe'))) {
    localStorage.removeItem('sabali_products')
    store.initStore()
    window.location.reload()
  }
}
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
