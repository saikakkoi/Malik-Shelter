<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'highlight'
  class?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'primary'
})
</script>

<template>
  <div :class="cn(
    'px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2',
    variant === 'primary' && 'bg-primary/20 text-primary-foreground border-primary/30',
    variant === 'secondary' && 'bg-secondary/20 text-secondary-foreground border-secondary/30',
    variant === 'accent' && 'bg-accent/20 text-accent-foreground border-accent/30',
    variant === 'highlight' && 'bg-highlight/50 text-dark border-highlight',
    $attrs.class as string
  )">
    <slot />
  </div>
</template>
