<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PetCard from '@/components/PetCard.vue'
import PetGallery from '@/components/PetGallery.vue'
import TraitBadge from '@/components/ui/TraitBadge.vue'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'
import { useToast } from '@/composables/useToast'
import VisitRequestModal from '@/components/Adoption/VisitRequestModal.vue'

interface Animal {
  id: string
  name: string
  species: string
  breed: string
  gender: string
  age_months: number
  status: string
  bio: string
  weight_kg: number
  energy_level: string
  is_sterilized: boolean
  medical_summary: string
  dietary_requirements: string
  origin: string
  photos: { photo_url: string; is_main: boolean }[]
  recommendations?: Animal[]
}

const route = useRoute()
const router = useRouter()
const animal = ref<Animal | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const { isAuthenticated } = useAuth()
const { profile, fetchProfile } = useProfile()
const { error: errorToast } = useToast()

const isVisitModalOpen = ref(false)
const API_BASE = import.meta.env.VITE_API_BASE_URL

const handleVisitRequest = async () => {
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }
  
  await fetchProfile()
  if (!profile.value || profile.value.status !== 'COMPLETED') {
    errorToast('Please complete your adopter profile before scheduling a visit.')
    router.push('/profile')
    return
  }
  
  isVisitModalOpen.value = true
}

async function fetchAnimal() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/animals/${route.params.id}`)
    if (!res.ok) throw new Error('Failed to fetch pet details')
    animal.value = await res.json()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, fetchAnimal)
onMounted(fetchAnimal)
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 min-h-screen">
    <div v-if="loading" class="py-24">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="text-center py-24">
      <p class="text-red-500 text-xl font-bold mb-4">Oops! {{ error }}</p>
      <router-link to="/" class="btn-primary">Back to Search</router-link>
    </div>

    <div v-else-if="animal" class="space-y-12 animate-in fade-in duration-500">
      <router-link to="/" class="text-muted hover:text-accent transition-colors flex items-center gap-2 text-lg">
        ← Back to Browse
      </router-link>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <!-- Gallery -->
        <PetGallery :photos="animal.photos" />

        <!-- Info -->
        <div class="space-y-8">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <TraitBadge variant="highlight" v-if="animal.status === 'AVAILABLE'">Available for Adoption</TraitBadge>
              <TraitBadge variant="secondary" v-else>{{ animal.status }}</TraitBadge>
            </div>
            <h1 class="text-5xl text-accent mb-2">{{ animal.name }}</h1>
            <p class="text-2xl text-muted">{{ animal.breed }} • {{ animal.gender }}</p>
          </div>

          <!-- Traits -->
          <div class="flex flex-wrap gap-2">
            <TraitBadge variant="primary">{{ animal.energy_level }} Energy</TraitBadge>
            <TraitBadge variant="primary" v-if="animal.is_sterilized">Sterilized</TraitBadge>
            <TraitBadge variant="primary">{{ animal.weight_kg }} kg</TraitBadge>
          </div>

          <div class="bg-white dark:bg-[#252320] p-8 rounded-[30px] shadow-soft space-y-6 transition-colors duration-300">
            <div class="space-y-2">
              <h3 class="text-xl font-bold text-accent">About {{ animal.name }}</h3>
              <p class="text-lg leading-relaxed text-dark">{{ animal.bio }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-primary/20 dark:border-[#3a3730]">
              <div v-if="animal.medical_summary">
                <p class="text-sm text-muted mb-1">Medical Summary</p>
                <p class="font-bold text-dark">{{ animal.medical_summary }}</p>
              </div>
              <div v-if="animal.dietary_requirements">
                <p class="text-sm text-muted mb-1">Dietary Needs</p>
                <p class="font-bold text-dark">{{ animal.dietary_requirements }}</p>
              </div>
              <div>
                <p class="text-sm text-muted mb-1">Origin</p>
                <p class="font-bold text-dark">{{ animal.origin }}</p>
              </div>
              <div>
                <p class="text-sm text-muted mb-1">Age</p>
                <p class="font-bold text-dark">{{ animal.age_months }} months</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <button 
              @click="handleVisitRequest"
              class="btn-primary w-full text-xl py-6 rounded-[20px] shadow-lg hover:-translate-y-1 transition-transform flex items-center justify-center gap-2"
            >
              Apply & Schedule Visit 🐾
            </button>
            <p class="text-center text-sm text-muted">A completed profile is required to apply.</p>
          </div>
        </div>
      </div>

      <!-- Visit Request Modal -->
      <VisitRequestModal 
        :is-open="isVisitModalOpen" 
        :animal="animal" 
        @close="isVisitModalOpen = false"
      />

      <!-- Recommendations -->
      <section v-if="animal.recommendations?.length" class="pt-12 border-t border-primary/20 dark:border-[#3a3730]">
        <h2 class="text-3xl text-accent mb-8">Meet some other {{ animal.species }}s</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <PetCard v-for="rec in animal.recommendations" :key="rec.id" :animal="rec" />
        </div>
      </section>
    </div>
  </div>
</template>
