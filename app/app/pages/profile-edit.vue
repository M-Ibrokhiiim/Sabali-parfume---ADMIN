<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="space-y-1 border-b pb-4 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/10' : 'border-black/10'">
      <span 
        class="text-[9px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
        :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'"
      >{{ store.t('editProfileTitle') }}</span>
      <h2 
        class="text-xl uppercase tracking-[0.25em] font-extrabold transition-colors duration-500"
        :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
      >
        {{ store.t('navProfile') }}
      </h2>
    </div>

    <!-- Back to Profile Link -->
    <NuxtLink 
      to="/profile"
      class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-bold hover:underline"
      :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
      {{ store.t('backToProfile') }}
    </NuxtLink>

    <!-- Editing Card -->
    <div 
      class="border p-8 space-y-6 transition-all duration-500 max-w-xl mx-auto w-full"
      :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/10'"
    >
      <!-- Avatar Section -->
      <div class="flex flex-col items-center gap-4 border-b pb-6" :class="store.isDarkMode.value ? 'border-white/5' : 'border-black/5'">
        <label 
          class="block text-[10px] uppercase tracking-[0.25em] font-bold self-start transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
        >
          {{ store.t('profilePicLabel') }}
        </label>

        <!-- Circular Preview -->
        <div 
          class="w-28 h-28 rounded-full overflow-hidden border flex items-center justify-center transition-all duration-500 relative group"
          :class="store.isDarkMode.value ? 'border-white/20 bg-black' : 'border-black/20 bg-zinc-100'"
        >
          <img :src="tempPic || ProfilePic" class="w-full h-full object-cover" />
        </div>

        <!-- Buttons to upload or reset -->
        <div class="flex gap-2">
          <!-- Hidden Input -->
          <input 
            type="file" 
            accept="image/*" 
            class="hidden" 
            ref="fileInput" 
            @change="handlePhotoUpload" 
          />
          <button 
            type="button"
            @click="triggerFileInput"
            class="px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-300 rounded-none cursor-pointer"
            :class="store.isDarkMode.value 
              ? 'bg-zinc-900 border-white/10 text-white hover:bg-white hover:text-black hover:border-white' 
              : 'bg-zinc-50 border-black/10 text-black hover:bg-black hover:text-white hover:border-black'"
          >
            {{ store.t('changePhoto') }}
          </button>
          <button 
            v-if="tempPic"
            type="button"
            @click="resetToDefault"
            class="px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 rounded-none cursor-pointer"
          >
            {{ store.t('defaultPhoto') }}
          </button>
        </div>
      </div>

      <!-- Name Section -->
      <div class="space-y-2">
        <label 
          class="block text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500"
          :class="store.isDarkMode.value ? 'text-white/50' : 'text-black/50'"
        >
          {{ store.t('adminNameLabel') }}
        </label>
        <input 
          v-model="tempName"
          type="text" 
          class="w-full border px-4 py-3 text-base tracking-wide focus:outline-none transition-all duration-500 rounded-none uppercase"
          :class="store.isDarkMode.value 
            ? 'bg-black border-white/10 text-white focus:border-white' 
            : 'bg-zinc-50 border-black/10 text-black focus:border-black'"
          required
        />
      </div>

      <!-- Save Button -->
      <button 
        @click="saveProfile"
        class="w-full py-4 text-xs font-black uppercase tracking-[0.2em] border transition-all duration-300 rounded-none cursor-pointer"
        :class="store.isDarkMode.value 
          ? 'bg-white text-black border-white hover:bg-black hover:text-white' 
          : 'bg-black text-white border-black hover:bg-white hover:text-black'"
      >
        {{ store.t('btnSave') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '~/composables/useStore'
import ProfilePic from "../assets/pic/AccountPic.png"

const store = useStore()
const router = useRouter()

const tempName = ref('SABALI PARFUME')
const tempPic = ref(null)
const fileInput = ref(null)

onMounted(() => {
  store.initStore()
  tempName.value = store.adminName.value || 'SABALI PARFUME'
  tempPic.value = store.adminPic.value || null
})

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    tempPic.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const resetToDefault = () => {
  tempPic.value = null
}

const saveProfile = () => {
  const finalName = tempName.value.trim().toUpperCase() || 'SABALI PARFUME'
  store.updateAdminProfile(finalName, tempPic.value)
  router.push('/profile')
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
