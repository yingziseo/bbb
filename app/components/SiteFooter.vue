<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { company, categories, complianceMarqueeItems } from '~/data/site'

const socialPlatforms = [
  { key: 'facebook', name: 'Facebook' },
  { key: 'instagram', name: 'Instagram' },
  { key: 'x', name: 'X' },
  { key: 'youtube', name: 'YouTube' },
  { key: 'tiktok', name: 'TikTok' },
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'telegram', name: 'Telegram' },
]

const companyLinks = [
  { label: 'Company Profile', to: '/about' },
  { label: 'All Products', to: '/products' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const mobileOpen = ref<string | null>(null)

const toggleSection = (key: string) => {
  mobileOpen.value = mobileOpen.value === key ? null : key
}

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-[var(--color-navy-dark)] text-white/80">
    <div class="footer-compliance">
      <InfoMarquee :items="complianceMarqueeItems" direction="rtl" tone="dark" />
    </div>

    <div class="border-b border-white/10">
      <div class="container-x py-5">
        <div class="flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
          <span
            v-for="item in socialPlatforms"
            :key="item.key"
            :title="item.name"
            :aria-label="item.name"
            aria-disabled="true"
            class="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/3 text-white/70 transition-colors hover:bg-white/7 hover:text-white"
          >
            <svg
              v-if="item.key === 'facebook'"
              viewBox="0 0 24 24"
              class="h-[15px] w-[15px] fill-current"
              aria-hidden="true"
            >
              <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.6 1.5-1.6H16V4.8c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H8v3h2.6v7z" />
            </svg>

            <svg
              v-else-if="item.key === 'instagram'"
              viewBox="0 0 24 24"
              class="h-[16px] w-[16px] fill-none stroke-current"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <rect x="4.2" y="4.2" width="15.6" height="15.6" />
              <circle cx="12" cy="12" r="3.7" />
              <circle cx="17.2" cy="6.8" r="0.8" class="fill-current stroke-none" />
            </svg>

            <svg
              v-else-if="item.key === 'x'"
              viewBox="0 0 24 24"
              class="h-[15px] w-[15px] fill-current"
              aria-hidden="true"
            >
              <path d="M18.9 4H16l-3.7 4.8L9.4 4H4l5.6 7.5L4.3 20H7l3.9-5 3.7 5H20l-5.9-8z" />
            </svg>

            <svg
              v-else-if="item.key === 'youtube'"
              viewBox="0 0 24 24"
              class="h-[16px] w-[16px] fill-current"
              aria-hidden="true"
            >
              <path d="M21 8.6c-.2-1.2-1.1-2.2-2.2-2.4C16.9 5.8 12 5.8 12 5.8s-4.9 0-6.8.4C4.1 6.4 3.2 7.4 3 8.6c-.4 1.9-.4 3.4-.4 3.4s0 1.5.4 3.4c.2 1.2 1.1 2.2 2.2 2.4 1.9.4 6.8.4 6.8.4s4.9 0 6.8-.4c1.1-.2 2-1.2 2.2-2.4.4-1.9.4-3.4.4-3.4s0-1.5-.4-3.4M10 15.5v-7l6 3.5z" />
            </svg>

            <svg
              v-else-if="item.key === 'tiktok'"
              viewBox="0 0 24 24"
              class="h-[16px] w-[16px] fill-current"
              aria-hidden="true"
            >
              <path d="M14.6 4c.4 1.4 1.2 2.3 2.4 3 .8.5 1.7.8 2.6.8v2.8c-1.4 0-2.8-.4-4-1.2v5.1c0 3-2.2 5.3-5.3 5.3S5 17.5 5 14.7s2.3-5.2 5.2-5.2h.5v2.8h-.5c-1.3 0-2.4 1-2.4 2.4 0 1.3 1 2.4 2.4 2.4 1.5 0 2.5-1.1 2.5-2.8V4z" />
            </svg>

            <svg
              v-else-if="item.key === 'linkedin'"
              viewBox="0 0 24 24"
              class="h-[16px] w-[16px] fill-current"
              aria-hidden="true"
            >
              <path d="M5.4 8.5h3.2V19H5.4zm1.6-4.1A1.85 1.85 0 1 1 7 8.1a1.85 1.85 0 0 1 0-3.7M10.7 8.5h3v1.4h.1c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.7V19h-3.2v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19h-3.2z" />
            </svg>

            <svg
              v-else
              viewBox="0 0 24 24"
              class="h-[16px] w-[16px] fill-current"
              aria-hidden="true"
            >
              <path d="M20.7 4.3 2.9 11.1c-.8.3-.8 1.4.1 1.6l4.6 1.4 1.8 5.1c.3.8 1.3.9 1.7.2l2.6-4 4.7 3.5c.6.5 1.5.1 1.6-.7l1.5-12.4c.1-1-1-1.6-1.8-1.3m-9.3 10.4-.7 2.7-.9-2.7 7.2-6.1z" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <div class="hidden md:block">
      <div class="container-x py-12">
        <div class="grid gap-10 lg:grid-cols-[1.2fr_0.85fr_0.85fr_1fr]">
          <div class="border-r border-white/10 pr-8">
            <div class="flex items-center gap-3 mb-4">
              <span class="flex h-9 w-9 items-center justify-center bg-white text-[var(--color-navy)] font-extrabold text-lg">Y</span>
              <div class="min-w-0">
                <div class="font-extrabold text-[18px] text-white">{{ company.displayName }}</div>
                <div class="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/46">{{ company.tagline }}</div>
              </div>
            </div>
            <div class="space-y-2 text-[14px] text-white/64">
              <div>{{ company.location }}</div>
              <div>Founded {{ company.founded }}</div>
              <div>{{ company.registeredCapital }}</div>
            </div>
          </div>

          <div>
            <h4 class="mb-4 text-white font-bold text-[14px] uppercase tracking-[0.12em]">Products</h4>
            <ul class="space-y-2.5 text-[14px] text-white/72">
              <li v-for="c in categories" :key="c.slug">
                <NuxtLink :to="`/products?category=${c.slug}`" class="hover:text-white transition-colors">{{ c.name }}</NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="mb-4 text-white font-bold text-[14px] uppercase tracking-[0.12em]">Company</h4>
            <ul class="space-y-2.5 text-[14px] text-white/72">
              <li v-for="item in companyLinks" :key="item.to">
                <NuxtLink :to="item.to" class="hover:text-white transition-colors">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="mb-4 text-white font-bold text-[14px] uppercase tracking-[0.12em]">Contact</h4>
            <div class="space-y-3 text-[14px] text-white/72">
              <div>{{ company.phone }}</div>
              <div class="break-all">{{ company.email }}</div>
              <div class="leading-relaxed">{{ company.address }}</div>
            </div>
            <div class="mt-5">
              <a :href="company.whatsappLink" target="_blank" class="inline-block">
                <el-button color="#c1121f">Chat on WhatsApp</el-button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="md:hidden">
      <div class="container-x py-8">
        <div class="border border-white/10 px-5 py-6 text-center">
          <div class="mx-auto mb-4 flex h-10 w-10 items-center justify-center bg-white text-[var(--color-navy)] font-extrabold text-lg">Y</div>
          <div class="text-[17px] font-extrabold text-white">YIYUAN</div>
          <div class="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/46">China Export Quality Factory</div>
          <div class="mt-4 space-y-1.5 text-[13px] text-white/62">
            <div>{{ company.location }}</div>
            <div>Founded {{ company.founded }}</div>
            <div>{{ company.registeredCapital }}</div>
          </div>
        </div>

        <div class="mt-6 border-y border-white/10">
          <button
            type="button"
            class="flex w-full items-center justify-between border-b border-white/10 px-1 py-4 text-center text-white"
            @click="toggleSection('products')"
          >
            <span class="flex-1 text-[13px] font-bold uppercase tracking-[0.12em]">Products</span>
            <el-icon :size="16" class="text-white/60">
              <ArrowUp v-if="mobileOpen === 'products'" />
              <ArrowDown v-else />
            </el-icon>
          </button>
          <div v-if="mobileOpen === 'products'" class="border-b border-white/10 pb-4">
            <ul class="space-y-3 px-1 pt-1 text-center text-[14px] text-white/70">
              <li v-for="c in categories" :key="c.slug">
                <NuxtLink :to="`/products?category=${c.slug}`" class="hover:text-white transition-colors">{{ c.name }}</NuxtLink>
              </li>
            </ul>
          </div>

          <button
            type="button"
            class="flex w-full items-center justify-between border-b border-white/10 px-1 py-4 text-center text-white"
            @click="toggleSection('company')"
          >
            <span class="flex-1 text-[13px] font-bold uppercase tracking-[0.12em]">Company</span>
            <el-icon :size="16" class="text-white/60">
              <ArrowUp v-if="mobileOpen === 'company'" />
              <ArrowDown v-else />
            </el-icon>
          </button>
          <div v-if="mobileOpen === 'company'" class="border-b border-white/10 pb-4">
            <ul class="space-y-3 px-1 pt-1 text-center text-[14px] text-white/70">
              <li v-for="item in companyLinks" :key="item.to">
                <NuxtLink :to="item.to" class="hover:text-white transition-colors">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </div>

          <button
            type="button"
            class="flex w-full items-center justify-between border-b border-white/10 px-1 py-4 text-center text-white"
            @click="toggleSection('contact')"
          >
            <span class="flex-1 text-[13px] font-bold uppercase tracking-[0.12em]">Contact</span>
            <el-icon :size="16" class="text-white/60">
              <ArrowUp v-if="mobileOpen === 'contact'" />
              <ArrowDown v-else />
            </el-icon>
          </button>
          <div v-if="mobileOpen === 'contact'" class="border-b border-white/10 pb-4">
            <div class="space-y-3 px-1 pt-1 text-center text-[14px] text-white/70">
              <div>{{ company.phone }}</div>
              <div class="break-all">{{ company.email }}</div>
              <div class="leading-relaxed">{{ company.address }}</div>
              <div class="pt-2">
                <a :href="company.whatsappLink" target="_blank" class="inline-block">
                  <el-button color="#c1121f">Chat on WhatsApp</el-button>
                </a>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="flex w-full items-center justify-between px-1 py-4 text-center text-white"
            @click="toggleSection('social')"
          >
            <span class="flex-1 text-[13px] font-bold uppercase tracking-[0.12em]">Social</span>
            <el-icon :size="16" class="text-white/60">
              <ArrowUp v-if="mobileOpen === 'social'" />
              <ArrowDown v-else />
            </el-icon>
          </button>
          <div v-if="mobileOpen === 'social'" class="pb-2">
            <ul class="space-y-3 px-1 pt-1 text-center text-[14px] text-white/70">
              <li v-for="item in socialPlatforms" :key="item.key">{{ item.name }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="container-x py-5 flex flex-col items-center justify-between gap-3 text-center text-[13px] text-white/55 sm:flex-row sm:text-left">
        <span>© {{ year }} {{ company.name }} All rights reserved.</span>
        <span>{{ company.location }}</span>
      </div>
    </div>
  </footer>
</template>
