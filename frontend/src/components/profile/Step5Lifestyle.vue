<script setup lang="ts">
import { reactive, onMounted } from 'vue'

const props = defineProps<{
  initialData?: any
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: any): void
}>()

const form = reactive({
  time_pet_alone: '',
  activity_level: '',
  future_plans: ''
})

const errors = reactive({
  time_pet_alone: '',
  activity_level: ''
})

onMounted(() => {
  if (props.initialData) {
    form.time_pet_alone = props.initialData.time_pet_alone || ''
    form.activity_level = props.initialData.activity_level || ''
    form.future_plans = props.initialData.future_plans || ''
  }
})

const validate = () => {
  let valid = true
  errors.time_pet_alone = !form.time_pet_alone ? 'Selection is required' : ''
  errors.activity_level = !form.activity_level ? 'Selection is required' : ''

  if (errors.time_pet_alone || errors.activity_level) {
    valid = false
  }
  return valid
}

const handleSubmit = () => {
  if (validate()) {
    emit('submit', { ...form })
  }
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-text-dark mb-2">Step 5: Lifestyle & Future Plans</h2>
      <p class="text-text-dark/60 font-form">The final step! Tell us about your daily routine.</p>
    </div>

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">How much time will the pet spend alone daily?</label>
        <select v-model="form.time_pet_alone"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form bg-[var(--color-surface,white)] text-[var(--color-text-dark)] transition-colors"
          :class="{ 'border-red-400': errors.time_pet_alone }">
          <option value="" disabled>How much time will the pet spend alone daily?</option>
          <option value="Less than 2 hours">Less than 2 hours</option>
          <option value="2-4 hours">2-4 hours</option>
          <option value="4-8 hours">4-8 hours</option>
          <option value="More than 8 hours">More than 8 hours</option>
        </select>
        <p v-if="errors.time_pet_alone" class="text-red-400 text-xs mt-1">{{ errors.time_pet_alone }}</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Your Activity Level</label>
        <div class="flex flex-wrap gap-4 pt-1">
          <label v-for="level in ['Low', 'Medium', 'High']" :key="level"
            class="flex items-center gap-2 cursor-pointer font-form text-sm border px-4 py-2 rounded-btn transition-colors"
            :class="form.activity_level === level ? 'bg-primary text-white border-primary' : 'bg-[var(--color-surface,white)] text-text-dark/60 border-primary/20'">
            <input type="radio" v-model="form.activity_level" :value="level" class="hidden" />
            {{ level }}
          </label>
        </div>
        <p v-if="errors.activity_level" class="text-red-400 text-xs mt-1">{{ errors.activity_level }}</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Future Plans (Optional)</label>
        <textarea v-model="form.future_plans" rows="3"
          placeholder="Any planned moves, lifestyle changes, or major events in the next year?"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors resize-none bg-[var(--color-surface-2,white)] text-[var(--color-text-dark)]"></textarea>
      </div>
    </div>

    <div class="pt-6 flex justify-end">
      <button @click="handleSubmit" :disabled="loading" class="btn-primary">
        {{ loading ? 'Submitting...' : 'Submit Profile' }}
      </button>
    </div>
  </div>
</template>
