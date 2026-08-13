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
      class="border p-8 flex flex-col items-center justify-center text-center gap-5 transition-all rounded-xl duration-500 relative"
      :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/30' : 'bg-white border-black/10'"
    >
      <!-- Notification Bell -->
      <div class="absolute top-5 right-5 cursor-pointer group" @click="openModal">
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
        class="w-32 h-32 md:w-28 md:h-28 rounded-full overflow-hidden border flex items-center justify-center transition-all duration-500"
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
      class="border p-6 space-y-5 transition-all duration-500 rounded-xl"
      :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/30 text-white' : 'bg-white border-black/10 text-black'"
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

    <!-- BIRTHDAY CONGRATULATIONS MODAL -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-4 md:px-6">
          <div 
            class="relative max-w-3xl w-full border flex flex-col md:flex-row transition-all duration-500 rounded-xl overflow-hidden shadow-2xl"
            :class="store.isDarkMode.value ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'"
          >
            <!-- Close Button in Top Right Corner -->
            <button 
              @click="isModalOpen = false" 
              class="absolute top-4 right-4 z-20 p-1.5 rounded-full border transition-all duration-300 hover:scale-110 cursor-pointer"
              :class="store.isDarkMode.value 
                ? 'border-white/10 bg-zinc-950/85 text-white/60 hover:text-white hover:border-white' 
                : 'border-black/10 bg-white/85 text-black/60 hover:text-black hover:border-black'"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- 1- Picture Section (Big Picture Slider as Product Card of Picture) -->
            <div 
              class="w-full md:w-1/2 h-64 md:h-[400px] relative flex-shrink-0 transition-all duration-500 border-b md:border-b-0 md:border-r"
              :class="store.isDarkMode.value 
                ? 'bg-zinc-900 border-white/10' 
                : 'bg-zinc-100 border-black/10'"
            >
              <div 
                class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full relative"
                @scroll="handleModalImageScroll"
              >
                <img 
                  v-for="(img, idx) in modalPictures" 
                  :key="idx"
                  :src="img" 
                  class="snap-center min-w-full h-full  object-cover  transition-transform duration-500 hover:scale-105"
                  alt="Birthday Card Slide"
                />
              </div>
              
              <!-- Indicator Dots if multiple images -->
              <div v-if="modalPictures.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                <div 
                  v-for="(_, idx) in modalPictures" 
                  :key="'dot-'+idx" 
                  class="h-1 rounded-full shadow-md transition-all duration-300" 
                  :class="[
                    activeModalImageIndex === idx 
                      ? (store.isDarkMode.value ? 'bg-white w-4' : 'bg-black w-4') 
                      : (store.isDarkMode.value ? 'bg-white/40 w-1.5' : 'bg-black/40 w-1.5')
                  ]"
                ></div>
              </div>
            </div>

            <!-- 2- Text Section for Congratulation Text -->
            <div class="w-full md:w-1/2 p-8 flex flex-col justify-center text-center relative select-none">
              <!-- Animated Minimalist Spark Ornament -->
              <div class="flex justify-center mb-4 text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-8 h-8 animate-pulse">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c.184-.377.724-.377.908 0l1.96 4.02 4.358.64c.417.062.584.58.282.88l-3.153 3.125.744 4.41c.071.424-.37.747-.75.547L12 14.823l-3.901 2.09c-.38.201-.821-.121-.75-.546l.743-4.41-3.153-3.125c-.302-.3-.135-.818.282-.88l4.358-.64 1.96-4.02Z" />
                </svg>
              </div>

              <!-- Luxury Subtitle -->
              <span 
                class="text-[9px] uppercase tracking-[0.25em] font-bold text-amber-500 mb-1 animate-fade-in"
              >
                {{ birthdaySubtitle }}
              </span>

              <!-- Elegant Brand/Friend Greeting Header -->
              <h4 
                class="text-sm uppercase tracking-[0.2em] font-extrabold mb-5"
                :class="store.isDarkMode.value ? 'text-white' : 'text-black'"
              >
                {{ birthdayTitle }}
              </h4>

              <!-- Congratulations Message (Exactly 20 words for the active language) -->
              <p 
                class="text-xs font-light leading-relaxed tracking-wide italic mb-6 animate-fade-in"
                :class="store.isDarkMode.value ? 'text-zinc-400' : 'text-zinc-600'"
              >
                "{{ birthdayGreeting }}"
              </p>

              <!-- Luxury Signature line -->
              <div class="border-t pt-4 transition-colors duration-500" :class="store.isDarkMode.value ? 'border-white/5' : 'border-black/5'">
                <span class="text-[9px] uppercase tracking-[0.25em] font-bold" :class="store.isDarkMode.value ? 'text-white/40' : 'text-black/40'">
                  With Love, SabAli
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '~/composables/useStore'
import ProfilePic from "../assets/pic/AccountPic.png"
import Congrats1 from "../assets/pic/congratsPic/1.jpg"
import Congrats2 from "../assets/pic/congratsPic/2.jpg"
import Congrats3 from "../assets/pic/congratsPic/3.jpg"


const store = useStore()
const { products } = store

const isModalOpen = ref(false)
const activeModalImageIndex = ref(0)
const modalPictures = [Congrats1, Congrats2, Congrats3]
 
const openModal = async () => {
  activeModalImageIndex.value = 0
  isModalOpen.value = true
  await playBellSound()
}

const handleModalImageScroll = (e) => {
  const scrollLeft = e.target.scrollLeft
  const width = e.target.clientWidth
  if (width === 0) return
  activeModalImageIndex.value = Math.round(scrollLeft / width)
}

const birthdayTitle = computed(() => {
  if (store.locale.value === 'uz') return "AZIZ DO'STIMGA"
  if (store.locale.value === 'ru') return "ДОРОГОМУ ДРУГУ"
  return "TO MY DEAR FRIEND"
})

const birthdaySubtitle = computed(() => {
  if (store.locale.value === 'uz') return "TUG'ILGAN KUN TABRIGI"
  if (store.locale.value === 'ru') return "С ДНЕМ РОЖДЕНИЯ"
  return "BIRTHDAY CELEBRATION"
})

const birthdayGreeting = computed(() => {
  if (store.locale.value === 'uz') {
    return "Tug'ilgan kuning bilan, aziz do'stim! Senga cheksiz muvaffaqiyat, quvonchli lahzalar va hashamatli xotiralarga boy go'zal hayot tilayman. Shodlik hamisha hamrohing bo'lsin!"
  } else if (store.locale.value === 'ru') {
    return "С днем рождения, дорогой друг! Желаю тебе бесконечного успеха, радостных моментов и прекрасной жизни, полной роскошных воспоминаний. Будь всегда счастлив!"
  } else {
    return "Happy Birthday, my dear friend! Wishing you endless success, timeless moments of joy, and a life filled with luxurious memories."
  }
})

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

// Play high-quality synthesized luxury glass-harp arpeggio chime & trigger haptic vibration
const playBellSound = async () => {
  if (typeof window === 'undefined') return

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()
    
    // Resume audio context to bypass iOS Safari / mobile autoplay touch/unlock security blocks
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    const now = ctx.currentTime

    // Beautiful ascending arpeggio notes in A Major chord
    const arpeggio = [
      { freq: 659.25, delay: 0.0, vol: 0.25, decay: 0.8 },   // E5
      { freq: 880.00, delay: 0.08, vol: 0.22, decay: 0.8 },  // A5
      { freq: 1109.73, delay: 0.16, vol: 0.20, decay: 1.0 }  // C#6
    ]

    arpeggio.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(note.freq, now + note.delay)

      // Sound decay envelope
      gain.gain.setValueAtTime(0.001, now + note.delay)
      gain.gain.linearRampToValueAtTime(note.vol, now + note.delay + 0.02) // quick attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + note.decay)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + note.delay)
      osc.stop(now + note.delay + note.decay)
    })

    // Physical haptic vibration pattern for mobile (Feature-detected for Android/Mobile support)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      // Dual premium touch pulses to match arpeggio rise
      navigator.vibrate([40, 60, 100])
    }
  } catch (err) {
    console.error('Failed to play bell audio/vibration on mobile/desktop:', err)
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
