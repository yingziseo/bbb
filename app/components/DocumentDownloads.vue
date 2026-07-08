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
    <div class="min-w-0">
      <div
        class="text-[10px] font-bold uppercase tracking-[0.12em]"
        :class="inverse ? 'text-white/52' : 'text-[var(--color-slate-muted)]'"
      >
        {{ eyebrow }}
      </div>
      <div class="mt-1 flex min-w-0 items-end justify-between gap-3">
        <h2
          class="truncate font-extrabold leading-tight"
          :class="[compact ? 'text-[17px]' : 'text-[20px]', inverse ? 'text-white' : 'text-[var(--color-navy)]']"
        >
          {{ title }}
        </h2>
        <p
          v-if="subtitle"
          class="hidden shrink-0 text-[12.5px] sm:block"
          :class="inverse ? 'text-white/58' : 'text-[var(--color-slate-muted)]'"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="mt-4 grid gap-2">
      <article
        v-for="doc in documents"
        :key="doc.href"
        class="flex min-w-0 items-center justify-between gap-3 border px-3 py-3"
        :class="inverse ? 'border-white/12 bg-[var(--color-navy-dark)]/35' : 'border-[var(--color-line)] bg-[var(--color-panel)]'"
      >
        <div class="min-w-0">
          <h3
            class="truncate text-[14px] font-extrabold leading-snug"
            :class="inverse ? 'text-white' : 'text-[var(--color-navy)]'"
          >
            {{ doc.title }}
          </h3>
          <div
            class="mt-1 truncate text-[12px] font-semibold"
            :class="inverse ? 'text-white/52' : 'text-[var(--color-slate-muted)]'"
          >
            {{ doc.description }} · {{ doc.meta }}
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2">
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
