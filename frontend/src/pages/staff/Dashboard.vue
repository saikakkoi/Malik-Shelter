<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDialog } from '@/composables/useDialog'
import { useAdoption } from '@/composables/useAdoption'
import InventoryTable from '@/components/staff/InventoryTable.vue'
import AdoptionRequestTable from '@/components/staff/AdoptionRequestTable.vue'

const { state } = useAuth()
const dialog = useDialog()
const { listAllRequests, updateRequestStatus, updateBookingStatus } = useAdoption()
const router = useRouter()

const API_BASE = import.meta.env.VITE_API_BASE_URL

// Animals state
const animals = ref<any[]>([])
const loadingAnimals = ref(true)
const animalsError = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 5

// Adoption requests state
const requests = ref<any[]>([])
const loadingRequests = ref(true)
const requestDateFilter = ref('')
const requestStatusFilter = ref('')
const requestsCurrentPage = ref(1)
const requestsItemsPerPage = 5

async function fetchInventory() {
  loadingAnimals.value = true
  try {
    const res = await fetch(`${API_BASE}/animals?status=all`, {
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    })
    if (!res.ok) throw new Error('Failed to fetch inventory')
    const data = await res.json()
    animals.value = data.items
  } catch (e: any) {
    animalsError.value = e.message
  } finally {
    loadingAnimals.value = false
  }
}

const paginatedAnimals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return animals.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(animals.value.length / itemsPerPage))

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

async function handleEdit(id: string) {
  router.push(`/staff/inventory/edit/${id}`)
}

async function handleArchive(id: string) {
  if (!confirm('Are you sure you want to archive this pet? It will be hidden from public search.')) return
  try {
    const res = await fetch(`${API_BASE}/animals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    })
    if (!res.ok) throw new Error('Failed to archive pet')
    dialog.success('Pet archived successfully')
    await fetchInventory()
  } catch (e: any) {
    dialog.error(e.message)
  }
}

async function handleToggleStatus(animal: any) {
  const nextStatus = animal.status === 'AVAILABLE' ? 'PENDING' : 'AVAILABLE'
  try {
    const res = await fetch(`${API_BASE}/animals/${animal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ status: nextStatus })
    })
    if (!res.ok) throw new Error('Failed to update status')
    dialog.success(`Status updated to ${nextStatus}`)
    await fetchInventory()
  } catch (e: any) {
    dialog.error(e.message)
  }
}

async function fetchRequests() {
  loadingRequests.value = true
  try {
    const data = await listAllRequests() // Fetch requests
    requests.value = data.items || []
  } catch (e: any) {
    dialog.error(e.message)
  } finally {
    loadingRequests.value = false
  }
}

const filteredRequests = computed(() => {
  return requests.value.filter(req => {
    if (requestStatusFilter.value && req.status !== requestStatusFilter.value) {
      return false
    }
    if (requestDateFilter.value) {
      const parts = requestDateFilter.value.split('/')
      if (parts.length === 3) {
        const [d, m, y] = parts
        if (!d || !m || !y) return false
        const searchDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
        const hasDate = req.bookings?.some((booking: any) => {
          const dbDate = new Date(booking.visit_slot.date).toISOString().split('T')[0]
          return dbDate === searchDate
        })
        if (!hasDate) return false
      } else {
        return false // Wait until valid DD/MM/YYYY format is reached
      }
    }
    return true
  })
})

const paginatedRequests = computed(() => {
  const start = (requestsCurrentPage.value - 1) * requestsItemsPerPage
  const end = start + requestsItemsPerPage
  return filteredRequests.value.slice(start, end)
})

const requestsTotalPages = computed(() => Math.ceil(filteredRequests.value.length / requestsItemsPerPage) || 1)

function nextRequestsPage() {
  if (requestsCurrentPage.value < requestsTotalPages.value) requestsCurrentPage.value++
}

function prevRequestsPage() {
  if (requestsCurrentPage.value > 1) requestsCurrentPage.value--
}

watch([requestDateFilter, requestStatusFilter], () => {
  requestsCurrentPage.value = 1
})

const handleApprove = async (id: string) => {
  const notes = prompt("Enter visit notes for approval:")
  if (notes === null) return;
  try {
    await updateRequestStatus(id, 'APPROVED', notes)
    dialog.success('Adoption finalized!')
    await fetchRequests()
  } catch (e: any) {
    dialog.error(e.message)
  }
}

const handleReject = async (id: string) => {
  if (!confirm('Are you sure you want to reject this request?')) return;
  try {
    await updateRequestStatus(id, 'REJECTED')
    dialog.success('Request rejected.')
    await fetchRequests()
  } catch (e: any) {
    dialog.error(e.message)
  }
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

const handleReviewProfile = () => {
  router.push('/staff/adoption-requests')
}

onMounted(() => {
  fetchInventory()
  fetchRequests()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="flex-1">
        <h1 class="text-4xl text-accent">Staff Dashboard</h1>
        <p class="text-muted text-lg">Overview of animals and adoptions</p>
      </div>
      <div class="bg-primary/10 px-4 py-2 rounded-2xl flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
          {{ state.user?.fullName.charAt(0) }}
        </div>
        <div>
          <p class="text-sm font-bold text-dark">{{ state.user?.fullName }}</p>
          <p class="text-xs text-muted">{{ state.user?.role }}</p>
        </div>
      </div>
    </div>

    <!-- Animals List Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-dark">Animals Overview</h2>
        <router-link 
          to="/staff/inventory/new"
          class="bg-accent text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-md"
        >
          + Add Pet
        </router-link>
      </div>

      <div v-if="animalsError" class="bg-red-50 text-red-500 p-6 rounded-3xl border border-red-100 flex items-center justify-between">
        <p>{{ animalsError }}</p>
        <button @click="fetchInventory" class="btn-primary py-2 text-sm">Retry</button>
      </div>

      <div v-else class="space-y-4">
        <InventoryTable 
          :animals="paginatedAnimals" 
          :loading="loadingAnimals" 
          @archive="handleArchive"
          @toggle-status="handleToggleStatus"
          @edit="handleEdit"
        />
        
        <!-- Pagination Controls -->
        <div v-if="!loadingAnimals && animals.length > itemsPerPage" class="flex justify-between items-center bg-[var(--color-surface,white)] p-4 rounded-xl shadow-soft">
          <p class="text-sm text-muted font-medium">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, animals.length) }} of {{ animals.length }} entries
          </p>
          <div class="flex gap-2">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-primary/10 text-accent rounded hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
              Previous
            </button>
            <span class="px-3 py-1 font-bold text-dark text-sm border border-primary/10 rounded flex items-center">
              Page {{ currentPage }} of {{ totalPages || 1 }}
            </span>
            <button 
              @click="nextPage" 
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 bg-primary/10 text-accent rounded hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Adoption Requests Section -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 class="text-2xl font-bold text-dark">Adoption Requests</h2>
        <div class="flex items-center gap-3 bg-[var(--color-surface,white)] px-4 py-2 rounded-xl border border-primary/10 shadow-soft flex-wrap">
          <div class="flex items-center gap-2">
            <label for="date-filter" class="text-sm font-semibold text-muted whitespace-nowrap">Filter by Visit Date:</label>
            <input 
              id="date-filter"
              type="text"
              placeholder="DD/MM/YYYY"
              v-model="requestDateFilter"
              class="px-2 py-1 bg-primary/5 rounded border-none outline-none text-sm font-semibold text-dark w-28"
            />
          </div>
          <div class="w-px h-6 bg-primary/10 hidden sm:block"></div>
          <div class="flex items-center gap-2">
            <label for="status-filter" class="text-sm font-semibold text-muted whitespace-nowrap">Status:</label>
            <select 
              id="status-filter"
              v-model="requestStatusFilter"
              class="px-2 py-1 bg-primary/5 rounded border-none outline-none text-sm font-semibold text-dark"
            >
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <AdoptionRequestTable 
        :requests="paginatedRequests" 
        :loading="loadingRequests" 
        @approve="handleApprove" 
        @reject="handleReject"
        @check-in="handleCheckIn" 
        @review-profile="handleReviewProfile" 
      />

      <!-- Pagination Controls for Requests -->
      <div v-if="!loadingRequests && filteredRequests.length > requestsItemsPerPage" class="flex justify-between items-center bg-[var(--color-surface,white)] p-4 rounded-xl shadow-soft mt-4">
        <p class="text-sm text-muted font-medium">
          Showing {{ (requestsCurrentPage - 1) * requestsItemsPerPage + 1 }} to {{ Math.min(requestsCurrentPage * requestsItemsPerPage, filteredRequests.length) }} of {{ filteredRequests.length }} entries
        </p>
        <div class="flex gap-2">
          <button 
            @click="prevRequestsPage" 
            :disabled="requestsCurrentPage === 1"
            class="px-3 py-1 bg-primary/10 text-accent rounded hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
          >
            Previous
          </button>
          <span class="px-3 py-1 font-bold text-dark text-sm border border-primary/10 rounded flex items-center">
            Page {{ requestsCurrentPage }} of {{ requestsTotalPages }}
          </span>
          <button 
            @click="nextRequestsPage" 
            :disabled="requestsCurrentPage >= requestsTotalPages"
            class="px-3 py-1 bg-primary/10 text-accent rounded hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
