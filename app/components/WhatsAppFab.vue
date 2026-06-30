<script setup lang="ts">
import { ChatDotRound } from '@element-plus/icons-vue'
import { company } from '~/data/site'
</script>

<template>
  <a
    :href="company.whatsappLink"
    target="_blank"
    rel="noopener"
    class="fixed bottom-5 right-5 z-50 flex items-center gap-2 border border-[var(--color-accent-dark)] bg-[var(--color-accent)] px-4 py-3 text-white font-bold transition-colors hover:bg-[var(--color-accent-dark)]"
    aria-label="Contact us on WhatsApp"
  >
    <el-icon :size="22"><ChatDotRound /></el-icon>
    <span class="hidden sm:inline text-[14px]">WhatsApp</span>
  </a>
</template>
