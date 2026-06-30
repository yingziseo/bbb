<script setup lang="ts">
import { Right } from '@element-plus/icons-vue'
const props = withDefaults(
  defineProps<{
    items: string[]
    direction?: 'ltr' | 'rtl'
    tone?: 'dark' | 'light'
  }>(),
  {
    direction: 'rtl',
    tone: 'dark',
  },
)

const doubledItems = computed(() => [...props.items, ...props.items])
</script>

<template>
  <div
    class="info-marquee"
    :class="[
      direction === 'ltr' ? 'info-marquee--ltr' : 'info-marquee--rtl',
      tone === 'light' ? 'info-marquee--light' : 'info-marquee--dark',
    ]"
  >
    <div class="info-marquee__viewport">
      <div class="info-marquee__track">
        <div
          v-for="(item, index) in doubledItems"
          :key="`${item}-${index}`"
          class="info-marquee__item"
        >
          <el-icon class="info-marquee__icon" aria-hidden="true"><Right /></el-icon>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
