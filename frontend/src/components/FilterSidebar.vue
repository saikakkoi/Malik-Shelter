<script setup lang="ts">
import { ref, watch } from 'vue'

interface Filters {
  species: string
  gender: string
  status: string
}

const emit = defineEmits<{
  (e: 'filter-change', filters: Filters): void
}>()

const filters = ref<Filters>({
  species: '',
  gender: '',
  status: ''
})

watch(filters, (newFilters) => {
  emit('filter-change', { ...newFilters })
}, { deep: true })

const speciesOptions = ['Cat', 'Dog', 'Rabbit', 'Bird']
const genderOptions = ['Male', 'Female']
const statusOptions = ['AVAILABLE', 'PENDING']
</script>

<template>
  <aside class="w-64 p-4 bg-card rounded-xl border shadow-sm">
    <h2 class="font-semibold text-lg mb-4">Filters</h2>

    <div class="space-y-4">
      <!-- Species -->
      <div>
        <label class="block text-sm font-medium mb-2">Species</label>
        <select v-model="filters.species" class="w-full p-2 border rounded-lg bg-background">
          <option value="">All</option>
          <option v-for="s in speciesOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <!-- Gender -->
      <div>
        <label class="block text-sm font-medium mb-2">Gender</label>
        <select v-model="filters.gender" class="w-full p-2 border rounded-lg bg-background">
          <option value="">All</option>
          <option v-for="g in genderOptions" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium mb-2">Status</label>
        <select v-model="filters.status" class="w-full p-2 border rounded-lg bg-background">
          <option value="">All</option>
          <option v-for="st in statusOptions" :key="st" :value="st">{{ st }}</option>
        </select>
      </div>

      <button
        @click="filters = { species: '', gender: '', status: '' }"
        class="w-full py-2 text-sm text-primary hover:underline"
      >
        Clear Filters
      </button>
    </div>
  </aside>
</template>
