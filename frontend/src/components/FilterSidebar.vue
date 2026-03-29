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

const speciesOptions = [
  { label: 'Dogs', value: 'Dog', icon: '🐶' },
  { label: 'Cats', value: 'Cat', icon: '🐱' },
]

const genderOptions = ['Male', 'Female']

function clearAll() {
  filters.value = { species: '', gender: '', status: '' }
}

function selectSpecies(value: string) {
  filters.value.species = filters.value.species === value ? '' : value
}

function selectGender(value: string) {
  filters.value.gender = filters.value.gender === value ? '' : value
}
</script>

<template>
  <aside class="w-56 shrink-0">
    <div class="bg-white dark:bg-[#252320] rounded-2xl border border-gray-100 dark:border-[#3a3730] shadow-sm p-5 transition-colors duration-300">
      <!-- Header -->
      <div class="mb-5">
        <h2 class="font-bold text-base text-[#3d3522] dark:text-[#f0ece4]">Filters</h2>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-[family-name:var(--font-form)]">Find your friend</p>
      </div>

      <!-- Species List -->
      <div class="space-y-1 mb-6">
        <button
          v-for="opt in speciesOptions"
          :key="opt.value"
          @click="selectSpecies(opt.value)"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-[family-name:var(--font-form)] transition-all"
          :class="filters.species === opt.value
            ? 'bg-[#d8e5b0] dark:bg-[#3d4a28] text-[#3d3522] dark:text-[#d8e5b0] font-semibold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2e2b27]'"
        >
          <span class="text-base">{{ opt.icon }}</span>
          <span>{{ opt.label }}</span>
        </button>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100 dark:border-[#3a3730] mb-5"></div>

      <!-- Gender -->
      <div class="mb-5">
        <p class="text-[10px] tracking-widest uppercase font-semibold text-gray-400 dark:text-gray-500 mb-3 font-[family-name:var(--font-form)]">Gender</p>
        <div class="flex gap-2">
          <button
            v-for="g in genderOptions"
            :key="g"
            @click="selectGender(g)"
            class="flex-1 py-1.5 rounded-full text-sm font-[family-name:var(--font-form)] transition-all border"
            :class="filters.gender === g
              ? 'bg-[#d8e5b0] dark:bg-[#3d4a28] border-[#c4cea1] dark:border-[#5a7030] text-[#3d3522] dark:text-[#d8e5b0] font-semibold'
              : 'border-gray-200 dark:border-[#3a3730] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'"
          >
            {{ g }}
          </button>
        </div>
      </div>

      <!-- Clear All -->
      <button
        @click="clearAll"
        class="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-[family-name:var(--font-form)] transition-colors"
      >
        Clear All
      </button>
    </div>
  </aside>
</template>
