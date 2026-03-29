<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Search, ArrowLeft } from 'lucide-vue-next'
import { useAdoption } from '@/composables/useAdoption'
import { useDialog } from '@/composables/useDialog'
import AdoptionRequestTable from '@/components/staff/AdoptionRequestTable.vue'
import ProfileReviewModal from '@/components/staff/ProfileReviewModal.vue'
import FinalizeAdoptionModal from '@/components/staff/FinalizeAdoptionModal.vue'

const { listAllRequests, updateRequestStatus, updateBookingStatus, getAdopterProfile } = useAdoption()
const dialog = useDialog()

const requests = ref([])
const total = ref(0)
const loading = ref(true)
const filters = ref({
  status: '',
  adopter_name: '',
  page: 1,
  limit: 10
})

const selectedProfile = ref(null)
const isReviewModalOpen = ref(false)

const isFinalizeModalOpen = ref(false)
const selectedRequestId = ref<string | null>(null)

const handleReviewProfile = async (adopterId: string) => {
  try {
    loading.value = true
    // Artificial 5-second delay to show the cat
    const [profile] = await Promise.all([
      getAdopterProfile(adopterId),
      new Promise(resolve => setTimeout(resolve, 5000))
    ])
    selectedProfile.value = profile
    isReviewModalOpen.value = true
  } catch (e: any) {
    dialog.error(e.message)
  } finally {
    loading.value = false
  }
}

const fetchRequests = async () => {
  loading.value = true
  try {
    // Artificial 5-second delay to show the cat
    const [data] = await Promise.all([
      listAllRequests(filters.value),
      new Promise(resolve => setTimeout(resolve, 5000))
    ])
    requests.value = data.items
    total.value = data.total
  } catch (e: any) {
    dialog.error(e.message)
  } finally {
    loading.value = false
  }
}

const handleApprove = (id: string) => {
  selectedRequestId.value = id
  isFinalizeModalOpen.value = true
}

const onFinalizeConfirm = async (notes: string) => {
  if (!selectedRequestId.value) return

  try {
    await updateRequestStatus(selectedRequestId.value, 'APPROVED', notes)
    dialog.success('Adoption finalized! Pet status updated to ADOPTED.')
    await fetchRequests()
  } catch (e: any) {
    dialog.error(e.message)
  }
}

const handleReject = async (id: string) => {
  dialog.show({
    title: 'Reject Request?',
    message: 'Are you sure you want to reject this adoption request?',
    type: 'error',
    confirmText: 'Confirm Rejection',
    onConfirm: async () => {
      try {
        await updateRequestStatus(id, 'REJECTED')
        dialog.success('Request rejected.')
        await fetchRequests()
      } catch (e: any) {
        dialog.error(e.message)
      }
    }
  })
}

const handleCheckIn = async (bookingId: string) => {
  try {
    await updateBookingStatus(bookingId, 'COMPLETED')
    dialog.success('Visitor checked in!')
    await fetchRequests()
  } catch (e: any) {
    dialog.error(e.message)
  }
}

watch(filters, fetchRequests, { deep: true })
onMounted(fetchRequests)
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="flex-1">
        <router-link to="/staff/inventory" class="text-muted hover:text-accent flex items-center gap-1 mb-2">
          <ArrowLeft class="w-4 h-4" /> Back to Inventory
        </router-link>
        <h1 class="text-4xl text-accent">Adoption Requests</h1>
        <p class="text-muted text-lg">Manage visitation schedules and adoption approvals</p>
      </div>

      <div class="flex items-center gap-3 bg-[var(--color-surface,white)] p-2 rounded-2xl shadow-soft border border-primary/10">
        <div class="relative flex-1 min-w-[200px]">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input v-model="filters.adopter_name" type="text" placeholder="Search Adopter..."
            class="w-full pl-11 pr-4 py-2 rounded-xl focus:bg-primary/5 outline-none transition-colors border-none" />
        </div>
        <select v-model="filters.status"
          class="bg-primary/5 px-4 py-2 rounded-xl outline-none border-none font-bold text-muted">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
    </div>

    <AdoptionRequestTable :requests="requests" :loading="loading" @approve="handleApprove" @reject="handleReject"
      @check-in="handleCheckIn" @review-profile="handleReviewProfile" />

    <ProfileReviewModal :show="isReviewModalOpen" :profile="selectedProfile" @close="isReviewModalOpen = false" />

    <FinalizeAdoptionModal :show="isFinalizeModalOpen" :request-id="selectedRequestId"
      @close="isFinalizeModalOpen = false" @confirm="onFinalizeConfirm" />
  </div>
</template>
