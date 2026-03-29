<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getImgUrl } from '@/lib/utils'

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

const props = defineProps<{ animal: Animal }>()
const router = useRouter()

const navigateToDetail = () => {
  router.push(`/animal/${props.animal.id}`)
}

const mainPhoto = getImgUrl(props.animal.photos.find(p => p.is_main)?.photo_url
  || props.animal.photos[0]?.photo_url)

const ageDisplay = computed(() => {
  if (!props.animal.age_months) return ''
  return props.animal.age_months < 12
    ? `${props.animal.age_months} Months`
    : `${Math.floor(props.animal.age_months / 12)} ${Math.floor(props.animal.age_months / 12) === 1 ? 'Year' : 'Years'}`
})

const sizeBadge = computed(() => {
  const s = props.animal.size || 'Medium'
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
})

const genderIcon = computed(() => {
  return props.animal.gender?.toLowerCase() === 'female' ? '♀' : '♂'
})

// Overlay badge logic: pick special tags if any, else fallback to status
const overlayBadge = computed(() => {
  const tags = props.animal.tags || []
  if (tags.includes('Popular')) return { label: '♥ Popular', color: 'bg-white text-gray-700' }
  if (tags.includes('New Arrival')) return { label: 'New Arrival', color: 'bg-[#c4a96b] text-white' }
  if (tags.includes('Special Needs')) return { label: 'Special Needs', color: 'bg-[#c4a96b] text-white' }
  if (props.animal.status === 'PENDING') return { label: 'Pending', color: 'bg-yellow-400 text-white' }
  return null
})
</script>

<template>
  <div
    @click="navigateToDetail"
    class="bg-white dark:bg-[#252320] rounded-2xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-black/30 transition-shadow cursor-pointer border border-gray-100 dark:border-[#3a3730] flex flex-col"
  >
    <!-- Image Area -->
    <div class="relative bg-[#1a1a2e] h-52 overflow-hidden">
      <img
        v-if="mainPhoto"
        :src="mainPhoto"
        :alt="animal.name"
        class="w-full h-full object-contain object-top"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-5xl"
      >🐾</div>

      <!-- Overlay badge -->
      <div
        v-if="overlayBadge"
        class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold font-[family-name:var(--font-form)]"
        :class="overlayBadge.color"
      >
        {{ overlayBadge.label }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1">
      <!-- Name + Age -->
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-lg font-bold text-[#2d2a1e] dark:text-[#f0ece4]">{{ animal.name }}</h3>
        <span
          v-if="ageDisplay"
          class="text-xs font-semibold px-2.5 py-0.5 bg-[#eaf2d0] dark:bg-[#2d3d1a] text-[#4a6020] dark:text-[#a0c050] rounded-full font-[family-name:var(--font-form)]"
        >
          {{ ageDisplay }}
        </span>
      </div>

      <!-- Breed -->
      <p class="text-sm text-[#c4a96b] font-semibold font-[family-name:var(--font-form)] mb-3">
        {{ animal.breed }}
      </p>

      <!-- Traits -->
      <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-[family-name:var(--font-form)] mb-4">
        <span class="flex items-center gap-1">
          <span class="text-gray-400">{{ genderIcon }}</span>
          {{ animal.gender }}
        </span>
        <span class="flex items-center gap-1">
          <span class="text-gray-400">⬛</span>
          {{ sizeBadge }}
        </span>
      </div>

      <!-- Button -->
      <button
        class="mt-auto w-full py-2.5 rounded-full text-sm font-bold text-white bg-[#6b5a3e] hover:bg-[#5a4a30] dark:bg-[#8a7050] dark:hover:bg-[#7a6040] transition-colors font-[family-name:var(--font-form)]"
        @click.stop="navigateToDetail"
      >
        Adopt Me
      </button>
    </div>
  </div>
</template>
