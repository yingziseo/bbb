<script setup lang="ts">
import { Check, Close, Promotion } from '@element-plus/icons-vue'
import { buyerDocumentList } from '~/data/documents'
import type { Product } from '~/data/site'

const company = await useSiteSettings()
const { isCn, text, localePath, htmlLang, seoAlternatePaths } = useLocale()

const route = useRoute()

definePageMeta({
  alias: ['/cn/products/:slug'],
})

const { data } = await useFetch<{ item: Product }>(`/api/public/products/${route.params.slug}`)
const product = computed(() => data.value?.item)

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}

const page = computed(() => isCn.value ? {
  seo: {
    title: `${product.value?.name || ''} | 产品详情 | 宜沅新材料`,
    description: `查看 ${product.value?.name || '产品'} 的材质、起订量、包装方式和可选规格，支持批发采购、OEM 定制和出口询盘。`,
    keywords: `${product.value?.name || ''}, ${product.value?.category || ''}, 食品包装, 保鲜膜, 一次性餐盒, OEM定制, 出口供应`,
  },
  parameter: '参数',
  specification: '规格',
  sizeCapacity: '规格 / 容量',
  dimension: '尺寸 / 厚度',
  packing: '装箱',
  typicalUses: '适用场景',
  documents: '资料文件',
  requestPricing: '获取报价',
  requestDesc: '请发送数量和规格。',
  getPricing: '询价',
} : {
  seo: {
    title: product.value?.seoTitle || `${product.value?.name} Manufacturer in China | ${company.displayName}`,
    description: product.value?.seoDescription || product.value?.shortDesc || '',
    keywords: product.value?.seoKeywords || `${product.value?.name}, ${product.value?.category}, ${product.value?.material}`,
  },
  parameter: 'Parameter',
  specification: 'Specification',
  sizeCapacity: 'Size / Capacity',
  dimension: 'Dimension / Thickness',
  packing: 'Packing',
  typicalUses: 'Typical Uses',
  documents: 'Documents',
  requestPricing: 'Request Pricing',
  requestDesc: 'Send quantity and specifications for quotation.',
  getPricing: 'Get Pricing',
})

await useManagedSeo(`product:${route.params.slug}`, computed(() => ({
  ...page.value.seo,
  image: product.value.image,
})), {
  fallbackOnly: isCn,
  canonicalPath: computed(() => localePath(`/products/${route.params.slug}`)),
  htmlLang,
  alternatePaths: computed(() => seoAlternatePaths()),
})

const { data: catalogData } = await useFetch<{ items: Product[] }>('/api/public/products')
const related = computed(() =>
  (catalogData.value?.items || [])
    .filter((p) => p.categorySlug === product.value?.categorySlug && p.slug !== product.value?.slug)
    .slice(0, 3),
)
const productDocuments = buyerDocumentList
</script>

<template>
  <div v-if="product">
    <section class="bg-[var(--color-panel)] border-b border-[var(--color-line)]">
      <div class="container-x py-5">
        <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--light">
          <el-breadcrumb-item :to="{ path: localePath('/') }">{{ text.nav.home }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: localePath('/products') }">{{ text.nav.products }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </section>

    <section class="section bg-white !pt-12">
      <div class="container-x grid lg:grid-cols-2 gap-10 lg:gap-14">
        <!-- Image -->
        <div class="min-w-0">
          <div class="overflow-hidden border border-[var(--color-line)] bg-[var(--color-panel)]">
            <img :src="product.image" :alt="product.name" class="w-full aspect-square object-cover" />
          </div>
        </div>

        <!-- Info -->
        <div class="min-w-0">
          <span class="inline-block bg-[var(--color-navy)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
            {{ product.category }}
          </span>
          <h1 class="mt-4 text-[clamp(26px,3.4vw,34px)] font-extrabold text-[var(--color-navy)] leading-tight">{{ product.name }}</h1>
          <p class="mt-4 text-[16px] leading-relaxed text-[var(--color-slate-muted)]">{{ product.shortDesc }}</p>

          <div class="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2">
            <div class="min-w-0 bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ text.labels.material }}</div>
              <div class="mt-1 break-words text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.material }}</div>
            </div>
            <div class="min-w-0 bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ text.labels.moq }}</div>
              <div class="mt-1 break-words text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.moq }}</div>
            </div>
            <div class="min-w-0 bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ text.labels.customization }}</div>
              <div class="mt-1 text-[14.5px] font-semibold flex items-center gap-1.5" :class="product.custom ? 'text-[var(--color-navy)]' : 'text-[var(--color-slate-muted)]'">
                <el-icon :class="product.custom ? 'text-[var(--color-accent)]' : ''"><component :is="product.custom ? Check : Close" /></el-icon>
                <span class="min-w-0 break-words">{{ product.custom ? text.labels.customAvailable : text.labels.standardOnly }}</span>
              </div>
            </div>
            <div class="min-w-0 bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ text.labels.packaging }}</div>
              <div class="mt-1 break-words text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.packaging }}</div>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink :to="localePath(`/contact?product=${encodeURIComponent(product.name)}`)">
              <el-button color="#c1121f" size="large">
                <el-icon><Promotion /></el-icon>
                <span>{{ text.actions.sendInquiry }}</span>
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
      </div>
    </section>

    <!-- Specs + applications -->
    <section class="section bg-[var(--color-panel)] border-y border-[var(--color-line)] !pt-12">
      <div class="container-x grid lg:grid-cols-3 gap-8">
        <div class="min-w-0 lg:col-span-2">
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-4">{{ text.labels.specifications }}</h2>
          <el-table :data="product.specs" border stripe class="hidden overflow-hidden md:block">
            <el-table-column prop="label" :label="page.parameter" width="240">
              <template #default="{ row }">
                <span class="font-semibold text-[var(--color-navy)]">{{ row.label }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="value" :label="page.specification" />
          </el-table>
          <div class="grid gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] md:hidden">
            <div v-for="row in product.specs" :key="row.label" class="bg-white p-4">
              <div class="text-[12px] font-bold uppercase tracking-wide text-[var(--color-slate-muted)]">{{ row.label }}</div>
              <div class="mt-1 break-words text-[14.5px] font-semibold text-[var(--color-navy)]">{{ row.value }}</div>
            </div>
          </div>

          <div v-if="product.sizeOptions?.length" class="mt-8">
            <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-4">{{ text.labels.sizeOptions }}</h2>
            <el-table :data="product.sizeOptions" border stripe class="hidden overflow-hidden md:block">
              <el-table-column prop="label" :label="page.sizeCapacity" min-width="160" />
              <el-table-column prop="value" :label="page.dimension" min-width="180" />
              <el-table-column prop="packaging" :label="page.packing" min-width="160" />
            </el-table>
            <div class="grid gap-3 md:hidden">
              <div
                v-for="row in product.sizeOptions"
                :key="`${row.label}-${row.value}-${row.packaging}`"
                class="border border-[var(--color-line)] bg-white p-4"
              >
                <div class="break-words text-[15px] font-extrabold text-[var(--color-navy)]">{{ row.label }}</div>
                <dl class="mt-3 grid gap-3 text-[13.5px]">
                  <div>
                    <dt class="text-[11px] font-bold uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.dimension }}</dt>
                    <dd class="mt-1 break-words font-semibold text-[var(--color-graphite)]">{{ row.value }}</dd>
                  </div>
                  <div>
                    <dt class="text-[11px] font-bold uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.packing }}</dt>
                    <dd class="mt-1 break-words font-semibold text-[var(--color-graphite)]">{{ row.packaging }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="min-w-0">
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-4">{{ page.typicalUses }}</h2>
          <div class="flex flex-wrap gap-2">
            <el-tag v-for="a in product.applications" :key="a" type="info" effect="plain" size="large" class="!rounded-none">
              {{ a }}
            </el-tag>
          </div>

          <div class="mt-8">
            <DocumentDownloads
              :title="page.documents"
              :documents="productDocuments"
              compact
            />
          </div>

          <div class="mt-8 bg-[var(--color-navy)] p-6 text-white">
            <h3 class="text-[16px] font-bold">{{ page.requestPricing }}</h3>
            <p class="mt-2 text-[13.5px] text-white/75 leading-relaxed">{{ page.requestDesc }}</p>
            <NuxtLink :to="localePath(`/contact?product=${encodeURIComponent(product.name)}`)" class="inline-block mt-4">
              <el-button color="#c1121f">
                <el-icon><Promotion /></el-icon>
                <span>{{ page.getPricing }}</span>
              </el-button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Related -->
    <section v-if="related.length" class="section bg-white">
      <div class="container-x">
        <h2 class="text-[22px] font-extrabold text-[var(--color-navy)] mb-8">{{ text.labels.relatedProducts }}</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="p in related" :key="p.slug" :product="p" />
        </div>
      </div>
    </section>
  </div>
</template>
