<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'
import type { Product } from '~/data/site'

const company = await useSiteSettings()
const { isCn, text, localePath, htmlLang, seoAlternatePaths } = useLocale()
const route = useRoute()
const slug = route.params.slug as string

definePageMeta({
  alias: ['/cn/products/category/:slug'],
})

type ProductCategory = {
  id: number
  slug: string
  name: string
  description: string
  image: string
  productCount: number
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  canonical?: string
}

const { data: catalogData } = await useFetch<{ categories: ProductCategory[]; items: Product[] }>('/api/public/products', {
  query: { category: slug },
})

const categories = computed(() => catalogData.value?.categories || [])
const products = computed(() => catalogData.value?.items || [])
const category = computed(() => categories.value.find((item) => item.slug === slug))

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product category not found', fatal: true })
}

const fallbackCategorySeoTitle = () => {
  if (slug === 'cling-film') return 'Cling Film Manufacturer in China | Food Wrap OEM | YIYUAN'
  if (slug === 'disposable-meal-boxes') return 'Disposable Food Containers Factory in China | YIYUAN'
  return `${category.value?.name} Manufacturer in China | Wholesale & OEM | YIYUAN`
}

const fallbackCategorySeoDescription = () =>
  `${category.value?.description || `Shop ${category.value?.name} from YIYUAN.`} Importers, wholesale, OEM/ODM, private-label packaging and export quotes available.`

const page = computed(() => isCn.value ? {
  seo: {
    title: `${category.value?.name || ''} | 产品分类 | 宜沅新材料`,
    description: `查看 ${category.value?.name || '食品包装'} 分类产品，支持规格确认、批发采购、OEM/ODM 定制和出口询盘。`,
    keywords: `${category.value?.name || ''}, 食品包装, 保鲜膜, 一次性餐盒, OEM包装, 出口供应商`,
  },
  home: text.value.nav.home,
  products: text.value.nav.products,
  ctaTitle: '需要规格或批量报价？',
  ctaDesc: '请发送尺寸、数量和包装需求。',
} : {
  seo: {
    title: category.value?.seoTitle || fallbackCategorySeoTitle(),
    description: category.value?.seoDescription || fallbackCategorySeoDescription(),
    keywords: category.value?.seoKeywords || `${category.value?.name}, OEM food packaging, China packaging factory`,
  },
  home: text.value.nav.home,
  products: text.value.nav.products,
  ctaTitle: 'Need OEM Specs or Bulk Pricing?',
  ctaDesc: 'Send size, quantity, and packaging requirements for quotation.',
})

await useManagedSeo(`category:${slug}`, computed(() => ({
  ...page.value.seo,
  image: category.value.image,
})), {
  fallbackOnly: isCn,
  canonicalPath: computed(() => localePath(`/products/category/${slug}`)),
  htmlLang,
  alternatePaths: computed(() => seoAlternatePaths()),
})
</script>

<template>
  <div v-if="category">
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-4">
          <el-breadcrumb-item :to="{ path: localePath('/') }">{{ page.home }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: localePath('/products') }">{{ page.products }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ category.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="text-[clamp(28px,4vw,40px)] font-extrabold leading-tight">{{ category.name }}</h1>
        <p class="mt-3 max-w-2xl text-[16px] leading-relaxed text-white/80">
          {{ category.description }}
        </p>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x">
        <div class="flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-5">
          <NuxtLink
            :to="localePath('/products')"
            class="border border-[var(--color-line)] bg-white px-4 py-2 text-[14px] font-semibold text-[var(--color-graphite)] transition-colors hover:border-[var(--color-navy)]"
          >
            {{ text.labels.allProducts }}
          </NuxtLink>
          <NuxtLink
            v-for="item in categories"
            :key="item.slug"
            :to="localePath(`/products/category/${item.slug}`)"
            class="border px-4 py-2 text-[14px] font-semibold transition-colors"
            :class="item.slug === category.slug
              ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white'
              : 'border-[var(--color-line)] bg-white text-[var(--color-graphite)] hover:border-[var(--color-navy)]'"
          >
            {{ item.name }}
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="product in products" :key="product.slug" :product="product" />
        </div>

        <div v-if="!products.length" class="py-16 text-center text-[var(--color-slate-muted)]">
          {{ text.labels.noProducts }}
        </div>
      </div>
    </section>

    <BuyerGuideLinks v-if="!isCn" :category-slug="category.slug" />

    <section class="border-t border-[var(--color-line)] bg-[var(--color-panel)]">
      <div class="container-x flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
        <div>
          <h2 class="text-[22px] font-extrabold text-[var(--color-navy)]">{{ page.ctaTitle }}</h2>
          <p class="mt-2 text-[15px] text-[var(--color-slate-muted)]">{{ page.ctaDesc }}</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink :to="localePath(`/contact?product=${encodeURIComponent(category.name)}`)">
            <el-button color="#c1121f" size="large">
              <el-icon><Promotion /></el-icon>
              <span>{{ text.actions.getQuote }}</span>
            </el-button>
          </NuxtLink>
          <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">
            <span class="inline-flex items-center gap-1.5">
              <SocialIcon name="whatsapp" />
              <span>WhatsApp</span>
            </span>
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>
