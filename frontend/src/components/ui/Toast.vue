<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const { toasts, remove } = useToast()

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircle2
    case 'error': return AlertCircle
    case 'info': return Info
    default: return Info
  }
}

const getStyles = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-50 border-emerald-100 text-emerald-800'
    case 'error': return 'bg-rose-50 border-rose-100 text-rose-800'
    case 'info': return 'bg-blue-50 border-blue-100 text-blue-800'
    default: return 'bg-white border-primary/10 text-dark'
  }
}

const getIconStyles = (type: string) => {
  switch (type) {
    case 'success': return 'text-emerald-500'
    case 'error': return 'text-rose-500'
    case 'info': return 'text-blue-500'
    default: return 'text-accent'
  }
}
</script>

<template>
  <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
    <TransitionGroup 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-8 scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-4 scale-95"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="flex items-center gap-4 p-4 rounded-3xl border shadow-xl backdrop-blur-md overflow-hidden relative"
        :class="getStyles(toast.type)"
      >
        <!-- Lottie for Success -->
        <div v-if="toast.type === 'success'" class="w-20 h-20 -ml-2 shrink-0 bg-emerald-100/30 rounded-full flex items-center justify-center">
          <DotLottieVue src="/love-dog.lottie" autoplay loop class="w-28 h-28" />
        </div>
        
        <!-- Icon for Other Types -->
        <div v-else class="p-2 bg-white/50 rounded-2xl border border-white/50 shrink-0 mt-0.5">
          <component :is="getIcon(toast.type)" class="w-5 h-5" :class="getIconStyles(toast.type)" />
        </div>
        
        <div class="flex-1 pt-1.5">
          <p class="text-sm font-bold leading-snug">
            {{ toast.message }}
          </p>
          <p v-if="toast.type === 'success'" class="text-[10px] opacity-60 uppercase tracking-widest font-black mt-1">
            Success!
          </p>
        </div>

        <button 
          @click="remove(toast.id)"
          class="shrink-0 p-1.5 hover:bg-black/5 rounded-xl transition-colors mt-0.5"
        >
          <X class="w-4 h-4 opacity-40" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
