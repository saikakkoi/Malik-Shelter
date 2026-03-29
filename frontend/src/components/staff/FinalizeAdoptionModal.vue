<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { X, ClipboardCheck, AlertCircle } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  requestId: string | null
}>()

const emit = defineEmits(['close', 'confirm'])

const notes = ref('')
const error = ref('')

watch(() => props.show, (newVal) => {
  if (newVal) {
    notes.value = ''
    error.value = ''
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const handleConfirm = () => {
  if (!notes.value.trim()) {
    error.value = 'Visit notes are required to finalize an adoption.'
    return
  }
  emit('confirm', notes.value)
  emit('close')
}
</script>

<template>
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-dark/40 backdrop-blur-sm">
      <div
        class="bg-[var(--color-surface,white)] rounded-[40px] shadow-2xl border border-primary/10 max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="p-8 border-b border-primary/5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <ClipboardCheck class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-accent font-heading">Finalize Adoption</h2>
              <p class="text-sm text-muted">Complete the visitation record</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-primary/5 rounded-xl transition-colors">
            <X class="w-5 h-5 text-muted" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-8 pb-12 space-y-8">
          <div class="space-y-4">
            <label class="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
              Visit Notes & Observations <span class="text-rose-500">*</span>
            </label>
            <textarea v-model="notes" rows="6"
              placeholder="What were the results of the shelter visit? How did the pet and adopter interact? Enter mandatory notes here..."
              class="w-full p-6 rounded-[24px] bg-[var(--color-surface-2,#fef0ef)] border-2 border-transparent focus:border-accent outline-none transition-all text-[var(--color-text-dark)] resize-none font-form leading-relaxed text-lg"
              :class="{ 'border-rose-300': error }"></textarea>

            <Transition enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
              <div v-if="error" class="flex items-center gap-2 text-rose-500 text-sm font-bold pl-2">
                <AlertCircle class="w-4 h-4" />
                {{ error }}
              </div>
            </Transition>
          </div>

          <div class="bg-primary/5 p-5 rounded-[24px] border border-primary/10 flex items-start gap-3">
            <div class="text-primary mt-1">
              <AlertCircle class="w-4 h-4" />
            </div>
            <p class="text-[13px] text-muted-foreground leading-relaxed">
              <strong>Notice:</strong> Confirming this will mark the pet as <strong>ADOPTED</strong>. This action will
              also automatically reject all other pending adoption requests for this pet.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 pt-0 bg-[var(--color-surface,white)] flex gap-4">
          <button @click="$emit('close')"
            class="flex-1 py-4 rounded-[20px] font-bold text-muted hover:bg-primary/5 transition-colors border border-primary/10">
            Cancel
          </button>
          <button @click="handleConfirm" :disabled="!notes.trim()"
            class="flex-1 py-4 rounded-[20px] font-bold text-md shadow-lg transition-all flex items-center justify-center gap-2 disabled:shadow-none disabled:cursor-not-allowed"
            :class="notes.trim() ? 'bg-accent text-white shadow-accent/40 hover:scale-[1.02]' : 'bg-[var(--color-surface-2,#e2e8f0)] dark:bg-slate-700 text-[var(--color-text-dark)]/40'">
            Finalize Adoption 🐾
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
