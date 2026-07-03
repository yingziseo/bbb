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
const activeSocialPlatforms = computed(() => socialPlatforms.value.filter((item) => item.url))

const { data: friendLinksData } = await useFetch('/api/public/friend-links')
const friendLinks = computed(() => friendLinksData.value?.items || [])

const companyLinks = [
  { label: 'Factory Overview', to: '/about' },
  { label: 'All Products', to: '/products' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const mobileOpen = ref<string | null>(null)

const footerHighlights = ['Wholesale Orders', 'OEM/ODM Packing', 'Sample Support', 'Export Support']

const toggleSection = (key: string) => {
  mobileOpen.value = mobileOpen.value === key ? null : key
}

const year = new Date().getFullYear()
// 法定公司名固定中文展示，不跟随多语言或后台站点名称变更。
const legalCompanyName = '商丘市宜沅新材料有限公司'
</script>

<template>
  <footer class="site-footer">
    <div class="footer-compliance">
      <InfoMarquee :items="complianceMarqueeItems" direction="rtl" tone="dark" />
    </div>

    <div class="site-footer__body">
      <div class="container-x">
        <div class="site-footer-desktop">
          <div class="site-footer-hero">
            <div class="site-footer-brand">
              <div class="site-footer-brand__identity">
                <span class="site-footer-logo site-footer-logo--desktop">
                  <img
                    :src="company.logoPath || '/site-logo.png'"
                    alt=""
                    aria-hidden="true"
                    width="64"
                    height="64"
                    class="site-footer-logo__image"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <div>
                  <div class="site-footer-brand__name">{{ company.displayName }}</div>
                  <div class="site-footer-brand__tagline">Food packaging and cling film export supplier.</div>
                </div>
              </div>
            </div>

            <div class="site-footer-actions" aria-label="Footer contact actions">
              <NuxtLink to="/contact" class="site-footer-action site-footer-action--primary">Request Export Quote</NuxtLink>
              <a
                :href="company.whatsappLink"
                target="_blank"
                rel="noopener"
                class="site-footer-action site-footer-action--ghost"
              >
                <SocialIcon name="whatsapp" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div class="site-footer-grid">
            <section class="site-footer-about" aria-label="Supply focus">
              <div class="site-footer-section-title">Export Supplier</div>
              <p>
                Cling film, fresh wrap and disposable food containers for wholesale import,
                private label and OEM/ODM packaging orders.
              </p>

              <div class="site-footer-highlights">
                <span v-for="item in footerHighlights" :key="item">{{ item }}</span>
              </div>

              <div v-if="activeSocialPlatforms.length" class="site-footer-social" aria-label="Social links">
                <a
                  v-for="item in activeSocialPlatforms"
                  :key="item.platformKey"
                  :title="item.name"
                  :aria-label="item.name"
                  :href="item.url"
                  :target="item.newWindow ? '_blank' : undefined"
                  :rel="item.newWindow ? 'noopener' : undefined"
                  class="site-footer-social__link"
                >
                  <SocialIcon :name="item.platformKey" />
                </a>
              </div>
            </section>

            <section class="site-footer-section" aria-label="Product links">
              <div class="site-footer-section-title">Products</div>
              <ul class="site-footer-link-list">
                <li v-for="c in categories" :key="c.slug">
                  <NuxtLink :to="`/products/category/${c.slug}`">{{ c.name }}</NuxtLink>
                </li>
              </ul>
            </section>

            <section class="site-footer-section" aria-label="Company links">
              <div class="site-footer-section-title">Company</div>
              <ul class="site-footer-link-list">
                <li v-for="item in companyLinks" :key="item.to">
                  <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
                </li>
              </ul>
            </section>

            <section class="site-footer-section site-footer-contact" aria-label="Contact information">
              <div class="site-footer-section-title">Contact</div>
              <div class="site-footer-contact-list">
                <a :href="company.whatsappLink" target="_blank" rel="noopener">{{ company.phone }}</a>
                <a :href="company.contactLink">{{ company.email }}</a>
                <span>{{ company.address }}</span>
              </div>
            </section>
          </div>

          <div v-if="friendLinks.length" class="site-footer-friend-links">
            <span>Friend Links</span>
            <div class="site-footer-friend-links__items">
              <a
                v-for="item in friendLinks"
                :key="item.id"
                :href="item.url"
                :target="item.newWindow ? '_blank' : undefined"
                :rel="item.newWindow ? 'noopener' : undefined"
              >
                {{ item.name }}
              </a>
            </div>
          </div>
        </div>

        <div class="site-footer-mobile">
          <div class="site-footer-mobile__head">
            <div class="site-footer-mobile-brand">
              <span class="site-footer-logo site-footer-logo--mobile">
                <img
                  :src="company.logoPath || '/site-logo.png'"
                  alt=""
                  aria-hidden="true"
                  width="64"
                  height="64"
                  class="site-footer-logo__image"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <div class="site-footer-mobile-brand__name">{{ company.displayName }}</div>
              <div class="site-footer-mobile-brand__tagline">Food packaging and cling film export supplier.</div>
            </div>

            <div class="site-footer-mobile-actions">
              <NuxtLink to="/contact" class="site-footer-action site-footer-action--primary">Request Quote</NuxtLink>
              <a
                :href="company.whatsappLink"
                target="_blank"
                rel="noopener"
                class="site-footer-action site-footer-action--ghost"
              >
                <SocialIcon name="whatsapp" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div v-if="activeSocialPlatforms.length" class="site-footer-social site-footer-social--mobile" aria-label="Social links">
              <a
                v-for="item in activeSocialPlatforms"
                :key="item.platformKey"
                :title="item.name"
                :aria-label="item.name"
                :href="item.url"
                :target="item.newWindow ? '_blank' : undefined"
                :rel="item.newWindow ? 'noopener' : undefined"
                class="site-footer-social__link"
              >
                <SocialIcon :name="item.platformKey" />
              </a>
            </div>
          </div>

          <div class="site-footer-mobile-sections">
            <button type="button" class="site-footer-mobile-toggle" @click="toggleSection('products')">
              <span>Products</span>
              <el-icon :size="16">
                <ArrowUp v-if="mobileOpen === 'products'" />
                <ArrowDown v-else />
              </el-icon>
            </button>
            <div v-if="mobileOpen === 'products'" class="site-footer-mobile-panel">
              <ul class="site-footer-mobile-list">
                <li v-for="c in categories" :key="c.slug">
                  <NuxtLink :to="`/products/category/${c.slug}`">{{ c.name }}</NuxtLink>
                </li>
              </ul>
            </div>

            <button type="button" class="site-footer-mobile-toggle" @click="toggleSection('company')">
              <span>Company</span>
              <el-icon :size="16">
                <ArrowUp v-if="mobileOpen === 'company'" />
                <ArrowDown v-else />
              </el-icon>
            </button>
            <div v-if="mobileOpen === 'company'" class="site-footer-mobile-panel">
              <ul class="site-footer-mobile-list">
                <li v-for="item in companyLinks" :key="item.to">
                  <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
                </li>
              </ul>
            </div>

            <button type="button" class="site-footer-mobile-toggle" @click="toggleSection('contact')">
              <span>Contact</span>
              <el-icon :size="16">
                <ArrowUp v-if="mobileOpen === 'contact'" />
                <ArrowDown v-else />
              </el-icon>
            </button>
            <div v-if="mobileOpen === 'contact'" class="site-footer-mobile-panel">
              <div class="site-footer-mobile-contact">
                <a :href="company.whatsappLink" target="_blank" rel="noopener">{{ company.phone }}</a>
                <a :href="company.contactLink">{{ company.email }}</a>
                <span>{{ company.address }}</span>
              </div>
            </div>

            <template v-if="friendLinks.length">
              <button type="button" class="site-footer-mobile-toggle" @click="toggleSection('friend-links')">
                <span>Friend Links</span>
                <el-icon :size="16">
                  <ArrowUp v-if="mobileOpen === 'friend-links'" />
                  <ArrowDown v-else />
                </el-icon>
              </button>
              <div v-if="mobileOpen === 'friend-links'" class="site-footer-mobile-panel">
                <ul class="site-footer-mobile-list site-footer-mobile-list--muted">
                  <li v-for="item in friendLinks" :key="item.id">
                    <a
                      :href="item.url"
                      :target="item.newWindow ? '_blank' : undefined"
                      :rel="item.newWindow ? 'noopener' : undefined"
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
    </div>

    <div class="site-footer-legal">
      <div class="container-x site-footer-legal__inner">
        <span>© {{ year }} {{ legalCompanyName }} 版权所有。</span>
        <span>{{ company.location }}</span>
      </div>
    </div>
  </footer>
</template>

<style>
.site-footer {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.76);
  background:
    linear-gradient(180deg, #0b2746 0%, #081b30 52%, #061421 100%);
}

.site-footer__body {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.site-footer-desktop {
  display: none;
}

.site-footer-mobile {
  display: block;
  padding: 30px 0 28px;
}

.site-footer-logo {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--color-line);
  background: #fff;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.12),
    0 14px 24px rgba(0, 0, 0, 0.18);
}

.site-footer-logo--desktop {
  height: 54px;
  width: 54px;
}

.site-footer-logo--mobile {
  height: 48px;
  width: 48px;
}

.site-footer-logo__image {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.site-footer-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 0;
}

.site-footer-brand {
  display: flex;
  min-width: 0;
  align-items: center;
}

.site-footer-brand__identity {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

.site-footer-brand__name {
  color: #fff;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.site-footer-brand__tagline {
  margin-top: 6px;
  max-width: 360px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}

.site-footer-actions {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.site-footer-action {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 0 17px;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.site-footer-action--primary {
  border-color: var(--color-accent);
  background: var(--color-accent);
}

.site-footer-action--ghost {
  background: rgba(255, 255, 255, 0.06);
}

.site-footer-action:hover {
  border-color: rgba(255, 255, 255, 0.34);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: translateY(-1px);
}

.site-footer-action--primary:hover {
  border-color: #e03541;
  background: #e03541;
}

.site-footer-grid {
  display: grid;
  grid-template-columns: minmax(260px, 1.18fr) minmax(150px, 0.68fr) minmax(150px, 0.68fr) minmax(260px, 1fr);
  gap: 44px;
  padding: 38px 0 34px;
}

.site-footer-section-title {
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.2;
  text-transform: uppercase;
}

.site-footer-about p {
  max-width: 380px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 14px;
  line-height: 1.75;
}

.site-footer-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.site-footer-highlights span {
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgba(255, 255, 255, 0.045);
  padding: 7px 10px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.site-footer-social {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 20px;
}

.site-footer-social__link {
  display: inline-flex;
  height: 38px;
  width: 38px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.045);
  color: rgba(255, 255, 255, 0.72);
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.site-footer-social__link:hover {
  border-color: rgba(255, 255, 255, 0.32);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateY(-1px);
}

.site-footer-link-list,
.site-footer-mobile-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-footer-link-list {
  display: grid;
  gap: 11px;
}

.site-footer-link-list a,
.site-footer-contact-list a,
.site-footer-contact-list span,
.site-footer-mobile-list a,
.site-footer-mobile-contact a {
  color: rgba(255, 255, 255, 0.66);
  text-decoration: none;
  transition: color 180ms ease;
}

.site-footer-link-list a:hover,
.site-footer-contact-list a:hover,
.site-footer-mobile-list a:hover,
.site-footer-mobile-contact a:hover {
  color: #fff;
}

.site-footer-link-list a {
  font-size: 14px;
  line-height: 1.45;
}

.site-footer-contact-list {
  display: grid;
  gap: 12px;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.site-footer-contact-list a,
.site-footer-contact-list span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.site-footer-friend-links {
  display: flex;
  align-items: flex-start;
  gap: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 18px 0 24px;
}

.site-footer-friend-links > span {
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.44);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.8;
  text-transform: uppercase;
}

.site-footer-friend-links__items {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 9px 18px;
}

.site-footer-friend-links__items a {
  color: rgba(255, 255, 255, 0.54);
  font-size: 13px;
  line-height: 1.6;
  text-decoration: none;
  transition: color 180ms ease;
}

.site-footer-friend-links__items a:hover {
  color: #fff;
}

.site-footer-mobile-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.site-footer-mobile__head {
  padding-bottom: 24px;
}

.site-footer-mobile-brand__name {
  margin-top: 12px;
  max-width: 100%;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.site-footer-mobile-brand__tagline {
  margin-top: 8px;
  max-width: 310px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  text-wrap: balance;
}

.site-footer-mobile-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 22px;
}

.site-footer-mobile-actions .site-footer-action {
  width: 100%;
  min-width: 0;
  padding: 0 12px;
  font-size: 12px;
}

.site-footer-social--mobile {
  justify-content: center;
  margin-top: 18px;
}

.site-footer-mobile-sections {
  border-top: 1px solid rgba(255, 255, 255, 0.11);
}

.site-footer-mobile-toggle {
  display: flex;
  width: 100%;
  min-height: 56px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
  background: transparent;
  padding: 0 2px;
  color: #fff;
  text-align: left;
}

.site-footer-mobile-toggle span {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.2;
  text-transform: uppercase;
}

.site-footer-mobile-toggle .el-icon {
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.56);
}

.site-footer-mobile-panel {
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
  padding: 3px 0 18px;
}

.site-footer-mobile-list {
  display: grid;
  gap: 12px;
  padding: 0 2px;
}

.site-footer-mobile-list a {
  display: inline-block;
  font-size: 14px;
  line-height: 1.45;
}

.site-footer-mobile-list--muted a {
  color: rgba(255, 255, 255, 0.56);
}

.site-footer-mobile-contact {
  display: grid;
  gap: 11px;
  padding: 0 2px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 14px;
  line-height: 1.55;
}

.site-footer-mobile-contact span {
  overflow-wrap: anywhere;
}

.site-footer-legal {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.14);
}

.site-footer-legal__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 17px;
  padding-bottom: 17px;
  color: rgba(255, 255, 255, 0.48);
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

@media (min-width: 768px) {
  .site-footer-desktop {
    display: block;
  }

  .site-footer-mobile {
    display: none;
  }

  .site-footer-legal__inner {
    flex-direction: row;
    text-align: left;
  }
}

@media (max-width: 1024px) and (min-width: 768px) {
  .site-footer-grid {
    grid-template-columns: minmax(240px, 1.1fr) repeat(2, minmax(130px, 0.65fr));
  }

  .site-footer-contact {
    grid-column: 1 / -1;
  }

  .site-footer-contact-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) and (min-width: 768px) {
  .site-footer-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-footer-actions {
    justify-content: flex-start;
  }
}
</style>
