<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const props = defineProps<{
  initialData?: any
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'next', data: any): void
  (e: 'upload-photo', file: File): void
  (e: 'delete-photo', photoId: string): void
}>()

const form = reactive({
  residence_type: '',
  ownership_status: '',
  outdoor_area: ''
})

const errors = reactive({
  residence_type: '',
  ownership_status: '',
  outdoor_area: '',
  photos: ''
})

const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (props.initialData) {
    form.residence_type = props.initialData.residence_type || ''
    form.ownership_status = props.initialData.ownership_status || ''
    form.outdoor_area = props.initialData.outdoor_area || ''
  }
})

const validate = () => {
  let valid = true
  errors.residence_type = !form.residence_type ? 'Residence type is required' : ''
  errors.ownership_status = !form.ownership_status ? 'Ownership status is required' : ''
  errors.outdoor_area = !form.outdoor_area ? 'Outdoor area info is required' : ''

  const photoCount = props.initialData?.home_photos?.length || 0
  errors.photos = photoCount < 2 ? 'At least 2 photos are required for completion' : ''

  if (errors.residence_type || errors.ownership_status || errors.outdoor_area) {
    valid = false
  }
  return valid
}

const handleNext = () => {
  if (validate()) {
    emit('next', { ...form })
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('upload-photo', file)
    target.value = '' // Reset
  }
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-text-dark mb-2">Step 2: Housing & Environment</h2>
      <p class="text-text-dark/60 font-form">Tell us about the environment where the pet will live.</p>
    </div>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-bold text-text-dark mb-1">Residence Type</label>
          <select v-model="form.residence_type"
            class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form bg-[var(--color-surface,white)] text-[var(--color-text-dark)] transition-colors"
            :class="{ 'border-red-400': errors.residence_type }">
            <option value="" disabled>Residence Type</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Other">Other</option>
          </select>
          <p v-if="errors.residence_type" class="text-red-400 text-xs mt-1">{{ errors.residence_type }}</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-text-dark mb-1">Ownership Status</label>
          <div class="flex gap-4 pt-1">
            <label class="flex items-center gap-2 cursor-pointer font-form text-sm">
              <input type="radio" v-model="form.ownership_status" value="OWN" class="accent-primary w-4 h-4" />
              Own
            </label>
            <label class="flex items-center gap-2 cursor-pointer font-form text-sm">
              <input type="radio" v-model="form.ownership_status" value="RENT" class="accent-primary w-4 h-4" />
              Rent
            </label>
          </div>
          <p v-if="errors.ownership_status" class="text-red-400 text-xs mt-1">{{ errors.ownership_status }}</p>
        </div>
      </div>

      <div v-if="form.ownership_status === 'RENT'"
        class="bg-highlight/20 p-4 rounded-btn border border-highlight border-dashed">
        <p class="text-sm text-text-dark font-form">
          <span class="font-bold">Note:</span> If you rent, we may require a landlord's permission letter during the
          visit request process.
        </p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-1">Outdoor Area</label>
        <select v-model="form.outdoor_area"
          class="w-full px-4 py-2 rounded-btn border border-primary/20 focus:border-primary outline-none font-form bg-[var(--color-surface,white)] text-[var(--color-text-dark)] transition-colors"
          :class="{ 'border-red-400': errors.outdoor_area }">
          <option value="" disabled>Outdoor Area</option>
          <option value="Fenced Garden">Fenced Garden</option>
          <option value="Unfenced Garden">Unfenced Garden</option>
          <option value="Balcony">Balcony</option>
          <option value="No Private Outdoor Area">No Private Outdoor Area</option>
        </select>
        <p v-if="errors.outdoor_area" class="text-red-400 text-xs mt-1">{{ errors.outdoor_area }}</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-text-dark mb-3">Residence Photos (Min 2 recommended)</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="photo in initialData?.home_photos" :key="photo.id"
            class="relative aspect-square rounded-card overflow-hidden group shadow-soft">
            <img :src="API_BASE_URL + photo.photo_url" class="w-full h-full object-cover" />
            <button @click="emit('delete-photo', photo.id)"
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <button @click="triggerFileUpload" :disabled="loading"
            class="aspect-square rounded-card border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors group">
            <div class="bg-primary/10 rounded-full p-3 group-hover:bg-primary/20 transition-colors">
              <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <div v-else class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
            <span class="text-xs font-bold text-primary/60">Add Photo</span>
          </button>
          <input ref="fileInput" type="file" @change="onFileChange" accept="image/*" class="hidden" />
        </div>
        <p v-if="errors.photos" class="text-accent text-xs mt-3 font-bold">{{ errors.photos }}</p>
      </div>
    </div>

    <div class="pt-6 flex justify-end">
      <button @click="handleNext" :disabled="loading" class="btn-primary">
        {{ loading ? 'Saving...' : 'Next: Household & Allergies' }}
      </button>
    </div>
  </div>
</template>
