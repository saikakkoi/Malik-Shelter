<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'
import { X, AlertCircle, Info } from 'lucide-vue-next'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const { state, close } = useDialog()

const handleConfirm = () => {
  if (state.onConfirm) state.onConfirm()
  close()
}
</script>

<template>
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="state.isOpen"
      class="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-dark/40 backdrop-blur-sm">
      <Transition appear enter-active-class="transition duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
        enter-from-class="opacity-0 scale-75 translate-y-8" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95">
        <div
          class="bg-white rounded-[40px] shadow-2xl border border-primary/10 max-w-sm w-full overflow-hidden relative">
          <!-- Close Button -->
          <button @click="close"
            class="absolute top-6 right-6 p-2 hover:bg-primary/5 rounded-2xl transition-colors z-10">
            <X class="w-5 h-5 text-muted" />
          </button>

          <div class="p-10 flex flex-col items-center justify-center text-center">
            <!-- Lottie Animation -->
            <div v-if="state.lottie || state.type === 'success'" class="w-64 mb-4">
              <DotLottieVue :src="state.lottie || '/love-dog.lottie'" autoplay loop />
            </div>

            <!-- Icon for Error/Info (if no lottie) -->
            <div v-else class="w-20 h-20 rounded-[32px] flex items-center justify-center mb-6"
              :class="state.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-primary/10 text-primary'">
              <component :is="state.type === 'error' ? AlertCircle : Info" class="w-10 h-10" />
            </div>

            <h2 class="text-3xl font-bold text-dark font-heading mb-3">
              {{ state.title }}
            </h2>

            <p class="text-muted leading-relaxed mb-8">
              {{ state.message }}
            </p>

            <button @click="handleConfirm"
              class="w-full py-5 rounded-[24px] font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2 group"
              :class="[
                state.type === 'success' ? 'bg-accent text-dark shadow-accent/40' : 
                state.type === 'error' ? 'bg-rose-600 text-white shadow-rose-600/40' : 
                'bg-primary text-white shadow-primary/40'
              ]">
              {{ state.confirmText }}
            </button>
          </div>

          <!-- Decorative bottom gradient -->
          <div class="absolute bottom-0 left-0 right-0 h-1.5"
            :class="state.type === 'success' ? 'bg-accent' : state.type === 'error' ? 'bg-rose-500' : 'bg-primary'">
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
