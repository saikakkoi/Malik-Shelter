<script setup lang="ts">
import { ref } from 'vue'
import { X, User, Home, Users, Heart, Camera, Phone, MapPin, Clock } from 'lucide-vue-next'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

defineProps<{
  show: boolean
  profile: any
}>()

defineEmits(['close'])

const selectedPhotoUrl = ref<string | null>(null)

const openPreview = (url: string) => {
  selectedPhotoUrl.value = url
}

const closePreview = () => {
  selectedPhotoUrl.value = null
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-dark/40 backdrop-blur-sm">
      <div class="bg-[var(--color-surface,white)] rounded-[40px] shadow-2xl border border-primary/10 max-w-6xl w-full h-[90vh] overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="p-6 border-b border-primary/5 flex items-center justify-between bg-[var(--color-surface,white)] relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <User class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-accent font-heading">Adopter Profile Review</h2>
              <p class="text-sm text-muted">Reviewing <strong>{{ profile?.full_name }}</strong>'s multi-step application</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-primary/5 rounded-xl transition-colors">
            <X class="w-5 h-5 text-muted" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8 bg-[var(--color-surface-2,#fafafa)]">
          <!-- Step 1 & 2 combined for widest view -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Step 1: Identity -->
            <section class="space-y-4 bg-[var(--color-surface,white)] p-6 rounded-[32px] border border-primary/5 shadow-sm">
              <h3 class="flex items-center gap-2 text-lg font-bold text-accent font-heading border-b border-primary/5 pb-2">
                <User class="w-5 h-5" /> 1. Identity & Contact
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Full Name</p>
                  <p class="font-bold text-dark">{{ profile?.full_name || 'N/A' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Phone Number</p>
                  <p class="font-bold text-dark flex items-center gap-1">
                    <Phone class="w-3 h-3 text-primary" /> {{ profile?.phone || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-1 col-span-2">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Address</p>
                  <p class="font-medium text-dark text-sm leading-snug">
                    <MapPin class="w-3 h-3 text-primary inline mr-1" /> {{ profile?.address || 'N/A' }}
                  </p>
                </div>
                <div class="space-y-1 col-span-2">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Occupation</p>
                  <p class="font-medium text-dark text-sm">{{ profile?.occupation || 'N/A' }}</p>
                </div>
              </div>
            </section>

            <!-- Step 2: Housing -->
            <section class="space-y-4 bg-[var(--color-surface,white)] p-6 rounded-[32px] border border-primary/5 shadow-sm">
              <h3 class="flex items-center gap-2 text-lg font-bold text-accent font-heading border-b border-primary/5 pb-2">
                <Home class="w-5 h-5" /> 2. Housing & Environment
              </h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Type</p>
                  <p class="font-bold text-dark text-sm">{{ profile?.residence_type || 'N/A' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Ownership</p>
                  <p class="font-bold text-dark text-sm">{{ profile?.ownership_status || 'N/A' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Outdoor</p>
                  <p class="font-bold text-dark text-sm">{{ profile?.outdoor_area || 'N/A' }}</p>
                </div>
              </div>
              <div class="space-y-2 pt-2">
                <p class="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                  <Camera class="w-3 h-3" /> Home Photos ({{ profile?.home_photos?.length || 0 }})
                </p>
                <div v-if="profile?.home_photos?.length" class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <div 
                    v-for="photo in profile.home_photos" 
                    :key="photo.id" 
                    class="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-primary/5 relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                    @click="openPreview(API_BASE_URL + photo.photo_url)"
                  >
                    <img :src="API_BASE_URL + photo.photo_url" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Search class="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <p v-else class="text-xs text-muted italic">No photos uploaded</p>
              </div>
            </section>
          </div>

          <!-- Step 3, 4, 5 in a tighter grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Step 3: Household -->
            <section class="space-y-4 bg-[var(--color-surface,white)] p-6 rounded-[32px] border border-primary/5 shadow-sm">
              <h3 class="flex items-center gap-2 text-lg font-bold text-accent font-heading border-b border-primary/5 pb-2">
                <Users class="w-5 h-5" /> 3. Household
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Residents</p>
                  <p class="font-bold text-dark">{{ profile?.resident_count || 1 }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Kids?</p>
                  <p class="font-bold text-dark">{{ profile?.has_children ? 'Yes' : 'No' }}</p>
                </div>
                <div class="space-y-1 col-span-2">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Allergies</p>
                  <p class="text-xs text-dark leading-relaxed">{{ profile?.allergy_details || 'None' }}</p>
                </div>
                <div class="space-y-1 col-span-2">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Existing Pets</p>
                  <p class="text-xs text-dark leading-relaxed">{{ profile?.existing_pets || 'None' }}</p>
                </div>
              </div>
            </section>

            <!-- Step 4: Experience -->
            <section class="space-y-4 bg-[var(--color-surface,white)] p-6 rounded-[32px] border border-primary/5 shadow-sm">
              <h3 class="flex items-center gap-2 text-lg font-bold text-accent font-heading border-b border-primary/5 pb-2">
                <Heart class="w-5 h-5" /> 4. Experience
              </h3>
              <div class="space-y-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">History</p>
                  <p class="text-xs text-dark leading-relaxed line-clamp-4">{{ profile?.ownership_history || 'N/A' }}</p>
                </div>
                <div class="space-y-1 pt-2 border-t border-primary/5">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Vet Reference</p>
                  <p class="text-xs text-dark leading-relaxed">{{ profile?.vet_references || 'None' }}</p>
                </div>
              </div>
            </section>

            <!-- Step 5: Lifestyle -->
            <section class="space-y-4 bg-[var(--color-surface,white)] p-6 rounded-[32px] border border-primary/5 shadow-sm">
              <h3 class="flex items-center gap-2 text-lg font-bold text-accent font-heading border-b border-primary/5 pb-2">
                <Clock class="w-5 h-5" /> 5. Lifestyle
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Time Alone</p>
                  <p class="font-bold text-dark text-xs">{{ profile?.time_pet_alone || 'N/A' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Activity</p>
                  <p class="font-bold text-dark text-xs">{{ profile?.activity_level || 'N/A' }}</p>
                </div>
                <div class="space-y-1 col-span-2">
                  <p class="text-[10px] font-bold text-muted uppercase tracking-wider">Future Plans</p>
                  <p class="text-xs text-dark leading-relaxed">{{ profile?.future_plans || 'None specified' }}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-primary/5 bg-primary/5 text-center">
          <p class="text-muted text-sm font-medium">Reviewing this data helps ensure every pet goes to a safe and loving home. 🐾</p>
        </div>
      </div>

      <!-- Image Preview Lightbox -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="selectedPhotoUrl" class="fixed inset-0 z-[200] flex items-center justify-center p-12 bg-dark/90 backdrop-blur-md" @click="closePreview">
          <button @click="closePreview" class="absolute top-8 right-8 p-4 text-white hover:bg-white/10 rounded-full transition-colors">
            <X class="w-8 h-8" />
          </button>
          <img :src="selectedPhotoUrl" class="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300" @click.stop />
        </div>
      </Transition>
    </div>
  </Transition>
</template>
