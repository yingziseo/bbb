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

const { data: friendLinksData } = await useFetch('/api/public/friend-links')
const friendLinks = computed(() => friendLinksData.value?.items || [])

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
          <template v-for="item in socialPlatforms" :key="item.platformKey">
            <a
              v-if="item.url"
              :title="item.name"
              :aria-label="item.name"
              :href="item.url"
              :target="item.newWindow ? '_blank' : undefined"
              :rel="item.newWindow ? 'noopener' : undefined"
              class="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/3 text-white/70 transition-colors hover:bg-white/7 hover:text-white"
            >
              <SocialIcon :name="item.platformKey" />
            </a>
            <span
              v-else
              :title="item.name"
              class="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/3 text-white/45"
              aria-hidden="true"
            >
              <SocialIcon :name="item.platformKey" />
            </span>
          </template>
        </div>
      </div>
    </div>

    <div class="hidden md:block">
      <div class="container-x py-10">
        <div class="grid gap-9 lg:grid-cols-[1.18fr_0.72fr_0.72fr_1fr]">
          <div class="pr-8">
            <div class="site-footer-brand">
              <div class="site-footer-brand__identity">
                <span class="site-footer-logo site-footer-logo--desktop">
                  <NuxtImg
                    :src="company.logoPath || '/site-logo.png'"
                    :alt="company.displayName"
                    width="64"
                    height="64"
                    format="webp"
                    quality="90"
                    densities="1x"
                    class="site-footer-logo__image"
                  />
                </span>
                <div class="min-w-0">
                  <div class="site-footer-brand__name">{{ company.displayName }}</div>
                  <div class="site-footer-brand__tagline">Food packaging and cling film export supplier.</div>
                </div>
              </div>
              <div class="site-footer-brand__legal">{{ company.name }}</div>
              <div class="site-footer-brand__meta">
                {{ company.location }} · Founded {{ company.founded }} · {{ company.registeredCapital }} capital
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
              <a :href="company.whatsappLink" target="_blank" rel="noopener" class="block hover:text-white transition-colors">
                {{ company.phone }}
              </a>
              <a :href="company.contactLink" class="block break-all hover:text-white transition-colors">
                {{ company.email }}
              </a>
              <div class="max-w-[320px] leading-relaxed text-white/48">{{ company.address }}</div>
            </div>
            <div class="mt-5">
              <a :href="company.whatsappLink" target="_blank" class="inline-block">
                <el-button color="#c1121f">
                  <span class="inline-flex items-center gap-1.5">
                    <SocialIcon name="whatsapp" />
                    <span>Chat on WhatsApp</span>
                  </span>
                </el-button>
              </a>
            </div>
          </div>
        </div>

        <div v-if="friendLinks.length" class="mt-10 border-t border-white/10 pt-5">
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/58">
            <span class="font-bold uppercase tracking-[0.12em] text-white/70">Friend Links</span>
            <a
              v-for="item in friendLinks"
              :key="item.id"
              :href="item.url"
              :target="item.newWindow ? '_blank' : undefined"
              :rel="item.newWindow ? 'noopener' : undefined"
              class="transition-colors hover:text-white"
            >
              {{ item.name }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="md:hidden">
      <div class="container-x py-8">
        <div class="site-footer-mobile-brand px-1 py-2">
          <div class="flex items-center justify-center gap-3">
            <div class="site-footer-logo site-footer-logo--mobile">
              <NuxtImg
                :src="company.logoPath || '/site-logo.png'"
                :alt="company.displayName"
                width="64"
                height="64"
                format="webp"
                quality="90"
                densities="1x"
                class="site-footer-logo__image"
              />
            </div>
            <div class="min-w-0 text-left">
              <div class="site-footer-mobile-brand__name">{{ company.displayName }}</div>
              <div class="site-footer-mobile-brand__tagline">Food packaging and cling film export supplier.</div>
            </div>
          </div>
          <div class="site-footer-mobile-brand__legal">{{ company.name }}</div>
          <div class="site-footer-mobile-brand__meta">
            {{ company.location }} · Founded {{ company.founded }} · {{ company.registeredCapital }} capital
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
              <a :href="company.whatsappLink" target="_blank" rel="noopener" class="block hover:text-white transition-colors">
                {{ company.phone }}
              </a>
              <a :href="company.contactLink" class="block break-all hover:text-white transition-colors">
                {{ company.email }}
              </a>
              <div class="leading-relaxed">{{ company.address }}</div>
              <div class="pt-2">
                <a :href="company.whatsappLink" target="_blank" class="inline-block">
                  <el-button color="#c1121f">
                    <span class="inline-flex items-center gap-1.5">
                      <SocialIcon name="whatsapp" />
                      <span>Chat on WhatsApp</span>
                    </span>
                  </el-button>
                </a>
              </div>
            </div>
          </div>

          <template v-if="friendLinks.length">
            <button
              type="button"
              class="flex w-full items-center justify-between px-1 py-4 text-center text-white"
              @click="toggleSection('friend-links')"
            >
              <span class="flex-1 text-[13px] font-bold uppercase tracking-[0.12em]">Friend Links</span>
              <el-icon :size="16" class="text-white/60">
                <ArrowUp v-if="mobileOpen === 'friend-links'" />
                <ArrowDown v-else />
              </el-icon>
            </button>
            <div v-if="mobileOpen === 'friend-links'" class="pb-4">
              <ul class="space-y-3 px-1 pt-1 text-center text-[14px] text-white/62">
                <li v-for="item in friendLinks" :key="item.id">
                  <a
                    :href="item.url"
                    :target="item.newWindow ? '_blank' : undefined"
                    :rel="item.newWindow ? 'noopener' : undefined"
                    class="hover:text-white transition-colors"
                  >
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </div>
          </template>
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
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  line-height: 1.35;
}

.site-footer-brand__tagline {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.35;
}

.site-footer-brand__meta {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 12px;
  font-weight: 650;
  line-height: 1.5;
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
  font-size: 12px;
  font-weight: 650;
  line-height: 1.3;
}

.site-footer-mobile-brand__legal {
  margin-top: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  line-height: 1.4;
}

.site-footer-mobile-brand__meta {
  margin-top: 9px;
  text-align: center;
  color: rgba(255, 255, 255, 0.42);
  font-size: 11.5px;
  font-weight: 650;
  line-height: 1.45;
}
</style>
