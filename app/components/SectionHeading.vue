<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; subtitle?: string; center?: boolean; inverse?: boolean }>()
</script>

<template>
  <div :class="['max-w-3xl', center ? 'mx-auto text-center' : '']">
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    <h2 :class="['section-title mt-4 text-balance', inverse ? '!text-white' : '']">{{ title }}</h2>
    <p v-if="subtitle" :class="['section-sub mt-3', center ? 'mx-auto' : '', inverse ? '!text-white/74' : '']">{{ subtitle }}</p>
  </div>
</template>
