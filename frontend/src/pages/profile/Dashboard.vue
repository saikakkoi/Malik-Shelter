<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfile } from '@/composables/useProfile'
import { useAdoption } from '@/composables/useAdoption'
import { useDialog } from '@/composables/useDialog'
import VisitCard from '@/components/Adoption/VisitCard.vue'

const router = useRouter()
const { profile, loading, error, fetchProfile } = useProfile()
const { state: adoptionState, getMyRequests, cancelRequest } = useAdoption()
const dialog = useDialog()

onMounted(async () => {
  await Promise.all([
    fetchProfile(),
    getMyRequests()
  ])
})

const handleCancel = async (requestId: string) => {
  dialog.show({
    title: 'Cancel Visit?',
    message: 'Are you sure you want to cancel this visit request? This action cannot be undone.',
    type: 'error',
    confirmText: 'Yes, Cancel Visit',
    onConfirm: async () => {
      try {
        await cancelRequest(requestId)
        dialog.success('Visit cancelled successfully.')
        await getMyRequests()
      } catch (e: any) {
        dialog.error(e.message)
      }
    }
  })
}

const startWizard = () => {
  router.push('/profile/wizard')
}

const steps = [
  { id: 1, name: 'Identity', fields: ['full_name', 'phone', 'address'] },
  { id: 2, name: 'Housing', fields: ['residence_type', 'ownership_status', 'outdoor_area', 'home_photos (min 2)'] },
  { id: 3, name: 'Household', fields: ['resident_count'] },
  { id: 4, name: 'Experience', fields: ['ownership_history', 'vet_references'] },
  { id: 5, name: 'Lifestyle', fields: ['time_pet_alone', 'activity_level', 'future_plans'] }
]

const isStepComplete = (stepFields: string[]) => {
  if (!profile.value?.meta?.missing_fields) return false
  return !stepFields.some(field => profile.value.meta.missing_fields.includes(field))
}

const goToStep = (stepId: number) => {
  router.push({ path: '/profile/wizard', query: { step: stepId } })
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-btn border border-red-200 text-red-700">
      {{ error }}
      <button @click="fetchProfile" class="ml-4 font-bold underline">Retry</button>
    </div>

    <div v-else>
      <div class="bg-white rounded-card shadow-soft p-8 mb-8">
        <h1 class="text-3xl font-bold mb-6 text-text-dark">Your Adopter Profile</h1>
        
        <div class="flex items-center gap-6 mb-8">
          <div class="flex-1">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-text-dark">
                Status: 
                <span :class="profile?.status === 'COMPLETED' ? 'text-primary' : 'text-accent'">
                  {{ profile?.status || 'NOT STARTED' }}
                </span>
              </span>
              <span class="text-sm font-medium text-text-dark">{{ profile?.meta?.completion_percentage || 0 }}% Complete</span>
            </div>
            <div class="w-full bg-background rounded-full h-4 overflow-hidden border border-primary/20">
              <div 
                class="bg-primary h-full transition-all duration-500" 
                :style="{ width: `${profile?.meta?.completion_percentage || 0}%` }"
              ></div>
            </div>
          </div>
          <button @click="startWizard" class="btn-primary flex-shrink-0">
            {{ profile?.status === 'COMPLETED' ? 'Update Profile' : 'Complete Profile' }}
          </button>
        </div>

        <p class="text-text-dark/80 mb-8 font-form leading-relaxed">
          Help us find the perfect match for you! A complete profile is required before you can request shelter visits.
          This information allows our staff to ensure animals are placed in suitable environments.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="step in steps" 
          :key="step.id"
          class="bg-white rounded-card shadow-soft p-6 border-b-4 transition-transform hover:-translate-y-1 cursor-pointer"
          :class="isStepComplete(step.fields) ? 'border-primary' : 'border-accent/40'"
          @click="goToStep(step.id)"
        >
          <div class="flex justify-between items-start mb-4">
            <span class="bg-secondary/20 text-text-dark px-3 py-1 rounded-full text-xs font-bold">Step {{ step.id }}</span>
            <div v-if="isStepComplete(step.fields)" class="text-primary bg-primary/10 rounded-full p-1 leading-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <h3 class="text-xl font-bold mb-2">{{ step.name }}</h3>
          <p class="text-sm text-text-dark/60 font-form">
            {{ isStepComplete(step.fields) ? 'Successfully completed' : 'Missing required information' }}
          </p>
        </div>
      </div>

      <!-- Adoption Visits Section -->
      <section v-if="adoptionState.myRequests.length" class="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="flex items-center justify-between">
          <h2 class="text-3xl font-bold text-accent font-heading">My Scheduled Visits 🐾</h2>
          <span class="text-sm bg-accent/10 text-accent px-4 py-1 rounded-full font-bold">
            {{ adoptionState.myRequests.length }} Total
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="request in adoptionState.myRequests" :key="request.id" class="space-y-4">
            <template v-for="booking in request.bookings" :key="booking.id">
              <VisitCard 
                :visit="{
                  id: booking.id,
                  status: booking.status,
                  visit_slot: booking.visit_slot,
                  adoption_request: { id: request.id, animal: request.animal }
                }" 
                @cancel="handleCancel"
              />
            </template>
          </div>
        </div>
      </section>
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
.bg-primary { color: var(--color-text-light); }
</style>
