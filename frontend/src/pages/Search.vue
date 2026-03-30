<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FilterSidebar from '@/components/FilterSidebar.vue'
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
  size?: string
  tags?: string[]
  photos: { photo_url: string; is_main: boolean }[]
}

interface SearchResult {
  total: number
  page: number
  limit: number
  total_pages: number
  items: Animal[]
}

const API_BASE = import.meta.env.VITE_API_BASE_URL

const animals = ref<Animal[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const error = ref<string | null>(null)
const pagination = ref({ page: 1, total_pages: 1, total: 0 })
const viewMode = ref<'grid' | 'list'>('grid')

const currentFilters = ref({
  species: '',
  gender: '',
  status: ''
})

async function fetchAnimals(append = false) {
  if (append) loadingMore.value = true
  else loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams()
    params.set('page', String(pagination.value.page))
    params.set('limit', '6')

    if (currentFilters.value.species) params.set('species', currentFilters.value.species)
    if (currentFilters.value.gender) params.set('gender', currentFilters.value.gender)
    if (currentFilters.value.status) params.set('status', currentFilters.value.status)

    const res = await fetch(`${API_BASE}/animals?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch animals')

    const data: SearchResult = await res.json()

    if (append) {
      animals.value = [...animals.value, ...data.items]
    } else {
      animals.value = data.items
    }

    pagination.value = {
      page: data.page,
      total_pages: data.total_pages,
      total: data.total
    }
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function loadMore() {
  if (pagination.value.page >= pagination.value.total_pages) return
  pagination.value.page++
  await fetchAnimals(true)
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
  <div class="min-h-screen bg-[#f5f0ea] dark:bg-[#1a1814] flex flex-col transition-colors duration-300">
    <!-- Page Body -->
    <div class="flex gap-6 px-8 py-8 flex-1">
      <!-- Sidebar -->
      <FilterSidebar @filter-change="onFilterChange" />

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <!-- Section Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-[#2d2a1e] dark:text-[#f0ece4] leading-tight">Available for Adoption</h1>
            <p class="text-sm text-gray-500 mt-1 font-[family-name:var(--font-form)]">
              Meet the residents of Malik Shelter looking for a forever home.
            </p>
          </div>

          <!-- View Toggle -->
          <div class="flex items-center gap-1 bg-white dark:bg-[#2e2b27] rounded-lg border border-gray-200 dark:border-[#3a3730] p-1">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded transition-colors"
              :class="viewMode === 'grid' ? 'bg-gray-100 dark:bg-[#3a3730] text-gray-700 dark:text-gray-200' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1"/>
                <rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/>
                <rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-1.5 rounded transition-colors"
              :class="viewMode === 'list' ? 'bg-gray-100 dark:bg-[#3a3730] text-gray-700 dark:text-gray-200' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="2" width="14" height="2" rx="1"/>
                <rect x="1" y="7" width="14" height="2" rx="1"/>
                <rect x="1" y="12" width="14" height="2" rx="1"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <LoadingSpinner />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 font-[family-name:var(--font-form)]">{{ error }}</p>
          <button @click="fetchAnimals()" class="btn-primary mt-4">Try Again</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="animals.length === 0" class="text-center py-12">
          <p class="text-gray-400 font-[family-name:var(--font-form)]">No pets found matching your filters.</p>
        </div>

        <!-- Grid -->
        <template v-else>
          <div
            :class="viewMode === 'grid'
              ? 'grid grid-cols-3 gap-5'
              : 'flex flex-col gap-4'"
          >
            <PetCard
              v-for="animal in animals"
              :key="animal.id"
              :animal="animal"
            />
          </div>

          <!-- Load More -->
          <div v-if="pagination.page < pagination.total_pages" class="flex justify-center mt-10">
            <button
              @click="loadMore"
              :disabled="loadingMore"
              class="flex items-center gap-2 px-8 py-3 bg-[#ede8e0] hover:bg-[#e0d9ce] dark:bg-[#2e2b27] dark:hover:bg-[#3a3730] text-[#6b5a3e] dark:text-[#c4a96b] font-semibold rounded-full text-sm font-[family-name:var(--font-form)] transition-colors disabled:opacity-60"
            >
              <span>{{ loadingMore ? 'Loading...' : 'Load more friends' }}</span>
              <svg v-if="!loadingMore" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>
