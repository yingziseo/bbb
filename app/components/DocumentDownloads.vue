<script setup lang="ts">
import { Download, View } from '@element-plus/icons-vue'
import type { BuyerDocument } from '~/data/documents'

withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  documents: BuyerDocument[]
  compact?: boolean
  inverse?: boolean
}>(), {
  eyebrow: 'Buyer Documents',
  title: 'Documents',
  subtitle: '',
  compact: false,
  inverse: false,
})
</script>

<template>
  <div
    class="border p-4 sm:p-5"
    :class="inverse ? 'border-white/12 bg-white/5 text-white' : 'border-[var(--color-line)] bg-white text-[var(--color-ink)]'"
  >
    <h2
      class="font-extrabold leading-tight"
      :class="[compact ? 'text-[17px]' : 'text-[20px]', inverse ? 'text-white' : 'text-[var(--color-navy)]']"
    >
      {{ title }}
    </h2>

    <div class="mt-4 grid gap-2">
      <article
        v-for="doc in documents"
        :key="doc.href"
        class="border-t pt-3 first:border-t-0 first:pt-0"
        :class="inverse ? 'border-white/12' : 'border-[var(--color-line)]'"
      >
        <div class="min-w-0">
          <h3
            class="text-[14.5px] font-extrabold leading-snug"
            :class="inverse ? 'text-white' : 'text-[var(--color-navy)]'"
          >
            {{ doc.title }}
          </h3>
          <div
            class="mt-1 text-[12.5px] font-semibold leading-relaxed"
            :class="inverse ? 'text-white/52' : 'text-[var(--color-slate-muted)]'"
          >
            {{ doc.description }} · {{ doc.meta }}
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <el-button
            tag="a"
            :href="doc.href"
            target="_blank"
            rel="noopener"
            color="#1b3c63"
            size="small"
            class="document-downloads__button !ml-0"
          >
            <el-icon><View /></el-icon>
            <span>View</span>
          </el-button>
          <el-button
            tag="a"
            :href="doc.href"
            :download="doc.filename"
            plain
            size="small"
            class="document-downloads__button !ml-0"
          >
            <el-icon><Download /></el-icon>
            <span>PDF</span>
          </el-button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.document-downloads__button {
  min-width: 64px;
}

@media (max-width: 390px) {
  .document-downloads__button {
    min-width: 54px;
    padding-inline: 9px;
  }
}
</style>
