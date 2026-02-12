<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  photos: { photo_url: string; is_main: boolean }[]
}>()

const activeIndex = ref(0)

const mainPhoto = (idx: number) => props.photos[idx]?.photo_url || 'https://placehold.co/600x600?text=No+Photo'
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-[30px] overflow-hidden shadow-soft aspect-square bg-white">
      <img 
        :src="mainPhoto(activeIndex)" 
        class="w-full h-full object-cover transition-all duration-500"
      />
    </div>
    
    <div v-if="photos.length > 1" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <button 
        v-for="(photo, idx) in photos" 
        :key="photo.photo_url"
        @click="activeIndex = idx"
        :class="[
          'relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all',
          activeIndex === idx ? 'border-accent ring-2 ring-accent/30' : 'border-transparent opacity-70 hover:opacity-100'
        ]"
      >
        <img :src="photo.photo_url" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
