<script setup lang="ts">
type RuntimeImageProps = {
  alt?: string
  decoding?: 'async' | 'auto' | 'sync'
  densities?: string
  fetchpriority?: 'high' | 'low' | 'auto'
  format?: string
  height?: number | string
  imageClass?: string
  loading?: 'eager' | 'lazy'
  preload?: boolean | Record<string, unknown>
  quality?: number | string
  sizes?: string
  src?: string
  width?: number | string
}

const props = defineProps<RuntimeImageProps>()
const isUpload = computed(() => (props.src || '').startsWith('/uploads/'))
</script>

<template>
  <img
    v-if="isUpload"
    :src="src"
    :alt="alt || ''"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :decoding="decoding"
    :class="imageClass"
  />
  <NuxtImg
    v-else
    :src="src"
    :alt="alt || ''"
    :width="width"
    :height="height"
    :sizes="sizes"
    :densities="densities"
    :quality="quality"
    :format="format"
    :preload="preload"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :decoding="decoding"
    :class="imageClass"
  />
</template>
