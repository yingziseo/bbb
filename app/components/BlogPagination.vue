<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
    basePath?: string
  }>(),
  {
    basePath: '/blog',
  },
)

const pageLink = (page: number) => (page <= 1 ? props.basePath : `${props.basePath}/page/${page}`)

const visiblePages = computed(() => {
  const pages: Array<number | string> = []
  let lastAdded = 0

  for (let page = 1; page <= props.totalPages; page += 1) {
    const shouldShow =
      page === 1 ||
      page === props.totalPages ||
      Math.abs(page - props.currentPage) <= 1 ||
      (props.currentPage <= 3 && page <= 4) ||
      (props.currentPage >= props.totalPages - 2 && page >= props.totalPages - 3)

    if (!shouldShow) continue

    if (lastAdded && page - lastAdded > 1) {
      pages.push(`ellipsis-${lastAdded}-${page}`)
    }

    pages.push(page)
    lastAdded = page
  }

  return pages
})
</script>

<template>
  <nav v-if="totalPages > 1" class="mt-10 border-t border-[var(--color-line)] pt-6" aria-label="Blog pagination">
    <div class="hidden items-center justify-center gap-2 sm:flex">
      <NuxtLink
        v-if="currentPage > 1"
        :to="pageLink(currentPage - 1)"
        class="inline-flex h-10 items-center gap-2 border border-[var(--color-line-strong)] px-3 text-[13px] font-semibold text-[var(--color-navy)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        <el-icon :size="15">
          <ArrowLeft />
        </el-icon>
        <span>Previous</span>
      </NuxtLink>
      <span
        v-else
        class="inline-flex h-10 items-center gap-2 border border-[var(--color-line)] px-3 text-[13px] font-semibold text-[var(--color-slate-muted)] opacity-45"
      >
        <el-icon :size="15">
          <ArrowLeft />
        </el-icon>
        <span>Previous</span>
      </span>

      <template v-for="page in visiblePages" :key="page">
        <span
          v-if="typeof page === 'string'"
          class="inline-flex h-10 w-10 items-center justify-center border border-transparent text-[13px] font-semibold text-[var(--color-slate-muted)]"
        >
          ...
        </span>
        <NuxtLink
          v-else
          :to="pageLink(page)"
          :aria-current="page === currentPage ? 'page' : undefined"
          :class="[
            'inline-flex h-10 w-10 items-center justify-center border text-[13px] font-bold transition-colors',
            page === currentPage
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
              : 'border-[var(--color-line-strong)] text-[var(--color-navy)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
          ]"
        >
          {{ page }}
        </NuxtLink>
      </template>

      <NuxtLink
        v-if="currentPage < totalPages"
        :to="pageLink(currentPage + 1)"
        class="inline-flex h-10 items-center gap-2 border border-[var(--color-line-strong)] px-3 text-[13px] font-semibold text-[var(--color-navy)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        <span>Next</span>
        <el-icon :size="15">
          <ArrowRight />
        </el-icon>
      </NuxtLink>
      <span
        v-else
        class="inline-flex h-10 items-center gap-2 border border-[var(--color-line)] px-3 text-[13px] font-semibold text-[var(--color-slate-muted)] opacity-45"
      >
        <span>Next</span>
        <el-icon :size="15">
          <ArrowRight />
        </el-icon>
      </span>
    </div>

    <div class="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 sm:hidden">
      <NuxtLink
        v-if="currentPage > 1"
        :to="pageLink(currentPage - 1)"
        class="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-line-strong)] text-[var(--color-navy)]"
        aria-label="Previous page"
      >
        <el-icon :size="17">
          <ArrowLeft />
        </el-icon>
      </NuxtLink>
      <span
        v-else
        class="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-line)] text-[var(--color-slate-muted)] opacity-45"
        aria-hidden="true"
      >
        <el-icon :size="17">
          <ArrowLeft />
        </el-icon>
      </span>

      <div class="h-11 border border-[var(--color-line-strong)] bg-[var(--color-panel)] text-center text-[13px] font-bold leading-[42px] text-[var(--color-navy)]">
        Page {{ currentPage }} / {{ totalPages }}
      </div>

      <NuxtLink
        v-if="currentPage < totalPages"
        :to="pageLink(currentPage + 1)"
        class="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-line-strong)] text-[var(--color-navy)]"
        aria-label="Next page"
      >
        <el-icon :size="17">
          <ArrowRight />
        </el-icon>
      </NuxtLink>
      <span
        v-else
        class="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-line)] text-[var(--color-slate-muted)] opacity-45"
        aria-hidden="true"
      >
        <el-icon :size="17">
          <ArrowRight />
        </el-icon>
      </span>
    </div>
  </nav>
</template>
