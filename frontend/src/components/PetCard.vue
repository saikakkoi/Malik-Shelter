<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'

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

const props = defineProps<{ animal: Animal }>()
const router = useRouter()

const navigateToDetail = () => {
  router.push(`/animal/${props.animal.id}`)
}

const mainPhoto = props.animal.photos.find(p => p.is_main)?.photo_url
  || props.animal.photos[0]?.photo_url
  || 'https://placehold.co/300x200?text=No+Photo'

const ageDisplay = props.animal.age_months < 12
  ? `${props.animal.age_months} months`
  : `${Math.floor(props.animal.age_months / 12)} years`

const statusVariant = {
  AVAILABLE: 'success',
  PENDING: 'warning',
  ARCHIVED: 'secondary'
}[props.animal.status] || 'default'
</script>

<template>
  <Card 
    @click="navigateToDetail"
    class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
  >
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="mainPhoto"
        :alt="animal.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <Badge :variant="statusVariant as any" class="absolute top-2 right-2">
        {{ animal.status }}
      </Badge>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-lg">{{ animal.name }}</h3>
      <p class="text-sm text-muted-foreground">{{ animal.breed }}</p>
      <div class="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
        <span>{{ animal.gender }}</span>
        <span>•</span>
        <span>{{ ageDisplay }}</span>
      </div>
    </div>
  </Card>
</template>
