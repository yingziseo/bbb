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
            <div class="site-footer-brand">
              <div class="site-footer-brand__identity">
                <span class="site-footer-logo site-footer-logo--desktop">
                  <img :src="company.logoPath || '/site-logo.png'" :alt="company.displayName" class="site-footer-logo__image" />
                </span>
                <div class="min-w-0">
                  <div class="site-footer-brand__name">{{ company.displayName }}</div>
                  <div class="site-footer-brand__legal">{{ company.name }}</div>
                </div>
              </div>
              <div class="site-footer-brand__tagline">{{ company.tagline }}</div>
              <div class="site-footer-brand__facts">
                <div class="site-footer-brand__fact">
                  <span>Location</span>
                  <strong>{{ company.location }}</strong>
                </div>
                <div class="site-footer-brand__fact">
                  <span>Founded</span>
                  <strong>{{ company.founded }}</strong>
                </div>
                <div class="site-footer-brand__fact">
                  <span>Capital</span>
                  <strong>{{ company.registeredCapital }}</strong>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="mb-4 text-white font-bold text-[14px] uppercase tracking-[0.12em]">Products</h4>
            <ul class="space-y-2.5 text-[14px] text-white/72">
              <li v-for="c in categories" :key="c.slug">
                <NuxtLink :to="`/products/category/${c.slug}`" class="hover:text-white transition-colors">{{ c.name }}</NuxtLink>
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
        <div class="site-footer-mobile-brand border border-white/10 px-5 py-6">
          <div class="flex items-center justify-center gap-3">
            <div class="site-footer-logo site-footer-logo--mobile">
              <img :src="company.logoPath || '/site-logo.png'" :alt="company.displayName" class="site-footer-logo__image" />
            </div>
            <div class="min-w-0 text-left">
              <div class="site-footer-mobile-brand__name">{{ company.displayName }}</div>
              <div class="site-footer-mobile-brand__tagline">{{ company.tagline }}</div>
            </div>
          </div>
          <div class="site-footer-mobile-brand__facts">
            <div>
              <span>Location</span>
              <strong>{{ company.location }}</strong>
            </div>
            <div>
              <span>Founded</span>
              <strong>{{ company.founded }}</strong>
            </div>
            <div>
              <span>Capital</span>
              <strong>{{ company.registeredCapital }}</strong>
            </div>
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
                <NuxtLink :to="`/products/category/${c.slug}`" class="hover:text-white transition-colors">{{ c.name }}</NuxtLink>
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

<style>
.site-footer-logo {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--color-line);
  background: #fff;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.site-footer-logo--desktop {
  height: 52px;
  width: 52px;
}

.site-footer-logo--mobile {
  height: 50px;
  width: 50px;
}

.site-footer-logo__image {
  height: 108%;
  width: 108%;
  object-fit: contain;
}

.site-footer-brand__identity {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

.site-footer-brand__name {
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.05;
}

.site-footer-brand__legal {
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  line-height: 1.35;
}

.site-footer-brand__tagline {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.35;
  text-transform: uppercase;
}

.site-footer-brand__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.site-footer-brand__fact {
  min-width: 0;
  padding: 12px 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.site-footer-brand__fact:last-child {
  border-right: 0;
}

.site-footer-brand__fact span,
.site-footer-mobile-brand__facts span {
  display: block;
  color: rgba(255, 255, 255, 0.42);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
}

.site-footer-brand__fact strong,
.site-footer-mobile-brand__facts strong {
  display: block;
  margin-top: 7px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
}

.site-footer-mobile-brand {
  text-align: left;
}

.site-footer-mobile-brand__name {
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.08;
}

.site-footer-mobile-brand__tagline {
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.52);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.3;
  text-transform: uppercase;
}

.site-footer-mobile-brand__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.site-footer-mobile-brand__facts > div {
  min-width: 0;
  padding: 11px 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.site-footer-mobile-brand__facts > div:last-child {
  border-right: 0;
}

@media (max-width: 420px) {
  .site-footer-mobile-brand__facts {
    grid-template-columns: 1fr;
  }

  .site-footer-mobile-brand__facts > div {
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .site-footer-mobile-brand__facts > div:last-child {
    border-bottom: 0;
  }
}
</style>
