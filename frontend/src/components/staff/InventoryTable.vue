<script setup lang="ts">
import { getImgUrl } from '@/lib/utils'
import Badge from '@/components/ui/Badge.vue'

interface Animal {
  id: string
  name: string
  species: string
  breed: string
  status: string
  photos: { photo_url: string; is_main: boolean }[]
}

defineProps<{ 
  animals: Animal[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'archive', id: string): void
  (e: 'toggleStatus', animal: Animal): void
  (e: 'edit', id: string): void
}>()

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'AVAILABLE': return 'success'
    case 'PENDING': return 'warning'
    case 'ADOPTED': return 'primary'
    case 'ARCHIVED': return 'secondary'
    default: return 'default'
  }
}

const getMainPhoto = (photos: any[]) => {
  const photo = photos.find(p => p.is_main) || photos[0]
  return getImgUrl(photo?.photo_url)
}
</script>

<template>
  <div class="overflow-x-auto bg-[var(--color-surface,white)] rounded-[24px] shadow-soft">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-primary/10 text-accent uppercase text-xs font-bold tracking-wider">
          <th class="px-6 py-4 rounded-tl-[24px]">Photo</th>
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4">Species / Breed</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4 rounded-tr-[24px] text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-primary/10">
        <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
          <td colspan="5" class="px-6 py-8 h-20 bg-gray-50/50"></td>
        </tr>
        
        <tr v-else v-for="animal in animals" :key="animal.id" class="hover:bg-primary/5 transition-colors group">
          <td class="px-6 py-4">
            <img :src="getMainPhoto(animal.photos)" class="w-12 h-12 rounded-lg object-cover shadow-sm" />
          </td>
          <td class="px-6 py-4 font-bold text-dark">
            {{ animal.name }}
          </td>
          <td class="px-6 py-4 text-sm text-muted">
            {{ animal.species }} <span class="mx-1">•</span> {{ animal.breed }}
          </td>
          <td class="px-6 py-4">
            <Badge :variant="getStatusVariant(animal.status) as any">
              {{ animal.status }}
            </Badge>
          </td>
          <td class="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <button 
              @click="emit('edit', animal.id)"
              class="text-xs font-bold px-3 py-1.5 rounded-full border border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
            >
              Edit
            </button>
            <button 
              @click="emit('toggleStatus', animal)"
              class="text-xs font-bold px-3 py-1.5 rounded-full border border-accent text-accent hover:bg-accent hover:text-white transition-all"
            >
              Toggle Status
            </button>
            <button 
              @click="emit('archive', animal.id)"
              class="text-xs font-bold px-3 py-1.5 rounded-full border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              Archive
            </button>
          </td>
        </tr>

        <tr v-if="!loading && animals.length === 0">
          <td colspan="5" class="px-6 py-12 text-center text-muted">
            No animals found in inventory.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
