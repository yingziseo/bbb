<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { categories as fallbackCategories, complianceMarqueeItems } from '~/data/site'

const company = await useSiteSettings()
const { data: catalogData } = await useFetch<{ categories: Array<{ slug: string; name: string }> }>('/api/public/products', {
  key: 'footer-product-categories',
})
const categories = computed(() => (catalogData.value?.categories || fallbackCategories))

const { data: socialData } = await useFetch('/api/public/social-links')
const socialPlatforms = computed(() => socialData.value?.items || [])

const companyLinks = [
  { label: 'Factory Overview', to: '/about' },
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
          <a
            v-for="item in socialPlatforms"
            :key="item.platformKey"
            :title="item.name"
            :aria-label="item.name"
            :href="item.url || undefined"
            :target="item.url && item.newWindow ? '_blank' : undefined"
            :rel="item.url && item.newWindow ? 'noopener' : undefined"
            :aria-disabled="!item.url"
            class="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/3 text-white/70 transition-colors hover:bg-white/7 hover:text-white"
          >
            <SocialIcon :name="item.platformKey" />
          </a>
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
          <div class="text-[17px] font-extrabold text-white">{{ company.displayName }}</div>
          <div class="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/46">{{ company.tagline }}</div>
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
              <li v-for="item in socialPlatforms" :key="item.platformKey">{{ item.name }}</li>
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
