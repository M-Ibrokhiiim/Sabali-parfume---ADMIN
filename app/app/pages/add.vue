<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="space-y-1 border-b pb-4 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/10' : 'border-black/10'">
      <span 
        class="text-[9px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
        :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'"
      >New Creation</span>
      <h2 
        class="text-xl uppercase tracking-[0.25em] font-extrabold transition-colors duration-500"
        :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
      >
        Add Product
      </h2>
    </div>

    <!-- Success Feedback Overlay -->
    <div 
      v-if="showSuccess" 
      class="border p-6 text-center space-y-4 transition-all duration-500"
      :class="store.isDarkMode.value ? 'border-white bg-zinc-950 text-white' : 'border-black bg-white text-black'"
    >
      <div 
        class="w-10 h-10 border flex items-center justify-center mx-auto transition-all duration-500"
        :class="store.isDarkMode.value ? 'border-white text-white' : 'border-black text-black'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <div class="space-y-1">
        <h3 class="text-sm uppercase tracking-[0.2em] font-black">CREATION SUCCESSFUL</h3>
        <p class="text-xs font-light" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">
          The perfume has been integrated into SABALI inventory.
        </p>
      </div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitForm" class="space-y-6">
      
      <!-- IMAGE UPLOADER -->
      <div class="space-y-2">
        <label 
          class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
        >PRODUCT IMAGE</label>
        
        <div 
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          class="relative w-full h-56 md:h-64 border border-dashed flex flex-col items-center justify-center p-4 transition-all duration-500"
          :class="[
            store.isDarkMode.value 
              ? (isDragging ? 'border-white bg-zinc-900' : 'border-white/10 hover:border-white/30 bg-zinc-950')
              : (isDragging ? 'border-black bg-zinc-100' : 'border-black/10 hover:border-black/30 bg-white'),
            imagePreview ? 'border-solid border-white/25' : ''
          ]"
        >
          <!-- Display preview if available -->
          <div v-if="imagePreview" class="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
            <img :src="imagePreview" class="w-full h-full object-contain" alt="Preview" />
            <button 
              type="button"
              @click="clearImage"
              class="absolute top-4 right-4 bg-black/80 hover:bg-white hover:text-black border border-white/20 p-2 text-white/70 transition-all duration-300 rounded-none text-xs"
            >
              REMOVE
            </button>
          </div>

          <!-- Upload Prompt -->
          <div v-else class="text-center space-y-3 cursor-pointer" @click="triggerFileInput">
            <div 
              class="mx-auto w-10 h-10 border flex items-center justify-center transition-all duration-500"
              :class="store.isDarkMode.value 
                ? 'border-white/10 text-white/30 bg-black' 
                : 'border-black/10 text-black/30 bg-zinc-50'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 4.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <div class="space-y-1">
              <p 
                class="text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-500"
                :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
              >DRAG & DROP IMAGE</p>
              <p class="text-[8px] uppercase tracking-[0.15em]" :class="store.isDarkMode.value ? 'text-white/20' : 'text-black/20'">or click to browse local files (JPG, PNG)</p>
            </div>
          </div>

          <!-- Hidden File Input -->
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>

      <!-- Perfume Name -->
      <div class="space-y-2">
        <label 
          class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
        >PERFUME NAME</label>
        <input 
          v-model="form.name"
          type="text" 
          required
          placeholder="E.G. OUD IMPERIAL"
          class="w-full border px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none transition-all duration-500 rounded-none"
          :class="store.isDarkMode.value 
            ? 'bg-zinc-950 border-white/10 placeholder-white/15 focus:border-white text-white' 
            : 'bg-white border-black/10 placeholder-black/20 focus:border-black text-black'"
        />
      </div>

      <!-- Brand -->
      <div class="space-y-2">
        <label 
          class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
        >BRAND NAME</label>
        <input 
          v-model="form.brand"
          type="text" 
          required
          placeholder="E.G. SABALI"
          class="w-full border px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none transition-all duration-500 rounded-none"
          :class="store.isDarkMode.value 
            ? 'bg-zinc-950 border-white/10 placeholder-white/15 focus:border-white text-white' 
            : 'bg-white border-black/10 placeholder-black/20 focus:border-black text-black'"
        />
      </div>

      <!-- Double Grid: Price and Stock -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Price -->
        <div class="space-y-2">
          <label 
            class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
            :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
          >PRICE ($ USD)</label>
          <input 
            v-model.number="form.price"
            type="number" 
            min="1"
            required
            placeholder="140"
            class="w-full border px-4 py-3 text-xs tracking-wider focus:outline-none transition-all duration-500 rounded-none"
            :class="store.isDarkMode.value 
              ? 'bg-zinc-950 border-white/10 placeholder-white/15 focus:border-white text-white' 
              : 'bg-white border-black/10 placeholder-black/20 focus:border-black text-black'"
          />
        </div>

        <!-- Stock -->
        <div class="space-y-2">
          <label 
            class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
            :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
          >INITIAL STOCK</label>
          <input 
            v-model.number="form.stock"
            type="number" 
            min="0"
            required
            placeholder="25"
            class="w-full border px-4 py-3 text-xs tracking-wider focus:outline-none transition-all duration-500 rounded-none"
            :class="store.isDarkMode.value 
              ? 'bg-zinc-950 border-white/10 placeholder-white/15 focus:border-white text-white' 
              : 'bg-white border-black/10 placeholder-black/20 focus:border-black text-black'"
          />
        </div>
      </div>

      <!-- Double Grid: Category and Volume -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Category -->
        <div class="space-y-2">
          <label 
            class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
            :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
          >CATEGORY</label>
          <select 
            v-model="form.category"
            class="w-full border px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none transition-all duration-500 rounded-none"
            :class="store.isDarkMode.value 
              ? 'bg-zinc-950 border-white/10 focus:border-white text-white' 
              : 'bg-white border-black/10 focus:border-black text-black'"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <!-- Volume -->
        <div class="space-y-2">
          <label 
            class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
            :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
          >VOLUME</label>
          <select 
            v-model="form.volume"
            class="w-full border px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none transition-all duration-500 rounded-none"
            :class="store.isDarkMode.value 
              ? 'bg-zinc-950 border-white/10 focus:border-white text-white' 
              : 'bg-white border-black/10 focus:border-black text-black'"
          >
            <option value="50ml">50ml</option>
            <option value="100ml">100ml</option>
            <option value="150ml">150ml</option>
          </select>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label 
          class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
        >DESCRIPTION</label>
        <textarea 
          v-model="form.description"
          rows="4"
          required
          placeholder="DESCRIBE THE PERFUME AURA, NOTES, AND IMPRESSION..."
          class="w-full border px-4 py-3 text-xs tracking-wide focus:outline-none transition-all duration-500 resize-none rounded-none"
          :class="store.isDarkMode.value 
            ? 'bg-zinc-950 border-white/10 placeholder-white/15 focus:border-white text-white' 
            : 'bg-white border-black/10 placeholder-black/15 focus:border-black text-black'"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit"
        :disabled="loading"
        class="w-full py-4 text-xs font-black uppercase tracking-[0.35em] border disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 ease-out pt-4 mt-2 rounded-none"
        :class="store.isDarkMode.value 
          ? 'bg-white text-black border-white hover:bg-black hover:text-white' 
          : 'bg-black text-white border-black hover:bg-white hover:text-black'"
      >
        {{ loading ? 'CREATING...' : 'ADD PERFUME' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '~/composables/useStore'

const router = useRouter()
const store = useStore()
const { addProduct, loading } = store

const showSuccess = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)
const imagePreview = ref('')

const form = ref({
  name: '',
  brand: 'SABALI',
  price: null,
  stock: null,
  category: 'Unisex',
  volume: '100ml',
  description: '',
  image: ''
})

// Triggering native click
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Convert file to Base64
const processFile = (file) => {
  if (!file || !file.type.startsWith('image/')) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result
    form.value.image = e.target?.result
  }
  reader.readAsDataURL(file)
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) processFile(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

const clearImage = () => {
  imagePreview.value = ''
  form.value.image = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const submitForm = async () => {
  await addProduct(form.value)
  showSuccess.value = true
  
  // Wait a short moment for feedback, then navigate back to products list
  setTimeout(() => {
    router.push('/')
  }, 1500)
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
