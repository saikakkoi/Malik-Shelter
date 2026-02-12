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
  resident_count: 1,
  has_children: false,
  allergy_details: '',
  existing_pets: ''
})

const errors = reactive({
  resident_count: ''
})

onMounted(() => {
  if (props.initialData) {
    form.resident_count = props.initialData.resident_count || 1
    form.has_children = props.initialData.has_children || false
    form.allergy_details = props.initialData.allergy_details || ''
    form.existing_pets = props.initialData.existing_pets || ''
  }
})

const validate = () => {
  let valid = true
  errors.resident_count = form.resident_count < 1 ? 'Resident count must be at least 1' : ''
  if (errors.resident_count) valid = false
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
      <h2 class="text-2xl font-bold text-text-dark mb-2">Step 3: Household & Members</h2>
      <p class="text-text-dark/60 font-form">Tell us about who lives in your home.</p>
    </div>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-bold text-text-dark mb-1">Total Resident Count</label>
          <input 
            v-model.number="form.resident_count"
            type="number"
            min="1"
            class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors"
            :class="{ 'border-red-400': errors.resident_count }"
          />
          <p v-if="errors.resident_count" class="text-red-400 text-xs mt-1">{{ errors.resident_count }}</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-text-dark mb-1">Are there children in the home?</label>
          <div class="flex gap-4 pt-1">
            <label class="flex items-center gap-2 cursor-pointer font-form text-sm">
              <input type="radio" v-model="form.has_children" :value="true" class="accent-primary w-4 h-4" />
              Yes
            </label>
            <label class="flex items-center gap-2 cursor-pointer font-form text-sm">
              <input type="radio" v-model="form.has_children" :value="false" class="accent-primary w-4 h-4" />
              No
            </label>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Allergy Details</label>
        <textarea 
          v-model="form.allergy_details"
          rows="2"
          placeholder="Does anyone have pet allergies?"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors resize-none"
        ></textarea>
        <p class="text-[10px] text-text-dark/40 font-form mt-1">Leave blank if no allergies.</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Existing Pets</label>
        <textarea 
          v-model="form.existing_pets"
          rows="3"
          placeholder="List species, ages, and temperaments (e.g., 1 cat, 3 years old, friendly)"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors resize-none"
        ></textarea>
        <p class="text-[10px] text-text-dark/40 font-form mt-1">Leave blank if no other pets.</p>
      </div>
    </div>

    <div class="pt-6 flex justify-end">
      <button 
        @click="handleNext" 
        :disabled="loading"
        class="btn-primary"
      >
        {{ loading ? 'Saving...' : 'Next: Experience & References' }}
      </button>
    </div>
  </div>
</template>
