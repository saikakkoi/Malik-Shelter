<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProfile } from '@/composables/useProfile'
import { useAdoption } from '@/composables/useAdoption'
import { useDialog } from '@/composables/useDialog'
import { useToast } from '@/composables/useToast'

interface Animal {
  id: string
  name: string
  species: string
  breed: string
  gender: string
  age_months: number
  status: string
  photos: { photo_url: string; is_main: boolean }[]
}

import { getImgUrl } from '@/lib/utils'
import VisitCard from '@/components/Adoption/VisitCard.vue'

const router = useRouter()
const { profile, loading, error, fetchProfile } = useProfile()
const { state: adoptionState, getMyRequests, cancelRequest } = useAdoption()
const dialog = useDialog()
const toast = useToast()

const recommendedPets = ref<Animal[]>([])
const loadingPets = ref(false)
const cancelling = ref(false)

onMounted(async () => {
  await Promise.all([
    fetchProfile(),
    getMyRequests(),
    fetchRecommendedPets()
  ])
})

const fetchRecommendedPets = async () => {
  loadingPets.value = true
  try {
    const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/animals?limit=3&status=AVAILABLE')
    if (!res.ok) throw new Error('Failed to fetch pets')
    const data = await res.json()
    recommendedPets.value = data.items || []
  } catch (e) {
    console.error('Error fetching recommended pets:', e)
  } finally {
    loadingPets.value = false
  }
}

const startWizard = () => {
  router.push('/profile/wizard')
}

const steps = [
  { id: 1, name: 'IDENTITY', fields: ['full_name', 'phone', 'address'] },
  { id: 2, name: 'HOUSING', fields: ['residence_type', 'ownership_status', 'outdoor_area', 'home_photos (min 2)'] },
  { id: 3, name: 'HOUSEHOLD', fields: ['resident_count'] },
  { id: 4, name: 'EXPERIENCE', fields: ['ownership_history', 'vet_references'] },
  { id: 5, name: 'LIFESTYLE', fields: ['time_pet_alone', 'activity_level', 'future_plans'] }
]

const isStepComplete = (stepFields: string[]) => {
  if (!profile.value?.meta?.missing_fields) return false
  return !stepFields.some(field => profile.value.meta.missing_fields.includes(field))
}

const goToStep = (stepId: number) => {
  router.push({ path: '/profile/wizard', query: { step: stepId } })
}

const goToPetDetail = (petId: string) => {
  router.push(`/animal/${petId}`)
}

const bookVisit = () => {
  router.push('/')
}

const handleCancelVisit = async (visitId: string) => {
  dialog.show({
    title: 'Cancel Visit?',
    message: 'Are you sure you want to cancel this visit? This action cannot be undone.',
    type: 'info',
    lottie: '/shiba-sad.lottie',
    confirmText: 'Yes, Cancel it',
    cancelText: 'Keep Visit',
    showCancelButton: true,
    onConfirm: async () => {
      cancelling.value = true
      try {
        const request = adoptionState.myRequests.find(r => r.bookings.some((b: any) => b.id === visitId))
        if (!request) throw new Error('Request not found')

        await cancelRequest(request.id)
        await getMyRequests()
        toast.success('Visit cancelled successfully.')
      } catch (e: any) {
        toast.error(e.message || 'Failed to cancel visit')
      } finally {
        cancelling.value = false
      }
    }
  })
}

const getDirections = () => {
  window.open('https://maps.google.com/?q=123+Rescue+Way+Pet+Valley+San+Francisco+CA+94103', '_blank')
}

const userName = computed(() => {
  return profile.value?.full_name?.split(' ')[0] || 'Friend'
})

const getMainPhoto = (animal: Animal) => {
  const photo = (animal.photos || []).find(p => p.is_main)?.photo_url
    || (animal.photos || [])[0]?.photo_url
  return getImgUrl(photo)
}

const getAgeDisplay = (ageMonths: number) => {
  if (ageMonths < 12) return `${ageMonths}m`
  return `${Math.floor(ageMonths / 12)}y`
}

// Find the next upcoming visit (earliest future date/time)
const nextUpcomingVisit = computed(() => {
  if (!adoptionState.myRequests || adoptionState.myRequests.length === 0) return null

  let nextVisit: any = null
  let earliestTime = Infinity

  for (const request of adoptionState.myRequests) {
    if (!request.bookings || request.bookings.length === 0) continue

    // Skip bookings if the parent request is rejected or cancelled
    if (request.status === 'REJECTED' || request.status === 'REJECTED_AUTO' || request.status === 'CANCELLED') continue

    for (const booking of request.bookings) {
      // Only show SCHEDULED or CONFIRMED bookings
      if (booking.status !== 'SCHEDULED' && booking.status !== 'CONFIRMED' && booking.status !== 'PENDING') continue

      const visitTime = new Date(booking.visit_slot.start_time || booking.visit_slot.date).getTime()

      // Find the earliest upcoming visit (future or very recent)
      if (visitTime < earliestTime) {
        earliestTime = visitTime
        nextVisit = {
          ...booking,
          adoption_request: {
            ...request,
            animal: request.animal
          }
        }
      }
    }
  }

  return nextVisit
})
</script>

<template>
  <div class="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-btn border border-red-200 text-red-700 max-w-4xl mx-auto">
      {{ error }}
      <button @click="fetchProfile" class="ml-4 font-bold underline">Retry</button>
    </div>

    <div v-else class="max-w-7xl mx-auto">
      <!-- Welcome Header -->
      <div class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-text-dark mb-2">
          Welcome back, {{ userName }}! 🐾
        </h1>
        <p class="text-lg text-text-dark/70 font-form">
          Everything is looking great. You're ready to meet your future best friend.
        </p>
      </div>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Profile Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Profile Card -->
          <div class="bg-[var(--color-surface,white)] rounded-card shadow-soft p-6 md:p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold text-text-dark">YOUR ADOPTER PROFILE</h2>
            </div>

            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-primary/20">
              <div class="flex-1 w-full">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-text-dark font-form">
                    STATUS:
                    <span :class="profile?.status === 'COMPLETED' ? 'text-primary' : 'text-accent'">
                      {{ profile?.status || 'NOT STARTED' }}
                    </span>
                  </span>
                  <span class="text-sm font-medium text-text-dark font-form">
                    {{ profile?.meta?.completion_percentage || 0 }}% COMPLETE
                  </span>
                </div>
                <div class="w-full bg-primary/20 rounded-full h-3 overflow-hidden">
                  <div class="bg-primary h-full transition-all duration-500"
                    :style="{ width: `${profile?.meta?.completion_percentage || 0}%` }"></div>
                </div>
              </div>
              <button @click="startWizard" class="btn-primary whitespace-nowrap">
                UPDATE PROFILE
              </button>
            </div>

            <p class="text-text-dark/70 mb-6 font-form leading-relaxed">
              Help us find the perfect match for you! A complete profile is required before you can request shelter
              visits.
              This information allows our staff to ensure animals are placed in suitable environments.
            </p>

            <!-- Step Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="step in steps" :key="step.id"
                class="bg-[var(--color-surface,white)] rounded-card shadow-sm p-4 border-b-4 transition-all hover:-translate-y-1 cursor-pointer"
                :class="isStepComplete(step.fields) ? 'border-primary' : 'border-accent/40'" @click="goToStep(step.id)">
                <div class="flex justify-between items-start mb-3">
                  <span class="bg-secondary/20 text-text-dark px-2 py-1 rounded-full text-xs font-bold font-form">
                    STEP {{ step.id }}
                  </span>
                  <div v-if="isStepComplete(step.fields)"
                    class="text-primary bg-primary/10 rounded-full p-1 leading-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <h3 class="text-lg font-bold mb-1">{{ step.name }}</h3>
                <p class="text-xs text-text-dark/60 font-form">
                  {{ isStepComplete(step.fields) ? 'Successfully completed' : 'Missing required information' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Cards -->
        <div class="space-y-6">
          <!-- Schedule Visit Card -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-text-dark px-2">Next Visit</h3>

            <div v-if="nextUpcomingVisit">
              <VisitCard :visit="nextUpcomingVisit" @cancel="handleCancelVisit" />
            </div>

            <!-- Empty State -->
            <div v-else class="bg-[var(--color-surface,white)] rounded-card shadow-soft p-6 text-center">
              <div class="flex items-center gap-2 mb-4 justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="text-accent">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h3 class="text-xl font-bold text-text-dark">Schedule Visit</h3>
              </div>

              <div class="w-16 h-16 mx-auto mb-4 bg-background rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="text-text-dark/30">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h4 class="font-bold text-text-dark mb-2">No upcoming visits</h4>
              <p class="text-sm text-text-dark/60 font-form mb-4">
                You haven't booked any shelter visits yet. Found a furry friend you like?
              </p>
              <button @click="bookVisit" class="btn-primary w-full">
                Book a Visit
              </button>
            </div>

          </div>

          <!-- Furry Friends Card -->
          <div class="bg-[var(--color-surface,white)] rounded-card shadow-soft p-6">
            <h3 class="text-xl font-bold text-text-dark mb-4">Furry Friends</h3>

            <div v-if="loadingPets" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            </div>

            <div v-else class="space-y-4">
              <div v-for="pet in recommendedPets.slice(0, 2)" :key="pet.id"
                class="flex items-center gap-3 cursor-pointer hover:bg-background/50 p-2 rounded-btn transition-colors"
                @click="goToPetDetail(pet.id)">
                <img :src="getMainPhoto(pet)" :alt="pet.name" class="w-12 h-12 rounded-full object-cover" />
                <div class="flex-1">
                  <h4 class="font-bold text-text-dark">{{ pet.name }}</h4>
                  <p class="text-sm text-text-dark/60 font-form">
                    {{ pet.breed }} • {{ getAgeDisplay(pet.age_months) }}
                  </p>
                </div>
                <button class="text-secondary hover:text-accent transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                    stroke="none">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                    </path>
                  </svg>
                </button>
              </div>

              <router-link to="/"
                class="text-accent font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all font-form mt-4">
                See more friends
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- Visit Us Card -->
          <div class="bg-accent rounded-card shadow-soft p-6 text-text-light relative overflow-hidden">
            <!-- Decorative paw print -->
            <div class="absolute bottom-0 right-0 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>

            <h3 class="text-xl font-bold mb-4 relative z-10">Visit Us</h3>

            <div class="space-y-3 mb-4 relative z-10">
              <div class="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="flex-shrink-0 mt-0.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <p class="text-sm font-form">
                  123 Rescue Way, Pet Valley<br />
                  San Francisco, CA 94103
                </p>
              </div>

              <div class="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div class="text-sm font-form">
                  <p>Mon - Fri: 10am - 6pm</p>
                  <p>Sat - Sun: 11am - 4pm</p>
                </div>
              </div>
            </div>

            <button @click="getDirections"
              class="bg-text-light text-accent font-bold rounded-btn px-4 py-2 w-full hover:opacity-90 transition-opacity relative z-10">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rounded-card {
  border-radius: var(--radius-card);
}

.rounded-btn {
  border-radius: var(--radius-btn);
}

.shadow-soft {
  box-shadow: var(--shadow-soft);
}
</style>
