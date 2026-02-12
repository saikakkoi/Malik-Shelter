<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 min-h-[400px]">
    <DotLottieVue
      src="/loading-cat.lottie"
      autoplay
      loop
      style="width: 300px; height: 300px;"
    />
    <p class="mt-6 text-xl text-muted">Loading adorable pets...</p>
  </div>
</template>
