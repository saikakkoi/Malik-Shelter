<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDialog } from '@/composables/useDialog'
import { getImgUrl } from '@/lib/utils'

const router = useRouter()
const { state: authState } = useAuth()
const dialog = useDialog()

const props = defineProps<{
  id?: string
}>()

const isEdit = !!props.id

const formData = reactive({
  name: '',
  species: 'Dog',
  breed: '',
  gender: 'MALE',
  age_months: 0,
  weight_kg: 0,
  bio: '',
  origin: '',
  is_sterilized: false,
  medical_summary: '',
  dietary_requirements: '',
  energy_level: '3',
  social_compatibility: [] as string[],
  training_level: 'Beginner',
  status: 'AVAILABLE',
  photos: [] as { file: File, preview: string, is_main: boolean }[]
})

const errors = reactive<Record<string, string>>({})
const activeSection = ref(1)
const isSubmitting = ref(false)
const isLoading = ref(isEdit)

const MAX_PHOTOS = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const files = Array.from(input.files)

  if (formData.photos.length + files.length > MAX_PHOTOS) {
    errors.photos = `You can only upload up to ${MAX_PHOTOS} photos.`
    return
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      errors.photos = `File "${file.name}" exceeds the 5MB limit.`
      continue
    }

    const preview = URL.createObjectURL(file)
    formData.photos.push({
      file,
      preview,
      is_main: formData.photos.length === 0 // First photo is main by default
    })
  }

  input.value = '' // Reset input
  if (errors.photos && formData.photos.length > 0) errors.photos = ''
}

function removePhoto(index: number) {
  const [removed] = formData.photos.splice(index, 1)
  if (removed) {
    URL.revokeObjectURL(removed.preview)

    // If we removed the main photo, set the first remaining one as main
    if (removed.is_main && formData.photos.length > 0) {
      const firstPhoto = formData.photos[0]
      if (firstPhoto) firstPhoto.is_main = true
    }
  }
}

function setMainPhoto(index: number) {
  formData.photos.forEach((p, i) => p.is_main = i === index)
}

const speciesOptions = ['Dog', 'Cat']
const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' }
]
const socialOptions = ['Humans', 'Dogs', 'Cats', 'Kids']
const energyOptions = ['1', '2', '3', '4', '5']

onMounted(async () => {
  if (isEdit && props.id) {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/animals/${props.id}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        Object.assign(formData, {
          ...data,
          social_compatibility: typeof data.social_compatibility === 'string'
            ? data.social_compatibility.split(',').filter(Boolean)
            : data.social_compatibility || [],
          photos: data.photos?.map((p: any) => ({
            ...p,
            preview: getImgUrl(p.photo_url), // Use getImgUrl to handle relative paths
            is_main: p.is_main,
            isExisting: true // Flag to distinguish from new uploads
          })) || []
        })
      }
    } catch (err) {
      console.error('Failed to fetch animal:', err)
      errors.global = 'Could not load existing animal data.'
    } finally {
      isLoading.value = false
    }
  }

  // Setup Scroll-Spy with more forgiving threshold
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id
      // If any part of the section is visible, and it's taking up a good chunk of the screen
      if (entry.isIntersecting && id) {
        activeSection.value = parseInt(id.split('-')[1] as string)
      }
    })
  }, { threshold: 0.2, rootMargin: '-10% 0px -40% 0px' })

  document.querySelectorAll('section[id^="section-"]').forEach(section => {
    observer.observe(section)
  })
})

function scrollToSection(index: number) {
  const el = document.getElementById(`section-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function validate() {
  errors.name = !formData.name ? 'Name is required' : ''
  errors.breed = !formData.breed ? 'Breed is required' : ''
  errors.age_months = formData.age_months === null || formData.age_months < 0 ? 'Invalid age' : ''
  errors.weight_kg = !formData.weight_kg || formData.weight_kg <= 0 ? 'Invalid weight' : ''

  return !Object.values(errors).some(e => e)
}

async function handleSubmit() {
  if (!validate()) {
    const firstError = Object.keys(errors).find(k => errors[k])
    if (firstError) {
      document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isSubmitting.value = true

  try {
    const fData = new FormData()

    // Add text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'photos') {
        if (Array.isArray(value)) {
          value.forEach(v => fData.append(`${key}[]`, String(v)))
        } else {
          fData.append(key, String(value))
        }
      }
    })

    // Add new photo files
    formData.photos.forEach((p) => {
      if (p.file) {
        fData.append('photos', p.file)
      }
    })

    const url = isEdit
      ? import.meta.env.VITE_API_BASE_URL + `/animals/${props.id}`
      : import.meta.env.VITE_API_BASE_URL + '/animals'

    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${authState.token}`
      },
      body: fData
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to save animal')
    }

    dialog.success(
      isEdit ? 'Friend updated successfully!' : 'New friend welcome home! 🐾',
      () => router.push('/staff/inventory')
    )
  } catch (err: any) {
    dialog.error(err.message)
  } finally {
    isSubmitting.value = false
  }
}
const formDescription = computed(() => {
  return isEdit ? 'Refresh their profile details' : 'Build a heartwarming profile for a new friend'
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button @click="router.back()" class="bg-primary/10 p-3 rounded-2xl hover:bg-primary/20 transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="text-accent group-hover:-translate-x-1 transition-transform">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div>
        <h1 class="text-4xl text-accent font-bold">{{ isEdit ? 'Update Friend' : 'New Animal Arrival' }}</h1>
        <p class="text-muted text-lg">{{ formDescription }}</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 space-y-4">
      <div class="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p class="text-muted font-medium">Loading your friend's profile...</p>
    </div>

    <div v-else class="lg:flex lg:gap-12 items-start relative">
      <!-- Sidebar Navigation (Desktop) -->
      <aside class="hidden lg:block lg:w-64 lg:sticky lg:top-8 space-y-6">
        <nav class="bg-[var(--color-surface,white)] rounded-[32px] p-6 shadow-soft border border-primary/10">
          <h3 class="text-sm font-bold text-accent uppercase tracking-widest mb-6 ml-1">Sections</h3>
          <ul class="space-y-2">
            <li v-for="(section, index) in ['Profile', 'Photos', 'Background', 'Medical', 'Personality']" :key="index">
              <button type="button" @click="scrollToSection(index + 1)"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group text-left"
                :class="activeSection === (index + 1) ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-muted hover:bg-primary/5 hover:text-accent'">
                <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                  :class="activeSection === (index + 1) ? 'bg-[var(--color-surface,white)] text-accent' : 'bg-primary/10 group-hover:bg-accent group-hover:text-white'">
                  {{ index + 1 }}
                </span>
                <span class="font-medium text-sm">{{ section }}</span>
              </button>
            </li>
          </ul>
        </nav>

        <div class="bg-primary/5 rounded-[32px] p-6 border border-primary/10">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">💡</span>
            <h4 class="font-bold text-dark text-sm">Quick Tip</h4>
          </div>
          <p class="text-xs text-muted leading-relaxed">
            Detailed bios and clear photos increase adoption rates by <span class="text-accent font-bold">40%</span>.
            Take your time!
          </p>
        </div>
      </aside>

      <!-- Main Form Content -->
      <form @submit.prevent="handleSubmit" class="flex-1 space-y-12 pb-32">
        <!-- Section 1: Basic Profile -->
        <section id="section-1"
          class="bg-[var(--color-surface,white)] rounded-[32px] p-8 shadow-soft border border-primary/10 space-y-6 scroll-mt-24 transition-all duration-500"
          :class="{ 'opacity-100 ring-4 ring-accent/10 border-accent/20': activeSection === 1, 'opacity-60': activeSection !== 1 }">
          <div class="flex items-center gap-3 border-b border-primary/10 pb-4">
            <div class="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-xl">🏠</div>
            <h2 class="text-2xl text-dark font-bold font-heading">Basic Profile</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">Name *</label>
              <input v-model="formData.name" id="name" type="text" placeholder="e.g. Buddy"
                class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-3 focus:border-accent focus:ring-0 transition-colors font-body text-[var(--color-text-dark)]"
                :class="{ 'border-rose-300': errors.name }" />
              <p v-if="errors.name" class="text-rose-500 text-xs ml-1">{{ errors.name }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">Species *</label>
              <select v-model="formData.species"
                class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-3 focus:border-accent focus:ring-0 transition-colors font-body appearance-none text-[var(--color-text-dark)]">
                <option v-for="opt in speciesOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">Breed *</label>
              <input v-model="formData.breed" id="breed" type="text" placeholder="e.g. Golden Retriever"
                class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-3 focus:border-accent focus:ring-0 transition-colors font-body text-[var(--color-text-dark)]"
                :class="{ 'border-rose-300': errors.breed }" />
              <p v-if="errors.breed" class="text-rose-500 text-xs ml-1">{{ errors.breed }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">Gender *</label>
              <div class="flex gap-4">
                <label v-for="opt in genderOptions" :key="opt.value"
                  class="flex-1 cursor-pointer flex items-center justify-center py-3 rounded-2xl border-2 transition-all font-body"
                  :class="formData.gender === opt.value ? 'bg-accent border-accent text-white' : 'bg-[var(--color-surface-2,#fef0ef)] border-primary/20 text-[var(--color-text-dark)]'">
                  <input type="radio" v-model="formData.gender" :value="opt.value" class="hidden" />
                  {{ opt.label }}
                </label>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">Age (Months) *</label>
              <input v-model.number="formData.age_months" id="age_months" type="number" min="0"
                class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-3 focus:border-accent focus:ring-0 transition-colors font-body text-[var(--color-text-dark)]"
                :class="{ 'border-rose-300': errors.age_months }" />
              <p v-if="errors.age_months" class="text-rose-500 text-xs ml-1">{{ errors.age_months }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">Weight (kg) *</label>
              <input v-model.number="formData.weight_kg" id="weight_kg" type="number" step="0.1" min="0"
                class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-3 focus:border-accent focus:ring-0 transition-colors font-body text-[var(--color-text-dark)]"
                :class="{ 'border-rose-300': errors.weight_kg }" />
              <p v-if="errors.weight_kg" class="text-rose-500 text-xs ml-1">{{ errors.weight_kg }}</p>
            </div>
          </div>
        </section>

        <!-- Section 2: Photos (Placeholder for Story 003) -->
        <section id="section-2"
          class="bg-[var(--color-surface,white)] rounded-[32px] p-8 shadow-soft border border-primary/10 space-y-6 scroll-mt-24 transition-all duration-500"
          :class="{ 'opacity-100 ring-4 ring-accent/10 border-accent/20': activeSection === 2, 'opacity-60': activeSection !== 2 }">
          <div class="flex items-center gap-3 border-b border-primary/10 pb-4">
            <div class="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-xl">📸</div>
            <h2 class="text-2xl text-dark font-bold font-heading">Photos</h2>
            <span class="ml-auto text-xs font-bold text-muted uppercase tracking-widest">{{ formData.photos.length }} /
              {{ MAX_PHOTOS }}</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <!-- Upload Button -->
            <label v-if="formData.photos.length < MAX_PHOTOS"
              class="aspect-square border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-accent transition-all group">
              <input type="file" multiple accept="image/*" class="hidden" @change="handleFileChange" />
              <div
                class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl group-hover:bg-accent group-hover:text-white transition-colors">
                +</div>
              <span class="text-[10px] font-bold text-muted uppercase mt-2">Add Photo</span>
            </label>

            <!-- Previews -->
            <div v-for="(photo, index) in formData.photos" :key="index"
              class="relative aspect-square rounded-2xl overflow-hidden group border-2 transition-all"
              :class="photo.is_main ? 'border-accent ring-2 ring-accent/20' : 'border-transparent'">
              <img :src="photo.preview" class="w-full h-full object-cover" />

              <!-- Main Badge -->
              <div v-if="photo.is_main"
                class="absolute top-2 left-2 bg-accent text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                Main
              </div>

              <!-- Overlay Controls -->
              <div
                class="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-2">
                <button v-if="!photo.is_main" type="button" @click="setMainPhoto(index)"
                  class="w-full py-1.5 bg-white/90 rounded-lg text-[10px] font-bold text-dark hover:bg-white transition-colors">
                  Set as Main
                </button>
                <button type="button" @click="removePhoto(index)"
                  class="w-full py-1.5 bg-rose-500/90 rounded-lg text-[10px] font-bold text-white hover:bg-rose-600 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <p v-if="errors.photos" class="text-rose-500 text-xs ml-1">{{ errors.photos }}</p>
          <p class="text-[10px] text-muted ml-1 italic">* Max 5 photos, 5MB each. First photo is set as main by default.
          </p>
        </section>

        <!-- Section 3: Background -->
        <section id="section-3"
          class="bg-[var(--color-surface,white)] rounded-[32px] p-8 shadow-soft border border-primary/10 space-y-6 scroll-mt-24 transition-all duration-500"
          :class="{ 'opacity-100 ring-4 ring-accent/10 border-accent/20': activeSection === 3, 'opacity-60': activeSection !== 3 }">
          <div class="flex items-center gap-3 border-b border-primary/10 pb-4">
            <div class="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-xl">📖</div>
            <h2 class="text-2xl text-dark font-bold font-heading">Background Story</h2>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">The Journey (Bio)</label>
              <textarea v-model="formData.bio" rows="4"
                placeholder="Tell us about their personality, history, and what makes them special..."
                class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-4 focus:border-accent focus:ring-0 transition-colors font-body resize-none text-[var(--color-text-dark)]"></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">Origin (Free-text)</label>
              <input v-model="formData.origin" type="text"
                placeholder="e.g. Rescued from street in Downtown, or Surrendered by previous owner"
                class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-3 focus:border-accent focus:ring-0 transition-colors font-body text-[var(--color-text-dark)]" />
            </div>
          </div>
        </section>

        <!-- Section 4: Medical -->
        <section id="section-4"
          class="bg-[var(--color-surface,white)] rounded-[32px] p-8 shadow-soft border border-primary/10 space-y-6 scroll-mt-24 transition-all duration-500"
          :class="{ 'opacity-100 ring-4 ring-accent/10 border-accent/20': activeSection === 4, 'opacity-60': activeSection !== 4 }">
          <div class="flex items-center gap-3 border-b border-primary/10 pb-4">
            <div class="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-xl">🩺</div>
            <h2 class="text-2xl text-dark font-bold font-heading">Medical Info</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-[var(--color-surface-2,#fef0ef)] rounded-2xl border-2 border-primary/20">
                <label class="text-sm font-semibold text-dark">Sterilized?</label>
                <button type="button" @click="formData.is_sterilized = !formData.is_sterilized"
                  class="w-14 h-8 rounded-full transition-colors relative"
                  :class="formData.is_sterilized ? 'bg-accent' : 'bg-primary/30'">
                  <div class="w-6 h-6 bg-white rounded-full absolute top-1 transition-all"
                    :class="formData.is_sterilized ? 'left-7' : 'left-1'"></div>
                </button>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-dark ml-1">Dietary Requirements</label>
                <input v-model="formData.dietary_requirements" type="text" placeholder="e.g. Grain-free diet"
                  class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-3 focus:border-accent focus:ring-0 transition-colors font-body text-[var(--color-text-dark)]" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-dark ml-1">Medical Summary</label>
              <textarea v-model="formData.medical_summary" rows="4"
                placeholder="Note any vaccination status, ongoing treatments, or allergies..."
                class="w-full bg-[var(--color-surface-2,#fef0ef)] border-2 border-primary/20 rounded-2xl px-5 py-4 focus:border-accent focus:ring-0 transition-colors font-body resize-none text-[var(--color-text-dark)]"></textarea>
            </div>
          </div>
        </section>

        <!-- Section 5: Personality -->
        <section id="section-5"
          class="bg-[var(--color-surface,white)] rounded-[32px] p-8 shadow-soft border border-primary/10 space-y-6 scroll-mt-24 transition-all duration-500"
          :class="{ 'opacity-100 ring-4 ring-accent/10 border-accent/20': activeSection === 5, 'opacity-60': activeSection !== 5 }">
          <div class="flex items-center gap-3 border-b border-primary/10 pb-4">
            <div class="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-xl">✨</div>
            <h2 class="text-2xl text-dark font-bold font-heading">Vibe & Personality</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="space-y-3">
                <label class="text-sm font-semibold text-dark ml-1">Energy Level (1-5)</label>
                <div class="flex gap-2">
                  <button v-for="lvl in energyOptions" :key="lvl" type="button" @click="formData.energy_level = lvl"
                    class="w-11 h-11 rounded-full border-2 font-bold transition-all flex items-center justify-center"
                    :class="formData.energy_level === lvl ? 'bg-accent border-accent text-white shadow-md shadow-accent/20 scale-110' : 'bg-[var(--color-surface-2,#fef0ef)] border-primary/20 text-muted'">
                    {{ lvl }}
                  </button>
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-sm font-semibold text-dark ml-1">Training Level</label>
                <div class="grid grid-cols-2 gap-2">
                  <button v-for="lvl in ['Beginner', 'Intermediate', 'Advanced']" :key="lvl" type="button"
                    @click="formData.training_level = lvl"
                    class="py-2 px-4 rounded-xl border-2 transition-all text-sm font-medium"
                    :class="formData.training_level === lvl ? 'bg-primary border-primary text-white' : 'bg-[var(--color-surface-2,#fef0ef)] border-primary/20 text-[var(--color-text-dark)]'">
                    {{ lvl }}
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-sm font-semibold text-dark ml-1">Social Compatibility</label>
              <div class="grid grid-cols-2 gap-3">
                <label v-for="opt in socialOptions" :key="opt"
                  class="flex items-center gap-3 p-3 bg-[var(--color-surface-2,#fef0ef)] rounded-2xl border-2 border-primary/20 cursor-pointer transition-colors"
                  :class="{ 'border-accent bg-accent/5': formData.social_compatibility.includes(opt) }">
                  <input type="checkbox" :value="opt" v-model="formData.social_compatibility"
                    class="w-5 h-5 rounded-md border-primary/30 text-accent focus:ring-accent" />
                  <span class="text-sm font-medium text-dark">{{ opt }}</span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>

    <!-- Floating Action Footer -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 pointer-events-none z-50">
      <div
        class="bg-[var(--color-surface,white)]/80 backdrop-blur-md rounded-[32px] p-4 shadow-xl border border-primary/10 flex justify-between items-center pointer-events-auto">
        <button type="button" @click="router.back()"
          class="px-8 py-3 rounded-2xl font-bold text-muted hover:bg-primary/10 transition-colors font-heading">
          Cancel
        </button>

        <button @click="handleSubmit" :disabled="isSubmitting"
          class="bg-accent text-white px-10 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-accent/20 font-heading disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2">
          <span v-if="isSubmitting"
            class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ isSubmitting ? 'Saving...' : (isEdit ? 'Update Profile' : 'Save Arrival 🐾') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0px 4px 20px rgba(196, 206, 161, 0.15);
}
</style>
