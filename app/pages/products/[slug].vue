<script setup lang="ts">
import { Check, Close, Promotion } from '@element-plus/icons-vue'
import { buyerDocumentList } from '~/data/documents'
import type { Product } from '~/data/site'

const company = await useSiteSettings()

const route = useRoute()
const { data } = await useFetch<{ item: Product }>(`/api/public/products/${route.params.slug}`)
const product = computed(() => data.value?.item)

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}

await useManagedSeo(`product:${route.params.slug}`, {
  title: product.value.seoTitle || `${product.value.name} Manufacturer in China | ${company.displayName}`,
  description: product.value.seoDescription || product.value.shortDesc,
  keywords: product.value.seoKeywords || `${product.value.name}, ${product.value.category}, ${product.value.material}`,
  image: product.value.image,
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
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/products' }">Products</el-breadcrumb-item>
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
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Material</div>
              <div class="mt-1 break-words text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.material }}</div>
            </div>
            <div class="min-w-0 bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">MOQ</div>
              <div class="mt-1 break-words text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.moq }}</div>
            </div>
            <div class="min-w-0 bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Customization</div>
              <div class="mt-1 text-[14.5px] font-semibold flex items-center gap-1.5" :class="product.custom ? 'text-[var(--color-navy)]' : 'text-[var(--color-slate-muted)]'">
                <el-icon :class="product.custom ? 'text-[var(--color-accent)]' : ''"><component :is="product.custom ? Check : Close" /></el-icon>
                <span class="min-w-0 break-words">{{ product.custom ? 'Custom Production Available' : 'Standard Only' }}</span>
              </div>
            </div>
            <div class="min-w-0 bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Packaging</div>
              <div class="mt-1 break-words text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.packaging }}</div>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink :to="`/contact?product=${encodeURIComponent(product.name)}`">
              <el-button color="#c1121f" size="large">
                <el-icon><Promotion /></el-icon>
                <span>Send Inquiry</span>
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
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-4">Specifications</h2>
          <el-table :data="product.specs" border stripe class="hidden overflow-hidden md:block">
            <el-table-column prop="label" label="Parameter" width="240">
              <template #default="{ row }">
                <span class="font-semibold text-[var(--color-navy)]">{{ row.label }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="Specification" />
          </el-table>
          <div class="grid gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] md:hidden">
            <div v-for="row in product.specs" :key="row.label" class="bg-white p-4">
              <div class="text-[12px] font-bold uppercase tracking-wide text-[var(--color-slate-muted)]">{{ row.label }}</div>
              <div class="mt-1 break-words text-[14.5px] font-semibold text-[var(--color-navy)]">{{ row.value }}</div>
            </div>
          </div>

          <div v-if="product.sizeOptions?.length" class="mt-8">
            <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-4">Size Options</h2>
            <el-table :data="product.sizeOptions" border stripe class="hidden overflow-hidden md:block">
              <el-table-column prop="label" label="Size / Capacity" min-width="160" />
              <el-table-column prop="value" label="Dimension / Thickness" min-width="180" />
              <el-table-column prop="packaging" label="Packing" min-width="160" />
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
                    <dt class="text-[11px] font-bold uppercase tracking-wide text-[var(--color-slate-muted)]">Dimension / Thickness</dt>
                    <dd class="mt-1 break-words font-semibold text-[var(--color-graphite)]">{{ row.value }}</dd>
                  </div>
                  <div>
                    <dt class="text-[11px] font-bold uppercase tracking-wide text-[var(--color-slate-muted)]">Packing</dt>
                    <dd class="mt-1 break-words font-semibold text-[var(--color-graphite)]">{{ row.packaging }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="min-w-0">
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-4">Typical Uses</h2>
          <div class="flex flex-wrap gap-2">
            <el-tag v-for="a in product.applications" :key="a" type="info" effect="plain" size="large" class="!rounded-none">
              {{ a }}
            </el-tag>
          </div>

          <div class="mt-8">
            <DocumentDownloads
              title="Available Documents"
              subtitle="Review product information and quality documents before confirming specifications."
              :documents="productDocuments"
              compact
            />
          </div>

          <div class="mt-8 bg-[var(--color-navy)] p-6 text-white">
            <h3 class="text-[16px] font-bold">Request Pricing</h3>
            <p class="mt-2 text-[13.5px] text-white/75 leading-relaxed">Send quantity and specifications for quotation.</p>
            <NuxtLink :to="`/contact?product=${encodeURIComponent(product.name)}`" class="inline-block mt-4">
              <el-button color="#c1121f">
                <el-icon><Promotion /></el-icon>
                <span>Get Pricing</span>
              </el-button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Related -->
    <section v-if="related.length" class="section bg-white">
      <div class="container-x">
        <h2 class="text-[22px] font-extrabold text-[var(--color-navy)] mb-8">Related Products</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="p in related" :key="p.slug" :product="p" />
        </div>
      </div>
    </section>
  </div>
</template>
