<script setup lang="ts">
import { Calendar, Clock, ChevronRight, XCircle, Search, MapPin } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import { computed } from 'vue'
import { getImgUrl } from '@/lib/utils'

const props = defineProps<{
  visit: {
    id: string
    status: string
    visit_slot: {
      date: string
      start_time: string
      end_time: string
    }
    adoption_request: {
      id: string
      animal: {
        id: string
        name: string
        photos?: { photo_url: string; is_main: boolean }[]
        species: string
      }
    }
  }
}>()

const emit = defineEmits(['cancel'])

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const mainPhoto = computed(() => {
  const photos = props.visit.adoption_request.animal.photos || []
  const photo = photos.find(p => p.is_main) || photos[0]
  return photo ? getImgUrl(photo.photo_url) : null
})

const canCancel = computed(() => {
  if (['CANCELLED', 'REJECTED', 'REJECTED_AUTO', 'COMPLETED'].includes(props.visit.status)) return false
  const startTime = new Date(props.visit.visit_slot.start_time).getTime()
  const now = Date.now()
  const twoHoursInMs = 2 * 60 * 60 * 1000
  return startTime - now > twoHoursInMs
})
</script>

<template>
  <div
    class="bg-[var(--color-surface,white)] rounded-card shadow-soft p-5 border border-primary/10 overflow-hidden relative group hover:shadow-lg transition-all">
    <!-- Status Badge -->
    <div class="absolute top-4 right-4 z-10">
      <Badge
        :variant="visit.status === 'SCHEDULED' ? 'default' : visit.status === 'CANCELLED' ? 'secondary' : visit.status === 'APPROVED' ? 'success' : 'destructive'">
        {{ visit.status }}
      </Badge>
    </div>

    <div class="flex gap-4">
      <!-- Pet Avatar -->
      <div
        class="relative w-24 h-24 rounded-2xl overflow-hidden bg-background flex-shrink-0 border-2 border-primary/10">
        <img v-if="mainPhoto" :src="mainPhoto" :alt="visit.adoption_request.animal.name"
          class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-primary font-bold text-3xl">
          {{ visit.adoption_request.animal.name.charAt(0) }}
        </div>
      </div>

      <div class="flex-1">
        <h3 class="text-xl font-bold text-dark group-hover:text-accent transition-colors">
          Visit with {{ visit.adoption_request.animal.name }}
        </h3>

        <div class="mt-3 space-y-2">
          <div class="flex items-center gap-2 text-sm text-muted">
            <Calendar class="w-4 h-4 text-primary" />
            <span>{{ formatDate(visit.visit_slot.date) }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-muted font-bold">
            <Clock class="w-4 h-4 text-primary" />
            <span>{{ formatTime(visit.visit_slot.start_time) }} - {{ formatTime(visit.visit_slot.end_time) }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-muted/60">
            <MapPin class="w-3.5 h-3.5" />
            <span>Malik Shelter Central</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-5 pt-4 border-t border-primary/5 flex items-center justify-between gap-3">
      <router-link :to="`/animal/${visit.adoption_request.animal.id}`"
        class="text-xs font-bold text-muted hover:text-accent flex items-center gap-1 transition-colors">
        Pet Profile
        <ChevronRight class="w-4 h-4" />
      </router-link>

      <div class="flex gap-2">
        <!-- Suggestion for Auto-Rejected -->
        <router-link v-if="visit.status === 'REJECTED_AUTO'"
          :to="{ path: '/', query: { species: visit.adoption_request.animal.species } }"
          class="text-xs font-bold bg-accent/10 text-accent px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-accent hover:text-white transition-all shadow-sm">
          <Search class="w-3.5 h-3.5" /> Similar Pets
        </router-link>

        <!-- Cancel Action -->
        <button v-if="canCancel" @click="$emit('cancel', visit.id)"
          class="text-[10px] uppercase tracking-wider font-extrabold bg-rose-50 dark:bg-rose-900/30 text-rose-400 dark:text-rose-300 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-rose-400 hover:text-white transition-all shadow-sm border border-rose-100 dark:border-rose-700/40">
          <XCircle class="w-3 h-3" /> Cancel Visit
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rounded-card {
  border-radius: var(--radius-card);
}
</style>
