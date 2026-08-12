<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between border-b pb-4 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/10' : 'border-black/10'">
      <div class="space-y-1">
        <span 
          class="text-[9px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'"
        >Modifying Item</span>
        <h2 
          class="text-xl uppercase tracking-[0.25em] font-extrabold transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
        >
          {{ store.t('titleEdit') }}
        </h2>
      </div>
      <!-- Back Button -->
      <button 
        @click="router.push('/')" 
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

    <div v-if="!form" class="py-12 text-center">
      <span class="text-xs uppercase tracking-[0.2em] font-bold" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">{{ store.t('productNotFound') }}</span>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitForm" class="space-y-6">
      
      <!-- IMAGE UPLOADER -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label 
            class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
            :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
          >{{ store.t('productImages') }}</label>
          <span class="text-[9px] font-bold" :class="store.isDarkMode.value ? 'text-white/30' : 'text-black/30'">
            {{ form.images.length }} {{ store.t('selected') }}
          </span>
        </div>
        
        <div 
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          class="w-full min-h-56 md:min-h-64 border border-dashed flex flex-col p-4 transition-all duration-500 relative"
          :class="[
            store.isDarkMode.value 
              ? (isDragging ? 'border-white bg-zinc-900' : 'border-white/10 hover:border-white/30 bg-zinc-950')
              : (isDragging ? 'border-black bg-zinc-100' : 'border-black/10 hover:border-black/30 bg-white'),
            form.images.length > 0 ? 'border-solid border-white/25 items-start justify-start' : 'items-center justify-center'
          ]"
        >
          <!-- Display preview gallery if available -->
          <div v-if="form.images.length > 0" class="w-full flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin">
            
            <div 
              v-for="(img, idx) in form.images" 
              :key="idx" 
              class="relative w-32 h-44 flex-shrink-0 snap-center border group"
              :class="store.isDarkMode.value ? 'border-white/10 bg-black' : 'border-black/10 bg-zinc-50'"
            >
              <img :src="img" class="w-full h-full object-cover" alt="Preview" />
              <!-- Remove individual image -->
              <button 
                type="button"
                @click="removeImage(idx)"
                class="absolute top-2 right-2 p-1.5  w-[30px] h-[30px] items-center justify-center flex  transition-all duration-300 rounded-none   bg-black opacity-60 text-white shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>

            <!-- Add more images box -->
            <div 
              @click="triggerFileInput"
              class="relative w-32 h-44 flex-shrink-0 snap-center border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
              :class="store.isDarkMode.value ? 'border-white/20 hover:border-white text-white/50 hover:text-white bg-zinc-900/50' : 'border-black/20 hover:border-black text-black/50 hover:text-black bg-zinc-100/50'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mb-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span class="text-[9px] uppercase tracking-[0.2em] font-bold">{{ store.t('addMore') }}</span>
            </div>

          </div>

          <!-- Empty Upload Prompt -->
          <div v-else class="text-center space-y-3 cursor-pointer w-full h-full flex flex-col items-center justify-center" @click="triggerFileInput">
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
              >{{ store.t('dragDropTitle') }}</p>
              <p class="text-[8px] uppercase tracking-[0.15em]" :class="store.isDarkMode.value ? 'text-white/20' : 'text-black/20'">{{ store.t('dragDropDesc') }}</p>
            </div>
          </div>

          <!-- Hidden File Input -->
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            multiple
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
        >{{ store.t('labelName') }}</label>
        <input 
          v-model="form.name"
          type="text" 
          required
          class="w-full border px-4 py-3 text-base uppercase tracking-[0.15em] focus:outline-none transition-all duration-500 rounded-none"
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
        >{{ store.t('labelBrand') }}</label>
        <input 
          v-model="form.brand"
          type="text" 
          required
          class="w-full border px-4 py-3 text-base uppercase tracking-[0.15em] focus:outline-none transition-all duration-500 rounded-none"
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
          >{{ store.t('labelPrice') }}</label>
          <input 
            v-model.number="form.price"
            type="number" 
            min="1"
            required
            class="w-full border px-4 py-3 text-base tracking-wider focus:outline-none transition-all duration-500 rounded-none"
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
          >{{ store.t('editStock') }}</label>
          <input 
            v-model.number="form.stock"
            type="number" 
            min="0"
            required
            class="w-full border px-4 py-3 text-base tracking-wider focus:outline-none transition-all duration-500 rounded-none"
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
          >{{ store.t('labelCategory') }}</label>
          <select 
            v-model="form.category"
            class="w-full border px-4 py-3 text-base uppercase tracking-[0.15em] focus:outline-none transition-all duration-500 rounded-none"
            :class="store.isDarkMode.value 
              ? 'bg-zinc-950 border-white/10 focus:border-white text-white' 
              : 'bg-white border-black/10 focus:border-black text-black'"
          >
            <option value="Men">{{ store.t('catMen') }}</option>
            <option value="Women">{{ store.t('catWomen') }}</option>
          </select>
        </div>

        <!-- Volume -->
        <div class="space-y-2">
          <label 
            class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
            :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
          >{{ store.t('labelVolume') }}</label>
          <select 
            v-model="form.volume"
            class="w-full border px-4 py-3 text-base uppercase tracking-[0.15em] focus:outline-none transition-all duration-500 rounded-none"
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
        >{{ store.t('labelDesc') }}</label>
        <textarea 
          v-model="form.description"
          rows="4"
          required
          class="w-full border px-4 py-3 text-base tracking-wide focus:outline-none transition-all duration-500 resize-none rounded-none"
          :class="store.isDarkMode.value 
            ? 'bg-zinc-950 border-white/10 focus:border-white text-white' 
            : 'bg-white border-black/10 focus:border-black text-black'"
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
        {{ loading ? store.t('btnSaving') : store.t('btnSaveChanges') }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '~/composables/useStore'

const router = useRouter()
const route = useRoute()
const store = useStore()
const { products, updateProduct, loading } = store

const form = ref(null)
const isDragging = ref(false)
const fileInput = ref(null)

onMounted(() => {
  // Find the product by ID in the store
  const targetId = route.params.id
  const targetProduct = products.value.find(p => p.id === targetId)

  if (targetProduct) {
    // Populate form clone, ensuring images is an array
    form.value = { ...targetProduct, images: targetProduct.images ? [...targetProduct.images] : [] }
    // Enforce Men category if previously Unisex
    if (form.value.category === 'Unisex') {
      form.value.category = 'Men'
    }
  }
})

// Triggering native click
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Convert files to Base64 arrays
const processFiles = (files) => {
  Array.from(files).forEach(file => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.images.push(e.target?.result)
    }
    reader.readAsDataURL(file)
  })
}

const handleFileChange = (e) => {
  const files = e.target.files
  if (files) processFiles(files)
  // Reset input so the same files can be chosen again if needed
  if (fileInput.value) fileInput.value.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files) processFiles(files)
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
}


const submitForm = async () => {
  if (!form.value) return
  await updateProduct(route.params.id, form.value)
  // Navigate back immediately on success
  router.push('/')
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
