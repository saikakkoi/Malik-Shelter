<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FilterSidebar from '@/components/FilterSidebar.vue'
import MasonryGrid from '@/components/MasonryGrid.vue'
import PetCard from '@/components/PetCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

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

interface SearchResult {
  total: number
  page: number
  limit: number
  total_pages: number
  items: Animal[]
}

const API_BASE = 'http://localhost:3000'

const animals = ref<Animal[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({ page: 1, total_pages: 1, total: 0 })

const currentFilters = ref({
  species: '',
  gender: '',
  status: ''
})

async function fetchAnimals() {
  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams()
    params.set('page', String(pagination.value.page))
    params.set('limit', '12')
    
    if (currentFilters.value.species) params.set('species', currentFilters.value.species)
    if (currentFilters.value.gender) params.set('gender', currentFilters.value.gender)
    if (currentFilters.value.status) params.set('status', currentFilters.value.status)

    const res = await fetch(`${API_BASE}/animals?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch animals')

    const data: SearchResult = await res.json()
    animals.value = data.items
    pagination.value = {
      page: data.page,
      total_pages: data.total_pages,
      total: data.total
    }
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function onFilterChange(filters: typeof currentFilters.value) {
  currentFilters.value = filters
  pagination.value.page = 1
  fetchAnimals()
}

onMounted(() => {
  fetchAnimals()
})
</script>

<template>
  <div class="flex gap-6 p-6">
    <!-- Sidebar -->
    <FilterSidebar @filter-change="onFilterChange" />

    <!-- Main Content -->
    <main class="flex-1">
      <!-- Loading State -->
      <LoadingSpinner v-if="loading" />

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
        <button @click="fetchAnimals" class="btn-primary mt-4">Try Again</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="animals.length === 0" class="text-center py-12">
        <p class="text-muted">No pets found matching your filters.</p>
      </div>

      <!-- Grid -->
      <template v-else>
        <p class="text-sm text-muted mb-4">
          Showing {{ animals.length }} of {{ pagination.total }} pets
        </p>

        <MasonryGrid>
          <PetCard v-for="animal in animals" :key="animal.id" :animal="animal" />
        </MasonryGrid>

        <!-- Pagination -->
        <div v-if="pagination.total_pages > 1" class="flex justify-center gap-4 mt-8">
          <button
            :disabled="pagination.page <= 1"
            @click="pagination.page--; fetchAnimals()"
            class="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <span class="py-2">Page {{ pagination.page }} of {{ pagination.total_pages }}</span>
          <button
            :disabled="pagination.page >= pagination.total_pages"
            @click="pagination.page++; fetchAnimals()"
            class="btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </template>
    </main>
  </div>
</template>
