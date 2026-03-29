<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { X, Calendar as CalendarIcon, Clock, ChevronRight, Loader2 } from 'lucide-vue-next'
import { useAdoption } from '@/composables/useAdoption'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  isOpen: boolean
  animal: { id: string, name: string }
}>()

const emit = defineEmits(['close', 'success'])

const { state, getAvailableSlots, createRequest } = useAdoption()
const { success, error } = useToast()

// Helper to get local YYYY-MM-DD string
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectedDate = ref<string>(getLocalDateString(new Date()))
const selectedSlotId = ref<string | null>(null)
const submitting = ref(false)

const fetchSlots = async () => {
  if (props.animal) {
    await getAvailableSlots(selectedDate.value)
  }
}

watch(selectedDate, fetchSlots)
onMounted(fetchSlots)

const handleConfirm = async () => {
  if (!selectedSlotId.value || !props.animal) return

  submitting.value = true
  try {
    await createRequest({
      animal_id: props.animal.id,
      slot_id: selectedSlotId.value,
      date: selectedDate.value
    })
    success(`Visit with ${props.animal.name} scheduled!`)
    emit('success')
    emit('close')
  } catch (e: any) {
    error(e.message)
  } finally {
    submitting.value = false
  }
}

const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Generate next 7 days for the "quick date" picker
const nextDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() + i + 1)
  return {
    label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    value: getLocalDateString(d)
  }
})
</script>

<template>
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-dark/40 backdrop-blur-sm">
      <div
        class="bg-[var(--color-surface,white)] rounded-[40px] shadow-2xl border border-primary/10 max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-300">
        <!-- Close Button -->
        <button @click="$emit('close')"
          class="absolute top-6 right-6 p-2 hover:bg-primary/5 rounded-2xl transition-colors z-10">
          <X class="w-5 h-5 text-muted" />
        </button>

        <div class="p-10">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-accent font-heading mb-2">Schedule a Visit</h2>
            <p class="text-muted">Choose a time to meet <strong>{{ animal.name }}</strong></p>
          </div>

          <!-- Date Selection -->
          <div class="space-y-4 mb-8">
            <label class="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon class="w-4 h-4" /> Select Date
            </label>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button v-for="day in nextDays" :key="day.value" @click="selectedDate = day.value"
                class="flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all text-center min-w-[80px]" :class="selectedDate === day.value
                  ? 'border-accent bg-accent text-white shadow-lg shadow-accent/20'
                  : 'border-primary/10 hover:border-primary/30 text-muted'">
                <span class="block text-xs font-bold">{{ day.label.split(' ')[0] }}</span>
                <span class="block text-lg font-bold">{{ day.label.split(' ')[1] }}</span>
              </button>
            </div>
          </div>

          <!-- Slot Selection -->
          <div class="space-y-4 mb-10">
            <label class="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2">
              <Clock class="w-4 h-4" /> Available Slots
            </label>

            <div class="relative py-2">
              <!-- Subtle Loader -->
              <div v-if="state.loading"
                class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-10 transition-opacity duration-300">
                <Loader2 class="w-8 h-8 animate-spin text-accent" />
              </div>

              <!-- Content with dimming when loading -->
              <div :class="{ 'opacity-30': state.loading }" class="transition-opacity duration-300">
                <div v-if="state.availableSlots.length"
                  class="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2">
                  <button v-for="slot in state.availableSlots" :key="slot.id" @click="selectedSlotId = slot.id"
                    class="w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all group"
                    :class="selectedSlotId === slot.id
                      ? 'border-accent bg-accent/5'
                      : 'border-primary/5 hover:border-primary/20'">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                        :class="selectedSlotId === slot.id ? 'bg-accent text-white' : 'bg-primary/5 text-primary group-hover:bg-primary/10'">
                        <Clock class="w-5 h-5" />
                      </div>
                      <span class="font-bold text-dark">{{ formatTime(slot.start_time) }} - {{ formatTime(slot.end_time)
                      }}</span>
                    </div>
                    <div v-if="selectedSlotId === slot.id"
                      class="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white">
                      <ChevronRight class="w-4 h-4" />
                    </div>
                  </button>
                </div>

                <div v-else class="py-10 text-center bg-primary/5 rounded-3xl border border-dashed border-primary/20">
                  <p class="text-muted italic">No slots available for this date.</p>
                </div>
              </div>
            </div>
          </div>

          <button @click="handleConfirm" :disabled="!selectedSlotId || submitting"
            class="w-full py-5 rounded-[24px] font-bold text-xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="selectedSlotId ? 'bg-accent text-white shadow-accent/30 hover:scale-[1.02]' : 'bg-muted/20 text-muted'">
            <Loader2 v-if="submitting" class="w-6 h-6 animate-spin" />
            <span v-else>Confirm Visit 🐾</span>
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
