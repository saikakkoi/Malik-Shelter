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
  full_name: '',
  phone: '',
  address: '',
  occupation: ''
})

const errors = reactive({
  full_name: '',
  phone: '',
  address: '',
  occupation: ''
})

onMounted(() => {
  if (props.initialData) {
    form.full_name = props.initialData.full_name || ''
    form.phone = props.initialData.phone || ''
    form.address = props.initialData.address || ''
    form.occupation = props.initialData.occupation || ''
  }
})

const validate = () => {
  let valid = true
  errors.full_name = !form.full_name ? 'Full Name is required' : ''
  errors.phone = !form.phone ? 'Phone is required' : ''
  errors.address = !form.address ? 'Address is required' : ''
  errors.occupation = !form.occupation ? 'Occupation is required' : ''

  if (errors.full_name || errors.phone || errors.address || errors.occupation) {
    valid = false
  }
  return valid
}

const handleNext = () => {
  if (validate()) {
    emit('next', { ...form })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-text-dark mb-2">Step 1: Identity & Contact</h2>
      <p class="text-text-dark/60 font-form">Please provide your basic contact details.</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Full Name</label>
        <input v-model="form.full_name" type="text" placeholder="Full Name"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors bg-[var(--color-surface-2,white)] text-[var(--color-text-dark)]"
          :class="{ 'border-red-400': errors.full_name }" />
        <p v-if="errors.full_name" class="text-red-400 text-xs mt-1">{{ errors.full_name }}</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Phone Number</label>
        <input v-model="form.phone" type="tel" placeholder="Phone Number"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors bg-[var(--color-surface-2,white)] text-[var(--color-text-dark)]"
          :class="{ 'border-red-400': errors.phone }" />
        <p v-if="errors.phone" class="text-red-400 text-xs mt-1">{{ errors.phone }}</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Physical Address</label>
        <textarea v-model="form.address" rows="3" placeholder="Physical Address"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors resize-none"
          :class="{ 'border-red-400': errors.address }"></textarea>
        <p v-if="errors.address" class="text-red-400 text-xs mt-1">{{ errors.address }}</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Occupation</label>
        <input v-model="form.occupation" type="text" placeholder="Software Engineer"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form transition-colors bg-[var(--color-surface-2,white)] text-[var(--color-text-dark)]"
          :class="{ 'border-red-400': errors.occupation }" />
        <p v-if="errors.occupation" class="text-red-400 text-xs mt-1">{{ errors.occupation }}</p>
      </div>
    </div>

    <div class="pt-6 flex justify-end">
      <button @click="handleNext" :disabled="loading" class="btn-primary">
        {{ loading ? 'Saving...' : 'Next: Housing & Environment' }}
      </button>
    </div>
  </div>
</template>
