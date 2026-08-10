<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Search & Navigation Title -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 
          class="text-xl uppercase tracking-[0.25em] font-extrabold transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
        >
          Inventory
        </h2>
        <span 
          class="text-xs uppercase tracking-[0.15em] border px-3 py-1 rounded-full transition-all duration-500"
          :class="store.isDarkMode.value 
            ? 'text-white/50 bg-zinc-900 border-white/5' 
            : 'text-black/50 bg-zinc-100 border-black/5'"
        >
          {{ filteredProducts.length }} products found
        </span>
      </div>

      <!-- Brutalist Search Bar -->
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="SEARCH PRODUCTS, BRANDS..."
          class="w-full transition-all duration-500 px-5 py-4 text-xs uppercase tracking-[0.2em] font-medium focus:outline-none rounded-none"
          :class="store.isDarkMode.value 
            ? 'bg-zinc-950 border border-white/10 text-white placeholder-white/20 focus:border-white' 
            : 'bg-white border border-black/10 text-black placeholder-black/30 focus:border-black'"
        />
        <span class="absolute right-5 top-1/2 -translate-y-1/2 transition-colors duration-500">
          <svg v-if="!searchQuery" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" :class="store.isDarkMode.value ? 'text-white/30' : 'text-black/30'">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
          </svg>
          <button v-else @click="searchQuery = ''" class="focus:outline-none" :class="store.isDarkMode.value ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
    </div>

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
      <span class="text-xs uppercase tracking-[0.2em]" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">Syncing database...</span>
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
        <h3 class="text-sm uppercase tracking-[0.2em] font-bold">No Products Found</h3>
        <p class="text-xs font-light" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">Try adjusting your filters or search criteria.</p>
      </div>
      <NuxtLink 
        to="/add"
        class="inline-block px-6 py-3 border text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300"
        :class="store.isDarkMode.value 
          ? 'border-white text-white hover:bg-white hover:text-black' 
          : 'border-black text-black hover:bg-black hover:text-white'"
      >
        Create Product
      </NuxtLink>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1 gap-6">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="border p-5 transition-all duration-500 flex gap-4 md:gap-6 group relative"
        :class="store.isDarkMode.value 
          ? 'bg-zinc-950 border-white/10 hover:border-white/30' 
          : 'bg-white border-black/10 hover:border-black/30'"
      >
        <!-- Badge Tag for stock warning -->
        <span 
          v-if="product.stock <= 3" 
          class="absolute top-3 right-3 bg-red-600/90 text-white text-[8px] tracking-[0.15em] uppercase font-black px-2 py-0.5 rounded-sm"
        >
          Low Stock
        </span>

        <!-- Product Image (High fashion design aspect ratio) -->
        <div 
          class="w-24 h-28 md:w-32 md:h-36 flex-shrink-0 flex items-center justify-center overflow-hidden relative transition-all duration-500 border"
          :class="store.isDarkMode.value 
            ? 'bg-zinc-900 border-white/5 group-hover:border-white/20' 
            : 'bg-zinc-100 border-black/5 group-hover:border-black/20'"
        >
          <img 
            v-if="product.image" 
            :src="product.image" 
            :alt="product.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <!-- Luxury Typography Placeholder if no image is present -->
          <div 
            class="w-full h-full flex flex-col items-center justify-center p-2 text-center select-none"
            :class="store.isDarkMode.value 
              ? 'bg-gradient-to-b from-zinc-900 to-black' 
              : 'bg-gradient-to-b from-zinc-100 to-zinc-50'"
          >
            <span 
              class="text-xs uppercase tracking-[0.35em] font-black transition-colors duration-300"
              :class="store.isDarkMode.value 
                ? 'text-white/25 group-hover:text-white/40' 
                : 'text-black/25 group-hover:text-black/40'"
            >
              SABALI
            </span>
            <span 
              class="text-[8px] uppercase tracking-[0.15em] font-light mt-1"
              :class="store.isDarkMode.value ? 'text-white/15' : 'text-black/15'"
            >
              {{ product.category }}
            </span>
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
            <div class="flex items-center gap-3">
              <span class="text-sm font-black tracking-wide" :class="store.isDarkMode.value ? 'text-white' : 'text-black'">${{ product.price }}</span>
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
              >{{ product.category }}</span>
            </div>

            <!-- Stock bar -->
            <div class="flex items-center gap-2 max-w-xs">
              <span 
                class="text-[9px] uppercase tracking-[0.15em] font-bold min-w-[50px] transition-colors duration-500"
                :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'"
              >Stock: {{ product.stock }}</span>
              <div class="flex-1 h-1 rounded-full overflow-hidden transition-colors duration-500" :class="store.isDarkMode.value ? 'bg-zinc-900' : 'bg-zinc-200'">
                <div 
                  class="h-full rounded-full transition-all duration-500" 
                  :class="[
                    product.stock <= 3 
                      ? 'bg-red-500' 
                      : product.stock <= 10 
                        ? 'bg-amber-500' 
                        : (store.isDarkMode.value ? 'bg-white' : 'bg-black')
                  ]"
                  :style="{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Statistics & Brutalist Action Buttons -->
          <div class="flex items-center justify-between border-t pt-3 mt-3 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/5' : 'border-black/5'">
            <span 
              class="text-[9px] uppercase tracking-[0.15em] transition-colors duration-500"
              :class="store.isDarkMode.value ? 'text-white/30' : 'text-black/30'"
            >
              Sales: <strong :class="store.isDarkMode.value ? 'text-white/80' : 'text-black/80'">{{ product.sales || 0 }}</strong>
            </span>
            <div class="flex gap-2">
              <!-- Edit Button -->
              <button 
                @click="openEditModal(product)"
                class="px-3.5 py-1.5 border text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                :class="store.isDarkMode.value 
                  ? 'border-white/10 hover:border-white bg-zinc-950 text-white/70 hover:text-white hover:bg-zinc-900' 
                  : 'border-black/10 hover:border-black bg-white text-black/70 hover:text-black hover:bg-zinc-100'"
              >
                Edit
              </button>
              <!-- Delete Button -->
              <button 
                @click="confirmDelete(product)"
                class="px-3.5 py-1.5 border text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                :class="store.isDarkMode.value 
                  ? 'border-red-950/40 hover:border-red-500 hover:bg-red-950/20 text-red-500/70 hover:text-red-400 bg-zinc-950' 
                  : 'border-red-100 hover:border-red-600 hover:bg-red-50 text-red-600 hover:text-red-700 bg-white'"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT OVERLAY (Slide Up Drawer) -->
    <transition name="slide-up">
      <div v-if="isEditOpen" class="fixed inset-0 z-[100] flex items-end justify-center select-none bg-black/70 backdrop-blur-sm px-4">
        <!-- Backdrop Closer -->
        <div class="absolute inset-0" @click="closeEditModal"></div>

        <!-- Drawer Content -->
        <div 
          class="relative w-full max-w-lg border border-b-0 p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto scrollbar-thin transition-all duration-500"
          :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/10 text-black'"
        >
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b pb-4 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/10' : 'border-black/10'">
            <div class="space-y-1">
              <span class="text-[9px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">Modifying Item</span>
              <h3 class="text-base uppercase tracking-[0.15em] font-black">Edit Perfume</h3>
            </div>
            <button 
              @click="closeEditModal" 
              class="p-2 border transition-all duration-300"
              :class="store.isDarkMode.value 
                ? 'border-white/10 hover:border-white text-white/50 hover:text-white' 
                : 'border-black/10 hover:border-black text-black/50 hover:text-black'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Edit Form -->
          <form v-if="editingForm" @submit.prevent="submitEdit" class="space-y-5">
            <!-- Name -->
            <div class="space-y-2">
              <label class="block text-[10px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">PERFUME NAME</label>
              <input 
                v-model="editingForm.name"
                type="text" 
                required
                class="w-full border px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none transition-all duration-300 rounded-none"
                :class="store.isDarkMode.value 
                  ? 'bg-black border-white/10 focus:border-white text-white' 
                  : 'bg-zinc-50 border-black/10 focus:border-black text-black'"
              />
            </div>

            <!-- Brand -->
            <div class="space-y-2">
              <label class="block text-[10px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">BRAND</label>
              <input 
                v-model="editingForm.brand"
                type="text" 
                required
                class="w-full border px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none transition-all duration-300 rounded-none"
                :class="store.isDarkMode.value 
                  ? 'bg-black border-white/10 focus:border-white text-white' 
                  : 'bg-zinc-50 border-black/10 focus:border-black text-black'"
              />
            </div>

            <!-- Double Grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Price -->
              <div class="space-y-2">
                <label class="block text-[10px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">PRICE ($)</label>
                <input 
                  v-model.number="editingForm.price"
                  type="number" 
                  min="1"
                  required
                  class="w-full border px-4 py-3 text-xs tracking-wider focus:outline-none transition-all duration-300 rounded-none"
                  :class="store.isDarkMode.value 
                    ? 'bg-black border-white/10 focus:border-white text-white' 
                    : 'bg-zinc-50 border-black/10 focus:border-black text-black'"
                />
              </div>

              <!-- Stock -->
              <div class="space-y-2">
                <label class="block text-[10px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">STOCK</label>
                <input 
                  v-model.number="editingForm.stock"
                  type="number" 
                  min="0"
                  required
                  class="w-full border px-4 py-3 text-xs tracking-wider focus:outline-none transition-all duration-300 rounded-none"
                  :class="store.isDarkMode.value 
                    ? 'bg-black border-white/10 focus:border-white text-white' 
                    : 'bg-zinc-50 border-black/10 focus:border-black text-black'"
                />
              </div>
            </div>

            <!-- Category & Volume Selector -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Category -->
              <div class="space-y-2">
                <label class="block text-[10px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">CATEGORY</label>
                <select 
                  v-model="editingForm.category"
                  class="w-full border px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none transition-all duration-300 rounded-none"
                  :class="store.isDarkMode.value 
                    ? 'bg-black border-white/10 focus:border-white text-white' 
                    : 'bg-zinc-50 border-black/10 focus:border-black text-black'"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <!-- Volume -->
              <div class="space-y-2">
                <label class="block text-[10px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">VOLUME</label>
                <select 
                  v-model="editingForm.volume"
                  class="w-full border px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none transition-all duration-300 rounded-none"
                  :class="store.isDarkMode.value 
                    ? 'bg-black border-white/10 focus:border-white text-white' 
                    : 'bg-zinc-50 border-black/10 focus:border-black text-black'"
                >
                  <option value="50ml">50ml</option>
                  <option value="100ml">100ml</option>
                  <option value="150ml">150ml</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <label class="block text-[10px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">DESCRIPTION</label>
              <textarea 
                v-model="editingForm.description"
                rows="3"
                required
                class="w-full border px-4 py-3 text-xs tracking-wide focus:outline-none transition-all duration-300 resize-none rounded-none"
                :class="store.isDarkMode.value 
                  ? 'bg-black border-white/10 focus:border-white text-white' 
                  : 'bg-zinc-50 border-black/10 focus:border-black text-black'"
              ></textarea>
            </div>

            <!-- Submit -->
            <button 
              type="submit"
              class="w-full py-4 text-xs font-black uppercase tracking-[0.35em] border transition-all duration-500 ease-out mt-2"
              :class="store.isDarkMode.value 
                ? 'bg-white text-black border-white hover:bg-black hover:text-white' 
                : 'bg-black text-white border-black hover:bg-white hover:text-black'"
            >
              SAVE CHANGES
            </button>
          </form>
        </div>
      </div>
    </transition>

    <!-- DELETE CONFIRMATION MODAL -->
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
            <h4 class="text-base uppercase tracking-[0.2em] font-black">Confirm Deletion</h4>
            <p class="text-xs font-light leading-relaxed" :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'">
              Are you sure you want to permanently delete <strong :class="store.isDarkMode.value ? 'text-white' : 'text-black'">{{ productToDelete?.name }}</strong>? This action is irreversible.
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
              Cancel
            </button>
            <button 
              @click="submitDelete"
              class="flex-1 py-3 bg-red-600 border border-red-600 text-white hover:bg-black hover:text-red-500 hover:border-red-500 transition-all duration-300 text-xs uppercase tracking-[0.2em] font-bold"
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '~/composables/useStore'

const store = useStore()
const { products, loading, deleteProduct, updateProduct } = store

const searchQuery = ref('')
const activeTab = ref('all')

const tabs = [
  { label: 'ALL', value: 'all' },
  { label: 'MEN', value: 'Men' },
  { label: 'WOMEN', value: 'Women' },
  { label: 'UNISEX', value: 'Unisex' }
]

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTab = activeTab.value === 'all' || p.category === activeTab.value
    return matchesSearch && matchesTab
  })
})

// Editing states
const isEditOpen = ref(false)
const editingForm = ref(null)
let originalId = null

const openEditModal = (product) => {
  originalId = product.id
  editingForm.value = {
    name: product.name,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    category: product.category,
    volume: product.volume,
    description: product.description,
    image: product.image
  }
  isEditOpen.value = true
}

const closeEditModal = () => {
  isEditOpen.value = false
  editingForm.value = null
  originalId = null
}

const submitEdit = async () => {
  if (!originalId || !editingForm.value) return
  await updateProduct(originalId, editingForm.value)
  closeEditModal()
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
