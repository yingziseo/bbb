<script setup lang="ts">
import type { Product } from '~/data/site'

const company = await useSiteSettings()
const route = useRoute()
const slug = route.params.slug as string

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

await useManagedSeo(`category:${slug}`, {
  title: category.value.seoTitle || fallbackCategorySeoTitle(),
  description: category.value.seoDescription || fallbackCategorySeoDescription(),
  keywords: category.value.seoKeywords || `${category.value.name}, OEM food packaging, China packaging factory`,
  image: category.value.image,
})
</script>

<template>
  <div v-if="category">
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-4">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/products' }">Products</el-breadcrumb-item>
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
            to="/products"
            class="border border-[var(--color-line)] bg-white px-4 py-2 text-[14px] font-semibold text-[var(--color-graphite)] transition-colors hover:border-[var(--color-navy)]"
          >
            All Products
          </NuxtLink>
          <NuxtLink
            v-for="item in categories"
            :key="item.slug"
            :to="`/products/category/${item.slug}`"
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
          No products in this category yet.
        </div>
      </div>
    </section>

    <section class="border-t border-[var(--color-line)] bg-[var(--color-panel)]">
      <div class="container-x flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
        <div>
          <h2 class="text-[22px] font-extrabold text-[var(--color-navy)]">Need category pricing or OEM specs?</h2>
          <p class="mt-2 text-[15px] text-[var(--color-slate-muted)]">Send size, quantity, material, and packaging requirements for quotation.</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink :to="`/contact?product=${encodeURIComponent(category.name)}`">
            <el-button color="#c1121f" size="large">Get a Quote</el-button>
          </NuxtLink>
          <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">WhatsApp</el-button>
        </div>
      </div>
    </section>
  </div>
</template>
