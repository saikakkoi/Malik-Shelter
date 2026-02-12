<script setup lang="ts">
import { Calendar, Clock, ChevronRight, XCircle, Search, MapPin } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import { computed } from 'vue'

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
        image_url?: string
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
    minute: '2-digit'
  })
}

const canCancel = computed(() => {
  if (props.visit.status === 'CANCELLED') return false
  if (props.visit.status === 'REJECTED' || props.visit.status === 'REJECTED_AUTO') return false
  const startTime = new Date(props.visit.visit_slot.start_time).getTime()
  const now = Date.now()
  const twoHoursInMs = 2 * 60 * 60 * 1000
  return startTime - now > twoHoursInMs
})
</script>

<template>
  <div class="bg-white rounded-card shadow-soft p-5 border border-primary/10 overflow-hidden relative group hover:shadow-lg transition-all">
    <!-- Status Badge -->
    <div class="absolute top-4 right-4 z-10">
      <Badge :variant="visit.status === 'SCHEDULED' ? 'default' : visit.status === 'CANCELLED' ? 'secondary' : visit.status === 'APPROVED' ? 'success' : 'destructive'">
        {{ visit.status }}
      </Badge>
    </div>

    <div class="flex gap-4">
      <!-- Pet Avatar -->
      <div class="relative w-24 h-24 rounded-2xl overflow-hidden bg-background flex-shrink-0 border-2 border-primary/10">
        <img 
          v-if="visit.adoption_request.animal.image_url"
          :src="visit.adoption_request.animal.image_url" 
          :alt="visit.adoption_request.animal.name"
          class="w-full h-full object-cover"
        />
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
      <router-link 
        :to="`/animal/${visit.adoption_request.animal.id}`"
        class="text-xs font-bold text-muted hover:text-accent flex items-center gap-1 transition-colors"
      >
        Pet Profile <ChevronRight class="w-4 h-4" />
      </router-link>

      <div class="flex gap-2">
        <!-- Suggestion for Auto-Rejected -->
        <router-link 
          v-if="visit.status === 'REJECTED_AUTO'"
          :to="{ path: '/', query: { species: visit.adoption_request.animal.species } }"
          class="text-xs font-bold bg-accent/10 text-accent px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-accent hover:text-white transition-all shadow-sm"
        >
          <Search class="w-3.5 h-3.5" /> Similar Pets
        </router-link>

        <!-- Cancel Action -->
        <button 
          v-if="canCancel"
          @click="$emit('cancel', visit.id)"
          class="text-xs font-bold bg-rose-50 text-rose-400 px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-rose-400 hover:text-white transition-all shadow-sm"
        >
          <XCircle class="w-3.5 h-3.5" /> Cancel Visit
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
