<script setup lang="ts">
import { Clock, CheckCircle, XCircle, Search, User, UserCheck } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

defineProps<{
  requests: any[]
  loading: boolean
}>()

const emit = defineEmits(['approve', 'reject', 'check-in', 'review-profile'])

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

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'APPROVED': return 'success'
    case 'REJECTED':
    case 'REJECTED_AUTO': return 'destructive'
    default: return 'secondary'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'REJECTED': return 'rejected'
    case 'REJECTED_AUTO': return 'auto rejected'
    default: return status
  }
}
</script>

<template>
  <div class="bg-[var(--color-surface,white)] rounded-[32px] shadow-soft border border-primary/10 overflow-hidden">
    <div v-if="loading" class="p-12 flex flex-col items-center justify-center">
      <DotLottieVue src="/loading-cat.lottie" autoplay loop style="width: 200px; height: 200px;" />
      <p class="text-muted font-bold animate-pulse">Fetching requests...</p>
    </div>

    <div v-else-if="!requests.length" class="p-20 text-center">
      <div class="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search class="w-10 h-10 text-muted" />
      </div>
      <h3 class="text-2xl font-bold text-dark mb-2">No requests found</h3>
      <p class="text-muted">Try adjusting your filters or search terms.</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-primary/5">
          <tr>
            <th class="px-6 py-5 text-sm font-bold text-muted uppercase tracking-wider">Adopter</th>
            <th class="px-6 py-5 text-sm font-bold text-muted uppercase tracking-wider">Pet</th>
            <th class="px-6 py-5 text-sm font-bold text-muted uppercase tracking-wider">Visit Slot</th>
            <th class="px-6 py-5 text-sm font-bold text-muted uppercase tracking-wider">Status</th>
            <th class="px-6 py-5 text-sm font-bold text-muted uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-primary/5">
          <tr v-for="request in requests" :key="request.id" class="hover:bg-primary/5 transition-colors group">
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <User class="w-5 h-5" />
                </div>
                <div class="text-left">
                  <button @click="$emit('review-profile', request.adopter_id)"
                    class="font-bold text-dark hover:text-accent transition-colors block text-left">
                    {{ request.adopter.adopter_profile?.full_name || 'Incognito Adopter' }}
                  </button>
                  <p class="text-sm text-muted">{{ request.adopter.email }}</p>
                  <button @click="$emit('review-profile', request.adopter_id)"
                    class="text-xs font-bold text-primary hover:text-primary/70 transition-colors mt-1 flex items-center gap-1">
                    View Bio ✨
                  </button>
                </div>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="font-bold text-dark">{{ request.animal.name }}</div>
              <div class="text-sm text-muted">{{ request.animal.species }} • {{ request.animal.breed }}</div>
            </td>
            <td class="px-6 py-5">
              <div v-for="booking in request.bookings" :key="booking.id" class="space-y-1">
                <div class="font-bold text-dark flex items-center gap-2">
                  <Clock class="w-4 h-4 text-primary" />
                  {{ formatDate(booking.visit_slot.date) }}
                </div>
                <div class="text-sm text-muted">
                  {{ formatTime(booking.visit_slot.start_time) }} - {{ formatTime(booking.visit_slot.end_time) }}
                </div>
                <div class="pt-1">
                  <Badge :variant="booking.status === 'SCHEDULED' ? 'outline' : 'success'">
                    {{ booking.status }}
                  </Badge>
                </div>
              </div>
            </td>
            <td class="px-6 py-5">
              <Badge :variant="getStatusVariant(request.status)">
                {{ getStatusLabel(request.status) }}
              </Badge>
            </td>
            <td class="px-6 py-5 text-right">
              <div class="flex items-center justify-end gap-2">
                <!-- Check-in Action -->
                <button v-if="request.status === 'PENDING' && request.bookings[0]?.status === 'SCHEDULED'"
                  @click="$emit('check-in', request.bookings[0].id)"
                  class="p-2 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  title="Mark Visitor Check-in">
                  <UserCheck class="w-5 h-5" />
                </button>

                <!-- Approve/Reject -->
                <template v-if="request.status === 'PENDING'">
                  <button @click="$emit('approve', request.id)"
                    class="p-2 rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-100 transition-colors"
                    title="Approve Adoption">
                    <CheckCircle class="w-5 h-5" />
                  </button>
                  <button @click="$emit('reject', request.id)"
                    class="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    title="Reject Request">
                    <XCircle class="w-5 h-5" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
