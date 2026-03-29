<script setup lang="ts">
import { reactive, onMounted } from 'vue'

const props = defineProps<{
  initialData?: any
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'next', data: any): void
}>()

const form = reactive({
  ownership_history: '',
  vet_references: ''
})

const errors = reactive({
  ownership_history: '',
  vet_references: ''
})

onMounted(() => {
  if (props.initialData) {
    form.ownership_history = props.initialData.ownership_history || ''
    form.vet_references = props.initialData.vet_references || ''
  }
})

const validate = () => {
  let valid = true
  errors.ownership_history = !form.ownership_history ? 'Ownership history is required' : ''
  // Vet references are optional but recommended in some cases, 
  // but let's stick to BR-1 in STORY-010: "Ownership history narrative is required."
  if (errors.ownership_history) valid = false
  return valid
}

const handleNext = () => {
  if (validate()) {
    emit('next', { ...form })
  }
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-text-dark mb-2">Step 4: Experience & References</h2>
      <p class="text-text-dark/60 font-form">Tell us about your history with pets and provide a veterinarian reference if available.</p>
    </div>

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Ownership History</label>
        <textarea 
          v-model="form.ownership_history"
          rows="5"
          placeholder="Please describe your previous experience with pets (species, years, etc.)"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors resize-none bg-[var(--color-surface-2,white)] text-[var(--color-text-dark)]"
          :class="{ 'border-red-400': errors.ownership_history }"
        ></textarea>
        <p v-if="errors.ownership_history" class="text-red-400 text-xs mt-1">{{ errors.ownership_history }}</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Veterinarian References (Optional)</label>
        <textarea 
          v-model="form.vet_references"
          rows="3"
          placeholder="Name of clinic, Vet name, and phone number"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors resize-none bg-[var(--color-surface-2,white)] text-[var(--color-text-dark)]"
        ></textarea>
        <p class="text-[10px] text-text-dark/40 font-form mt-1 italic">This information will be encrypted for your privacy.</p>
      </div>
    </div>

    <div class="pt-6 flex justify-end">
      <button 
        @click="handleNext" 
        :disabled="loading"
        class="btn-primary"
      >
        {{ loading ? 'Saving...' : 'Next: Lifestyle & Activity' }}
      </button>
    </div>
  </div>
</template>
