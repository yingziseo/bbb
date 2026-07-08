<script setup lang="ts">
import { Document, Download, View } from '@element-plus/icons-vue'
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
  title: 'Documents for Review',
  subtitle: 'Open the PDF online or download it for internal purchasing review.',
  compact: false,
  inverse: false,
})
</script>

<template>
  <div
    class="border p-5 sm:p-6"
    :class="inverse ? 'border-white/12 bg-white/5 text-white' : 'border-[var(--color-line)] bg-white text-[var(--color-ink)]'"
  >
    <div class="flex items-start gap-3">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center border"
        :class="inverse ? 'border-white/15 bg-white/8 text-white' : 'border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-navy)]'"
      >
        <el-icon :size="22"><Document /></el-icon>
      </span>
      <div class="min-w-0">
        <div
          class="text-[11px] font-bold uppercase tracking-[0.12em]"
          :class="inverse ? 'text-white/58' : 'text-[var(--color-slate-muted)]'"
        >
          {{ eyebrow }}
        </div>
        <h2
          class="mt-1 font-extrabold leading-tight"
          :class="[compact ? 'text-[18px]' : 'text-[22px]', inverse ? 'text-white' : 'text-[var(--color-navy)]']"
        >
          {{ title }}
        </h2>
        <p
          v-if="subtitle"
          class="mt-2 text-[14px] leading-relaxed"
          :class="inverse ? 'text-white/70' : 'text-[var(--color-slate-muted)]'"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="mt-5 grid gap-3" :class="compact ? '' : 'sm:grid-cols-2'">
      <article
        v-for="doc in documents"
        :key="doc.href"
        class="border p-4"
        :class="inverse ? 'border-white/12 bg-[var(--color-navy-dark)]/35' : 'border-[var(--color-line)] bg-[var(--color-panel)]'"
      >
        <h3
          class="break-words text-[15px] font-extrabold leading-snug"
          :class="inverse ? 'text-white' : 'text-[var(--color-navy)]'"
        >
          {{ doc.title }}
        </h3>
        <p
          class="mt-2 text-[13.5px] leading-relaxed"
          :class="inverse ? 'text-white/70' : 'text-[var(--color-slate-muted)]'"
        >
          {{ doc.description }}
        </p>
        <div
          class="mt-3 text-[12px] font-semibold"
          :class="inverse ? 'text-white/52' : 'text-[var(--color-slate-muted)]'"
        >
          {{ doc.meta }}
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <el-button
            tag="a"
            :href="doc.href"
            target="_blank"
            rel="noopener"
            color="#1b3c63"
          >
            <el-icon><View /></el-icon>
            <span>View Online</span>
          </el-button>
          <el-button
            tag="a"
            :href="doc.href"
            :download="doc.filename"
            plain
          >
            <el-icon><Download /></el-icon>
            <span>Download PDF</span>
          </el-button>
        </div>
      </article>
    </div>
  </div>
</template>
