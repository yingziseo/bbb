<script setup lang="ts">
import { ArrowDown, Close, Message, Menu as MenuIcon, Phone } from '@element-plus/icons-vue'
import { headerMarqueeItems } from '~/data/site'

const company = await useSiteSettings()

type HeaderProductCategory = {
  slug: string
  name: string
  description: string
  productCount: number
}

const { data: headerCatalog } = await useFetch<{ categories: HeaderProductCategory[] }>('/api/public/products', {
  key: 'site-header-products',
  default: () => ({ categories: [] }),
})

const nav = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Company', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const mobileOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

const productCategories = computed(() => (headerCatalog.value?.categories || []).slice(0, 4))
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`))
const updateScrolled = () => {
  isScrolled.value = window.scrollY > 10
}

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)

onMounted(() => {
  updateScrolled()
  window.addEventListener('scroll', updateScrolled, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrolled)
})
</script>

<template>
  <header class="site-header bg-white" :class="{ 'site-header--scrolled': isScrolled }">
    <!-- Top utility bar -->
    <div class="site-header__utility bg-[var(--color-navy-dark)] text-white text-[13px]">
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

    <div class="site-header__sticky">
      <!-- Main nav -->
      <div class="site-header__main border-b border-[var(--color-line)]">
        <div class="container-x flex h-[68px] items-center justify-between gap-4">
          <NuxtLink to="/" class="site-brand group">
            <span class="site-brand__mark">
              <img :src="company.logoPath || '/site-logo.png'" :alt="company.displayName" class="site-brand__logo" />
            </span>
            <span class="site-brand__copy">
              <span class="site-brand__name site-brand__name--full">{{ company.displayName }}</span>
              <span class="site-brand__name site-brand__name--short">YIYUAN</span>
              <span class="site-brand__tagline site-brand__tagline--full">{{ company.tagline }}</span>
              <span class="site-brand__tagline site-brand__tagline--short">Export Factory</span>
            </span>
          </NuxtLink>

          <nav class="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary navigation">
            <div
              v-for="item in nav"
              :key="item.to"
              class="site-nav-node"
              :class="{ 'site-nav-node--products': item.to === '/products' }"
            >
              <NuxtLink
                :to="item.to"
                class="site-nav-link"
                :class="{ 'is-active': isActive(item.to) }"
              >
                <span>{{ item.label }}</span>
                <el-icon v-if="item.to === '/products' && productCategories.length" class="site-nav-link__icon" :size="12">
                  <ArrowDown />
                </el-icon>
              </NuxtLink>

              <div
                v-if="item.to === '/products' && productCategories.length"
                class="site-nav-dropdown"
                aria-label="Product categories"
              >
                <NuxtLink
                  v-for="category in productCategories"
                  :key="category.slug"
                  :to="`/products?category=${category.slug}`"
                  class="site-nav-dropdown__item"
                >
                  <span class="site-nav-dropdown__name">{{ category.name }}</span>
                  <span class="site-nav-dropdown__meta">{{ category.productCount }} products</span>
                </NuxtLink>
              </div>
            </div>
          </nav>

          <div class="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
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
            class="site-mobile-toggle lg:hidden"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="mobileOpen"
            @click="mobileOpen = !mobileOpen"
          >
            <el-icon :size="20">
              <Close v-if="mobileOpen" />
              <MenuIcon v-else />
            </el-icon>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition name="mobile-nav-panel">
        <div v-if="mobileOpen" class="site-mobile-menu lg:hidden">
          <div class="container-x flex flex-col py-3">
            <NuxtLink
              v-for="item in nav"
              :key="item.to"
              :to="item.to"
              class="site-mobile-link"
              :class="{ 'is-active': isActive(item.to) }"
            >
              <span>{{ item.label }}</span>
              <span class="site-mobile-link__line" />
            </NuxtLink>

            <div v-if="productCategories.length" class="site-mobile-categories">
              <NuxtLink
                v-for="category in productCategories"
                :key="category.slug"
                :to="`/products?category=${category.slug}`"
                class="site-mobile-category"
              >
                {{ category.name }}
              </NuxtLink>
            </div>

            <div class="flex items-center justify-between border-b border-[var(--color-line)] py-3">
              <span class="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-slate-muted)]">Language</span>
              <LanguageSwitcher />
            </div>
            <div class="grid grid-cols-2 gap-3 pt-4">
              <el-button tag="a" :href="company.whatsappLink" target="_blank" color="#1b3c63" class="w-full">WhatsApp</el-button>
              <NuxtLink to="/contact">
                <el-button color="#c1121f" class="w-full">Get a Quote</el-button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style>
.site-header {
  background: #fff;
}

.site-header__sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.96);
  transition:
    box-shadow 220ms ease,
    background-color 220ms ease,
    backdrop-filter 220ms ease;
}

.site-header--scrolled .site-header__sticky {
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 28px rgba(15, 42, 74, 0.1);
  backdrop-filter: blur(12px);
}

.site-header__main {
  background: transparent;
  transition: background-color 220ms ease;
}

.site-brand {
  display: inline-flex;
  min-width: 0;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
}

.site-brand__mark {
  display: flex;
  height: 36px;
  width: 36px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-line);
  background: #fff;
}

.site-brand__logo {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.site-brand__copy {
  display: block;
  min-width: 0;
  max-width: 128px;
  line-height: 1.12;
}

.site-brand__name,
.site-brand__tagline {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.site-brand__name {
  color: var(--color-navy);
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0;
}

.site-brand__name--full,
.site-brand__tagline--full {
  display: none;
}

.site-brand__tagline {
  margin-top: 3px;
  color: var(--color-slate-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.site-nav-node {
  position: relative;
}

.site-nav-link {
  position: relative;
  z-index: 0;
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  gap: 5px;
  padding: 0 12px;
  color: var(--color-graphite);
  font-size: 14px;
  font-weight: 750;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
  isolation: isolate;
}

.site-nav-link > * {
  position: relative;
  z-index: 1;
}

.site-nav-link::before {
  position: absolute;
  inset: 8px 4px;
  z-index: -1;
  border: 1px solid transparent;
  background: transparent;
  content: '';
  transform: scaleX(0.92);
  opacity: 0;
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

.site-nav-link::after {
  position: absolute;
  right: 12px;
  bottom: 5px;
  left: 12px;
  height: 2px;
  background: var(--color-accent);
  content: '';
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 180ms ease;
}

.site-nav-link:hover,
.site-nav-link:focus-visible {
  color: var(--color-navy);
  transform: translateY(-1px);
}

.site-nav-link:hover::before,
.site-nav-link:focus-visible::before {
  border-color: var(--color-line);
  background: var(--color-panel);
  opacity: 1;
  transform: scaleX(1);
}

.site-nav-link:hover::after,
.site-nav-link:focus-visible::after,
.site-nav-link.is-active::after {
  transform: scaleX(1);
}

.site-nav-link.is-active {
  color: #fff;
}

.site-nav-link.is-active::before {
  border-color: var(--color-navy);
  background: var(--color-navy);
  opacity: 1;
  transform: scaleX(1);
}

.site-nav-link.is-active:hover,
.site-nav-link.is-active:focus-visible {
  color: #fff;
}

.site-nav-link__icon {
  transition: transform 180ms ease;
}

.site-nav-node--products:hover .site-nav-link__icon,
.site-nav-node--products:focus-within .site-nav-link__icon {
  transform: rotate(180deg);
}

.site-nav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  z-index: 70;
  width: 260px;
  border: 1px solid var(--color-line);
  background: #fff;
  box-shadow: 0 18px 42px rgba(15, 42, 74, 0.16);
  opacity: 0;
  pointer-events: none;
  transform: translate3d(-50%, 8px, 0);
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.site-nav-dropdown::before {
  position: absolute;
  right: 0;
  bottom: 100%;
  left: 0;
  height: 10px;
  content: '';
}

.site-nav-node--products:hover .site-nav-dropdown,
.site-nav-node--products:focus-within .site-nav-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translate3d(-50%, 0, 0);
}

.site-nav-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--color-line);
  padding: 11px 12px;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    padding-left 160ms ease;
}

.site-nav-dropdown__item:last-child {
  border-bottom: 0;
}

.site-nav-dropdown__item:hover,
.site-nav-dropdown__item:focus-visible {
  background: var(--color-panel);
  padding-left: 16px;
}

.site-nav-dropdown__name {
  min-width: 0;
  overflow: hidden;
  color: var(--color-navy);
  font-size: 13px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-nav-dropdown__meta {
  flex: 0 0 auto;
  color: var(--color-slate-muted);
  font-size: 11px;
  font-weight: 700;
}

.site-mobile-toggle {
  display: flex;
  height: 40px;
  width: 40px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-line);
  color: var(--color-navy);
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease;
}

.site-mobile-toggle:hover,
.site-mobile-toggle[aria-expanded='true'] {
  border-color: var(--color-navy);
  background: var(--color-navy);
  color: #fff;
}

.site-mobile-menu {
  border-bottom: 1px solid var(--color-line);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 18px 28px rgba(15, 42, 74, 0.12);
}

.mobile-nav-panel-enter-active,
.mobile-nav-panel-leave-active {
  overflow: hidden;
  transition:
    opacity 190ms ease,
    transform 190ms ease,
    max-height 220ms ease;
}

.mobile-nav-panel-enter-from,
.mobile-nav-panel-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-nav-panel-enter-to,
.mobile-nav-panel-leave-from {
  max-height: 520px;
  opacity: 1;
  transform: translateY(0);
}

.site-mobile-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-line);
  padding: 12px 4px;
  color: var(--color-graphite);
  font-size: 15px;
  font-weight: 800;
  transition:
    color 160ms ease,
    padding-left 160ms ease,
    background-color 160ms ease;
}

.site-mobile-link:hover,
.site-mobile-link:focus-visible,
.site-mobile-link.is-active {
  color: var(--color-navy);
  padding-left: 10px;
}

.site-mobile-link__line {
  height: 2px;
  width: 0;
  background: var(--color-accent);
  transition: width 160ms ease;
}

.site-mobile-link:hover .site-mobile-link__line,
.site-mobile-link:focus-visible .site-mobile-link__line,
.site-mobile-link.is-active .site-mobile-link__line {
  width: 34px;
}

.site-mobile-categories {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  border-bottom: 1px solid var(--color-line);
  padding: 12px 0;
}

.site-mobile-category {
  overflow: hidden;
  border: 1px solid var(--color-line);
  padding: 8px 10px;
  color: var(--color-graphite);
  font-size: 12px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition:
    border-color 160ms ease,
    color 160ms ease,
    background-color 160ms ease;
}

.site-mobile-category:hover,
.site-mobile-category:focus-visible {
  border-color: var(--color-navy);
  background: var(--color-panel);
  color: var(--color-navy);
}

@media (min-width: 640px) {
  .site-brand__copy {
    max-width: 250px;
  }

  .site-brand__name--short {
    display: none;
  }

  .site-brand__name--full {
    display: block;
    font-size: 17px;
  }
}

@media (min-width: 1024px) {
  .site-mobile-toggle {
    display: none;
  }

  .site-brand__copy {
    max-width: 230px;
  }

  .site-brand__tagline--short {
    display: none;
  }

  .site-brand__tagline--full {
    display: block;
  }
}

@media (min-width: 1180px) {
  .site-brand__copy {
    max-width: 310px;
  }

  .site-nav-link {
    padding-inline: 14px;
    font-size: 15px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .site-header *,
  .mobile-nav-panel-enter-active,
  .mobile-nav-panel-leave-active {
    transition: none !important;
  }
}
</style>
