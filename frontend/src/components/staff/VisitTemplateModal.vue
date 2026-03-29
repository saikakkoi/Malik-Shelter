<script setup lang="ts">
import { ref } from 'vue'
import { X, Clock, Calendar, Users } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const form = ref({
  day_of_week: 'ALL',
  start_time: '09:00:00',
  end_time: '10:00:00',
  capacity_per_slot: 1
})

const days = [
  { label: 'Every Day', value: 'ALL' },
  { label: 'Monday', value: 'MONDAY' },
  { label: 'Tuesday', value: 'TUESDAY' },
  { label: 'Wednesday', value: 'WEDNESDAY' },
  { label: 'Thursday', value: 'THURSDAY' },
  { label: 'Friday', value: 'FRIDAY' },
  { label: 'Saturday', value: 'SATURDAY' },
  { label: 'Sunday', value: 'SUNDAY' }
]

const handleSubmit = () => {
  emit('submit', { ...form.value })
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-dark/40 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-[var(--color-surface,white)] w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-black text-dark tracking-tight">Add Visit Slot</h2>
            <p class="text-muted text-sm mt-1">Create a recurring template for daily visits.</p>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-primary/5 rounded-full transition-colors text-muted">
            <X class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Day of Week -->
          <div>
            <label class="block text-sm font-bold text-dark mb-2 flex items-center gap-2">
              <Calendar class="w-4 h-4 text-primary" /> Day of Week
            </label>
            <select 
              v-model="form.day_of_week"
              class="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-[var(--color-text-dark)] appearance-none"
            >
              <option v-for="day in days" :key="day.value" :value="day.value">{{ day.label }}</option>
            </select>
          </div>

          <!-- Times -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-dark mb-2 flex items-center gap-2">
                <Clock class="w-4 h-4 text-primary" /> Start Time
              </label>
              <input 
                v-model="form.start_time"
                type="time"
                step="1"
                class="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-[var(--color-text-dark)]"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-dark mb-2 flex items-center gap-2">
                <Clock class="w-4 h-4 text-primary" /> End Time
              </label>
              <input 
                v-model="form.end_time"
                type="time"
                step="1"
                class="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-[var(--color-text-dark)]"
                required
              />
            </div>
          </div>

          <!-- Capacity -->
          <div>
            <label class="block text-sm font-bold text-dark mb-2 flex items-center gap-2">
              <Users class="w-4 h-4 text-primary" /> Capacity
            </label>
            <input 
              v-model.number="form.capacity_per_slot"
              type="number"
              min="1"
              class="w-full bg-primary/5 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-dark"
              required
            />
          </div>

          <!-- Submit -->
          <button 
            type="submit"
            class="w-full bg-accent text-white font-black py-5 rounded-[24px] shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            Create Template
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
