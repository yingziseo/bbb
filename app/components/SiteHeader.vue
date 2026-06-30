<script setup lang="ts">
import { Phone, Message, Menu as MenuIcon } from '@element-plus/icons-vue'
import { company, headerMarqueeItems } from '~/data/site'

const nav = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Company', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const mobileOpen = ref(false)
const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)
</script>

<template>
  <header class="sticky top-0 z-50 bg-white">
    <!-- Top utility bar -->
    <div class="bg-[var(--color-navy-dark)] text-white text-[13px]">
      <div class="container-x flex justify-end py-2">
        <div class="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-right">
          <span class="flex items-center gap-1.5 text-white/88">
            <el-icon><Phone /></el-icon>{{ company.phone }}
          </span>
          <span class="flex items-center gap-1.5 text-white/88">
            <el-icon><Message /></el-icon>{{ company.email }}
          </span>
          <span class="hidden lg:block text-white/64">
            Export Sourcing | Private Label OEM | Custom Converting
          </span>
        </div>
      </div>
    </div>

    <InfoMarquee :items="headerMarqueeItems" direction="ltr" tone="dark" />

    <!-- Main nav -->
    <div class="border-b border-[var(--color-line)]">
      <div class="container-x flex items-center justify-between h-[68px]">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="flex h-9 w-9 items-center justify-center bg-[var(--color-navy)] text-white font-extrabold text-lg">Y</span>
          <span class="leading-tight">
            <span class="block font-extrabold text-[18px] tracking-tight text-[var(--color-navy)]">{{ company.displayName }}</span>
            <span class="block text-[11px] uppercase tracking-[0.16em] text-[var(--color-slate-muted)]">{{ company.tagline }}</span>
          </span>
        </NuxtLink>

        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="px-4 py-2 text-[15px] font-semibold text-[var(--color-graphite)] hover:text-[var(--color-navy)] transition-colors"
            active-class="text-[var(--color-navy)]"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="hidden lg:flex items-center gap-3">
          <el-button
            tag="a"
            :href="company.whatsappLink"
            target="_blank"
            color="#1b3c63"
            >WhatsApp</el-button
          >
          <NuxtLink to="/contact">
            <el-button color="#c1121f">Get a Quote</el-button>
          </NuxtLink>
        </div>

        <button
          class="lg:hidden flex h-10 w-10 items-center justify-center border border-[var(--color-line)]"
          aria-label="Open menu"
          @click="mobileOpen = !mobileOpen"
        >
          <el-icon :size="20"><MenuIcon /></el-icon>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="lg:hidden border-b border-[var(--color-line)] bg-white">
      <div class="container-x py-3 flex flex-col">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="py-3 px-1 text-[15px] font-semibold text-[var(--color-graphite)] border-b border-[var(--color-line)] last:border-0"
          active-class="text-[var(--color-navy)]"
        >
          {{ item.label }}
        </NuxtLink>
        <div class="flex gap-3 pt-4">
          <el-button tag="a" :href="company.whatsappLink" target="_blank" color="#1b3c63" class="flex-1">WhatsApp</el-button>
          <NuxtLink to="/contact" class="flex-1">
            <el-button color="#c1121f" class="w-full">Get a Quote</el-button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
