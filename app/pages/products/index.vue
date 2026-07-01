<script setup lang="ts">
import type { Product } from '~/data/site'

const company = await useSiteSettings()

await useManagedSeo('page:products', {
  title: 'Food Packaging Products | Cling Film & Meal Boxes | YIYUAN',
  description: 'Browse PE/PVC cling film, kraft meal boxes, PP/PET containers, bagasse clamshells and custom printed food packaging for bulk orders.',
  keywords: 'food packaging products, cling film, meal boxes, disposable containers, custom packaging',
  image: '/images/product-cling-film.webp',
})

type ProductCategory = {
  id: number
  slug: string
  name: string
  description: string
  image: string
  productCount: number
}

const { data: catalogData } = await useFetch<{ categories: ProductCategory[]; items: Product[] }>('/api/public/products')
const categories = computed(() => catalogData.value?.categories || [])
const products = computed(() => catalogData.value?.items || [])
</script>

<template>
  <div>
    <!-- Page header -->
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="!text-white/70 mb-4 [&_.el-breadcrumb__inner]:!text-white/70">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item>Products</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="text-[clamp(28px,4vw,40px)] font-extrabold leading-tight">Cling Film and Food Packaging</h1>
        <p class="mt-3 text-[16px] text-white/80 max-w-2xl leading-relaxed">
          Cling film, containers, and custom packaging for wholesale and OEM supply.
        </p>
      </div>
    </section>

    <!-- Filters + grid -->
    <section class="section bg-white">
      <div class="container-x">
        <div class="flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-5">
          <NuxtLink
            to="/products"
            class="border border-[var(--color-navy)] bg-[var(--color-navy)] px-4 py-2 text-[14px] font-semibold text-white transition-colors"
          >
            All Products
          </NuxtLink>
          <NuxtLink
            v-for="c in categories"
            :key="c.slug"
            :to="`/products/category/${c.slug}`"
            class="border border-[var(--color-line)] bg-white px-4 py-2 text-[14px] font-semibold text-[var(--color-graphite)] transition-colors hover:border-[var(--color-navy)]"
          >
            {{ c.name }}
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="p in products" :key="p.slug" :product="p" />
        </div>

        <div v-if="!products.length" class="py-16 text-center text-[var(--color-slate-muted)]">
          No products in this category yet.
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[var(--color-panel)] border-t border-[var(--color-line)]">
      <div class="container-x py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-[22px] font-extrabold text-[var(--color-navy)]">Need OEM Specs or Bulk Pricing?</h2>
          <p class="mt-2 text-[15px] text-[var(--color-slate-muted)]">Send size, quantity, and packaging requirements for quotation.</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/contact"><el-button color="#c1121f" size="large">Get a Quote</el-button></NuxtLink>
          <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">WhatsApp</el-button>
        </div>
      </div>
    </section>
  </div>
</template>
