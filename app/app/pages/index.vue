<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Search & Navigation Title -->
     

    <!-- Collection Category Selector (Brutalist slider toggle) -->
    <div class="border-b pb-4 overflow-x-auto scrollbar-none transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/10' : 'border-black/10'">
      <div class="flex gap-2 min-w-max">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-bold border transition-all duration-300"
          :class="[
            activeTab === tab.value 
              ? (store.isDarkMode.value ? 'bg-white text-black border-white' : 'bg-black text-white border-black') 
              : (store.isDarkMode.value 
                  ? 'bg-zinc-950 text-white/50 border-white/10 hover:text-white hover:border-white/30' 
                  : 'bg-white text-black/50 border-black/10 hover:text-black hover:border-black/30')
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-8 h-8 border-2 rounded-full animate-spin" :class="store.isDarkMode.value ? 'border-white/15 border-t-white' : 'border-black/15 border-t-black'"></div>
      <span class="text-xs uppercase tracking-[0.2em]" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('syncingDb') }}</span>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="filteredProducts.length === 0" 
      class="border border-dashed p-12 text-center space-y-6 transition-colors duration-500"
      :class="store.isDarkMode.value ? 'border-white/10' : 'border-black/10'"
    >
      <div class="mx-auto w-12 h-12" :class="store.isDarkMode.value ? 'text-white/20' : 'text-black/20'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18m-18 0-1.25-6.25a2.25 2.25 0 0 1 2.25-2.25h12.5a2.25 2.25 0 0 1 2.25 2.25l-1.25 6.25m-18 0v6.75A2.25 2.25 0 0 0 4.5 21.75h15a2.25 2.25 0 0 0 2.25-2.25v-6.75" />
        </svg>
      </div>
      <div class="space-y-1">
        <h3 class="text-sm uppercase tracking-[0.2em] font-bold">{{ store.t('noProductsFound') }}</h3>
        <p class="text-xs font-light" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('tryAdjusting') }}</p>
      </div>
      <NuxtLink 
        to="/add"
        class="inline-block px-6 py-3 border text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300"
        :class="store.isDarkMode.value 
          ? 'border-white text-white hover:bg-white hover:text-black' 
          : 'border-black text-black hover:bg-black hover:text-white'"
      >
        {{ store.t('createProduct') }}
      </NuxtLink>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1  gap-6">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="border p-5 transition-all w-[93vw] -ml-2  rounded-xl duration-500 flex gap-4 md:gap-6 group relative"
        :class="store.isDarkMode.value 
          ? 'bg-zinc-950 border-white/20 hover:border-white/30'
          : 'bg-white border-black/10 hover:border-black/30'"
      >

        <!-- Product Image (High fashion design aspect ratio with CSS Carousel) -->
        <div 
          class="w-24 h-36 md:w-32 md:h-36 flex-shrink-0 relative transition-all duration-500 border group"
          :class="store.isDarkMode.value 
            ? 'bg-zinc-900 border-white/5 hover:border-white/20' 
            : 'bg-zinc-100 border-black/5 hover:border-black/20'"
        >
          <div 
            v-if="product.images && product.images.length > 0" 
            class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full relative"
            @scroll="(e) => handleImageScroll(e, product.id)"
          >
            <img 
              v-for="(img, idx) in product.images" 
              :key="idx"
              :src="img" 
              :alt="product.name"
              class="snap-center min-w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          <!-- Indicator Dots if multiple images -->
          <div v-if="product.images && product.images.length > 1" class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            <div 
              v-for="(_, idx) in product.images" 
              :key="'dot-'+idx" 
              class="h-1 rounded-full shadow-md transition-all duration-300" 
              :class="[
                (activeImageMap[product.id] || 0) === idx 
                  ? (store.isDarkMode.value ? 'bg-white w-3' : 'bg-black w-3') 
                  : (store.isDarkMode.value ? 'bg-white/40 w-1' : 'bg-black/40 w-1')
              ]"
            ></div>
          </div>

          <!-- Luxury Typography Placeholder if no image is present -->
          <div 
            v-if="!product.images || product.images.length === 0"
            class="absolute inset-0 w-full h-full flex flex-col items-center justify-center   text-center select-none"
            :class="store.isDarkMode.value 
              ? 'bg-gradient-to-b from-zinc-900 to-black' 
              : 'bg-gradient-to-b from-zinc-100 to-zinc-50'"
          >
             <img 
              :key="idx"
              :src="defaultPic" 
              class="snap-center min-w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        <!-- Product Info & Actions -->
        <div class="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div class="space-y-2">
            <div>
              <p 
                class="text-[9px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
                :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'"
              >
                {{ product.brand }}
              </p>
              <h3 
                class="text-sm uppercase tracking-[0.15em] font-bold truncate pr-12 transition-colors duration-500"
                :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
              >
                {{ product.name }}
              </h3>
            </div>

            <!-- Price and volume tag -->
             <span class="text-sm font-black tracking-wide" :class="store.isDarkMode.value ? 'text-white' : 'text-black'">UZS: {{ product.price }}</span>
            <div class="flex items-center gap-3 mt-2">
              <span 
                class="text-[10px] uppercase tracking-[0.15em] border px-2 py-0.5 transition-all duration-500"
                :class="store.isDarkMode.value 
                  ? 'text-white/30 border-white/5 bg-zinc-900/50' 
                  : 'text-black/40 border-black/5 bg-zinc-100/50'"
              >{{ product.volume }}</span>
              <span 
                class="text-[10px] uppercase tracking-[0.15em] border px-2 py-0.5 transition-all duration-500"
                :class="store.isDarkMode.value 
                  ? 'text-white/30 border-white/5 bg-zinc-900/50' 
                  : 'text-black/40 border-black/5 bg-zinc-100/50'"
              >{{ store.locale.value === 'uz' ? (product.category === 'Men' ? 'Erkaklar' : product.category === 'Women' ? 'Ayollar' : 'Ayollar') : (product.category === 'Men' ? 'Мужские' : product.category === 'Women' ? 'Женские' : 'Женские') }}</span>
            </div>

          </div>

          <!-- Bottom Row: Statistics & Brutalist Action Buttons -->
          <div class="flex items-center justify-between border-t pt-3 mt-3 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/5' : 'border-black/5'">
           
            <div class="flex">
              <!-- Edit Button -->
              <button 
                @click="openEditPage(product.id)"
                class="px-3.5 py-1.5 border text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                :class="store.isDarkMode.value 
                  ? 'border-white/10 hover:border-white bg-zinc-950 text-white/70 hover:text-white hover:bg-zinc-900' 
                  : 'border-black/10 hover:border-black bg-white text-black/70 hover:text-black hover:bg-zinc-100'"
              >
                {{ store.t('btnEdit') }}
              </button>
              <!-- Delete Button -->
              <button 
                @click="confirmDelete(product)"
                class="px-3.5 py-1.5 border text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                :class="store.isDarkMode.value 
                  ? 'border-red-950/40 hover:border-red-500 hover:bg-red-950/20 text-red-500/70 hover:text-red-400 bg-zinc-950' 
                  : 'border-red-100 hover:border-red-600 hover:bg-red-50 text-red-600 hover:text-red-700 bg-white'"
              >
                {{ store.t('btnDelete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="isDeleteOpen" class="fixed inset-0 z-[110] flex items-center justify-center select-none bg-black/85 backdrop-blur-sm px-6">
          <div 
            class="border p-6 md:p-8 max-w-sm w-full space-y-6 text-center transition-all duration-500"
            :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'"
          >
            <div class="mx-auto w-12 h-12 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.3c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            
            <div class="space-y-2">
              <h4 class="text-base uppercase tracking-[0.2em] font-black">{{ store.t('confirmDeletionTitle') }}</h4>
              <p class="text-xs font-light leading-relaxed" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">
                {{ store.t('confirmDeletionText1') }}<strong :class="store.isDarkMode.value ? 'text-white' : 'text-black'">{{ productToDelete?.name }}</strong>{{ store.t('confirmDeletionText2') }}
              </p>
            </div>

            <div class="flex gap-3 pt-2">
              <button 
                @click="isDeleteOpen = false"
                class="flex-1 py-3 border transition-all duration-300 text-xs uppercase tracking-[0.2em] font-bold"
                :class="store.isDarkMode.value 
                  ? 'border-white/10 bg-zinc-900 text-white/80 hover:text-white hover:border-white' 
                  : 'border-black/10 bg-zinc-100 text-black/80 hover:text-black hover:border-black'"
              >
                {{ store.t('btnCancel') }}
              </button>
              <button 
                @click="submitDelete"
                class="flex-1 py-3 bg-red-600 border border-red-600 text-white hover:bg-black hover:text-red-500 hover:border-red-500 transition-all duration-300 text-xs uppercase tracking-[0.2em] font-bold"
              >
                {{ store.t('btnDeleteUpper') }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '~/composables/useStore'
import defaultPic from '../assets/pic/Icon.ico'

const router = useRouter()
const store = useStore()
const { products, loading, deleteProduct, updateProduct } = store

const searchQuery = ref('')
const activeTab = ref('all')

// Track active product image index for indicators
const activeImageMap = ref({})

const handleImageScroll = (e, productId) => {
  const scrollLeft = e.target.scrollLeft
  const width = e.target.clientWidth
  if (width === 0) return
  // Calculate which image is mostly in view
  const activeIndex = Math.round(scrollLeft / width)
  activeImageMap.value[productId] = activeIndex
}

const tabs = computed(() => [
  { label: store.t('tabAll'), value: 'all' },
  { label: store.t('tabMen'), value: 'Men' },
  { label: store.t('tabWomen'), value: 'Women' },
])

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTab = activeTab.value === 'all' || p.category === activeTab.value
    return matchesSearch && matchesTab
  })
})

// Editing routing
const openEditPage = (id) => {
  router.push(`/edit-${id}`)
}

// Deleting states
const isDeleteOpen = ref(false)
const productToDelete = ref(null)

const confirmDelete = (product) => {
  productToDelete.value = product
  isDeleteOpen.value = true
}

const submitDelete = async () => {
  if (!productToDelete.value) return
  await deleteProduct(productToDelete.value.id)
  isDeleteOpen.value = false
  productToDelete.value = null
}
</script>

<style scoped>
/* Scrolled tab styling */
scrollbar-none::-webkit-scrollbar {
  display: none;
}
scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Slide Up Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.32, 0.94, 0.6, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
