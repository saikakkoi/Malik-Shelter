<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProfile } from '@/composables/useProfile'
import Step1Identity from '@/components/profile/Step1Identity.vue'
import Step2Housing from '@/components/profile/Step2Housing.vue'
import Step3Household from '@/components/profile/Step3Household.vue'
import Step4Experience from '@/components/profile/Step4Experience.vue'
import Step5Lifestyle from '@/components/profile/Step5Lifestyle.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { success, error: errorToast } = useToast()
const { profile, loading, error, fetchProfile, updateProfile, uploadPhoto, deletePhoto } = useProfile()

const currentStep = ref(1)
const steps = [
    { id: 1, name: 'Identity' },
    { id: 2, name: 'Housing' },
    { id: 3, name: 'Household' },
    { id: 4, name: 'Experience' },
    { id: 5, name: 'Lifestyle' }
]

onMounted(async () => {
    await fetchProfile()
    if (route.query.step) {
        const step = Number(route.query.step)
        if (step >= 1 && step <= 5) {
            currentStep.value = step
        }
    }
})

const handleStep1Next = async (data: any) => {
    try {
        await updateProfile(data)
        currentStep.value = 2
    } catch (e) {
        console.error('Failed to update profile', e)
    }
}

const handleStep2Next = async (data: any) => {
    try {
        await updateProfile(data)
        currentStep.value = 3
    } catch (e) {
        console.error('Failed to update profile', e)
    }
}

const handleStep3Next = async (data: any) => {
    try {
        await updateProfile(data)
        currentStep.value = 4
    } catch (e) {
        console.error('Failed to update profile', e)
    }
}

const handleStep4Next = async (data: any) => {
    try {
        await updateProfile(data)
        currentStep.value = 5
    } catch (e) {
        console.error('Failed to update profile', e)
    }
}

const handleFinalSubmit = async (data: any) => {
    try {
        await updateProfile(data)
        success('Profile updated successfully!')
        router.push('/profile')
    } catch (e) {
        console.error('Failed to update profile', e)
        errorToast('Failed to update profile. Please try again.')
    }
}

const handleUploadPhoto = async (file: File) => {
    try {
        await uploadPhoto(file)
    } catch (e) {
        console.error('Failed to upload photo', e)
    }
}

const handleDeletePhoto = async (photoId: string) => {
    try {
        await deletePhoto(photoId)
    } catch (e) {
        console.error('Failed to delete photo', e)
    }
}

const goBack = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    } else {
        router.push('/profile')
    }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <button @click="goBack" class="flex items-center text-text-dark/60 hover:text-text-dark mb-8 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        {{ currentStep === 1 ? 'Back to Dashboard' : 'Previous Step' }}
    </button>

    <!-- Stepper -->
    <div class="mb-12">
        <div class="flex items-center justify-between relative">
            <div class="absolute top-1/2 left-0 w-full h-1 bg-primary/10 -translate-y-1/2 z-0"></div>
            <div 
                class="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
            ></div>
            
            <div 
                v-for="step in steps" 
                :key="step.id"
                class="relative z-10 flex flex-col items-center"
            >
                <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-4 cursor-pointer hover:scale-110 active:scale-95"
                    :class="[
                        currentStep === step.id ? 'bg-[var(--color-surface,white)] border-primary text-primary' : 
                        currentStep > step.id ? 'bg-primary border-primary text-white' : 
                        'bg-[var(--color-surface,white)] border-primary/20 text-primary/30 hover:border-primary/50'
                    ]"
                    @click="currentStep = step.id"
                >
                    <span v-if="currentStep > step.id">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                    <span v-else>{{ step.id }}</span>
                </div>
                <span 
                    class="absolute top-full mt-2 text-xs font-bold whitespace-nowrap transition-colors"
                    :class="currentStep >= step.id ? 'text-text-dark' : 'text-text-dark/30'"
                >
                    {{ step.name }}
                </span>
            </div>
        </div>
    </div>

    <div v-if="loading && !profile" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else class="bg-[var(--color-surface,white)] rounded-card shadow-soft p-8">
        <component 
            v-if="currentStep === 1" 
            :is="Step1Identity" 
            :initial-data="profile"
            :loading="loading"
            @next="handleStep1Next"
        />
        <component 
            v-else-if="currentStep === 2" 
            :is="Step2Housing" 
            :initial-data="profile"
            :loading="loading"
            :error="error"
            @next="handleStep2Next"
            @upload-photo="handleUploadPhoto"
            @delete-photo="handleDeletePhoto"
        />
        <component 
            v-else-if="currentStep === 3" 
            :is="Step3Household" 
            :initial-data="profile"
            :loading="loading"
            @next="handleStep3Next"
        />
        <component 
            v-else-if="currentStep === 4" 
            :is="Step4Experience" 
            :initial-data="profile"
            :loading="loading"
            @next="handleStep4Next"
        />
        <component 
            v-else-if="currentStep === 5" 
            :is="Step5Lifestyle" 
            :initial-data="profile"
            :loading="loading"
            @submit="handleFinalSubmit"
        />
        <div v-else class="py-20 text-center">
            <h3 class="text-xl font-bold mb-4 italic">Next steps coming soon...</h3>
            <p class="text-text-dark/60 font-form underline cursor-pointer" @click="currentStep = 1">Back to Step 1</p>
        </div>
    </div>
  </div>
</template>
