<script setup lang="ts">
import { ArrowRight, Reading } from '@element-plus/icons-vue'
import { buyerGuides } from '~/data/buyer-guides'

const props = defineProps<{ categorySlug?: string }>()

const guides = computed(() => props.categorySlug
  ? buyerGuides.filter((guide) => guide.categorySlug === props.categorySlug)
  : buyerGuides)
</script>

<template>
  <section v-if="guides.length" class="border-y border-[var(--color-line)] bg-[var(--color-panel)]">
    <div class="container-x py-10 md:py-12">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div class="max-w-2xl">
          <span class="eyebrow">Buyer Guides</span>
          <h2 class="mt-3 text-[24px] font-extrabold leading-tight text-[var(--color-navy)]">Plan an import order with fewer blind spots</h2>
          <p class="mt-2 text-[15px] leading-relaxed text-[var(--color-slate-muted)]">Practical sourcing steps for comparing suppliers, approving samples, and preparing a first shipment.</p>
        </div>
      </div>

      <div class="mt-7 grid gap-5" :class="guides.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl'">
        <NuxtLink
          v-for="guide in guides"
          :key="guide.slug"
          :to="`/guides/${guide.slug}`"
          class="group grid min-w-0 grid-cols-[76px_minmax(0,1fr)] border border-[var(--color-line)] bg-white transition-colors hover:border-[var(--color-navy)] sm:grid-cols-[120px_minmax(0,1fr)]"
        >
          <RuntimeImage
            :src="guide.coverImage"
            :alt="guide.coverAlt"
            width="240"
            height="180"
            sizes="120px"
            loading="lazy"
            fetchpriority="low"
            decoding="async"
            image-class="h-full min-h-32 w-full object-cover"
          />
          <div class="flex min-w-0 flex-col p-4">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-accent)]"><el-icon><Reading /></el-icon> Import Guide</span>
            <h3 class="mt-2 text-[16px] font-extrabold leading-snug text-[var(--color-navy)] group-hover:text-[var(--color-accent)]">{{ guide.title }}</h3>
            <span class="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-bold text-[var(--color-navy)]">Read the guide <el-icon><ArrowRight /></el-icon></span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
