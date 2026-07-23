<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'
import { buyerDocuments } from '~/data/documents'
import type { Product } from '~/data/site'

const company = await useSiteSettings()
const { isCn, text, localePath, htmlLang, seoAlternatePaths } = useLocale()

definePageMeta({
  alias: ['/cn/products'],
})

const page = computed(() => isCn.value ? {
  seo: {
    title: '产品中心 | 保鲜膜与食品容器 | 宜沅新材料',
    description: '查看商丘市宜沅新材料有限公司的保鲜膜、生鲜保鲜膜、一次性食品容器和 OEM 定制包装产品，支持批发和出口询盘。',
    keywords: '产品中心, 保鲜膜, 食品包装, 一次性餐盒, 食品容器, OEM包装, 批发包装, 出口包装',
  },
  breadcrumb: '产品中心',
  title: '保鲜膜与食品包装',
  desc: '保鲜膜、食品容器和定制包装，支持批发与 OEM 订单。',
  catalogTitle: '产品资料',
  ctaTitle: '需要规格或批量报价？',
  ctaDesc: '请发送尺寸、数量和包装需求。',
} : {
  seo: {
    title: 'Food Packaging Products | Cling Film & Containers | YIYUAN',
    description: 'Explore YIYUAN food packaging products, including PE/PVC cling film, jumbo rolls, cutter box film, meal boxes, cups, and containers for wholesale, OEM/ODM, and import supply.',
    keywords: 'food packaging products, cling film products, food wrap supplier, disposable food containers, meal boxes, cups, jumbo roll film, cutter box film, wholesale packaging, OEM ODM packaging',
  },
  breadcrumb: 'Products',
  title: 'Cling Film and Food Packaging',
  desc: 'Cling film, containers, and custom packaging for wholesale and OEM supply.',
  catalogTitle: 'Product Catalog',
  ctaTitle: 'Need OEM Specs or Bulk Pricing?',
  ctaDesc: 'Send size, quantity, and packaging requirements for quotation.',
})

await useManagedSeo('page:products', computed(() => ({
  ...page.value.seo,
  image: '/images/product-cling-film.webp',
})), {
  fallbackOnly: isCn,
  canonicalPath: computed(() => (isCn.value ? '/cn/products' : '/products')),
  htmlLang,
  alternatePaths: computed(() => seoAlternatePaths()),
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
const productDocuments = [buyerDocuments.productCatalog]
</script>

<template>
  <div>
    <!-- Page header -->
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-4">
          <el-breadcrumb-item :to="{ path: localePath('/') }">{{ text.nav.home }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ page.breadcrumb }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="text-[clamp(28px,4vw,40px)] font-extrabold leading-tight">{{ page.title }}</h1>
        <p class="mt-3 text-[16px] text-white/80 max-w-2xl leading-relaxed">
          {{ page.desc }}
        </p>
      </div>
    </section>

    <!-- Filters + grid -->
    <section class="section bg-white">
      <div class="container-x">
        <div class="flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-5">
          <NuxtLink
            :to="localePath('/products')"
            class="border border-[var(--color-navy)] bg-[var(--color-navy)] px-4 py-2 text-[14px] font-semibold text-white transition-colors"
          >
            {{ text.labels.allProducts }}
          </NuxtLink>
          <NuxtLink
            v-for="c in categories"
            :key="c.slug"
            :to="localePath(`/products/category/${c.slug}`)"
            class="border border-[var(--color-line)] bg-white px-4 py-2 text-[14px] font-semibold text-[var(--color-graphite)] transition-colors hover:border-[var(--color-navy)]"
          >
            {{ c.name }}
          </NuxtLink>
        </div>

        <div class="mt-8">
          <DocumentDownloads
            :title="page.catalogTitle"
            :documents="productDocuments"
            compact
          />
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="p in products" :key="p.slug" :product="p" />
        </div>

        <div v-if="!products.length" class="py-16 text-center text-[var(--color-slate-muted)]">
          {{ text.labels.noProducts }}
        </div>
      </div>
    </section>

    <BuyerGuideLinks v-if="!isCn" />

    <!-- CTA -->
    <section class="bg-[var(--color-panel)] border-t border-[var(--color-line)]">
      <div class="container-x py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-[22px] font-extrabold text-[var(--color-navy)]">{{ page.ctaTitle }}</h2>
          <p class="mt-2 text-[15px] text-[var(--color-slate-muted)]">{{ page.ctaDesc }}</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink :to="localePath('/contact')">
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
