<script setup lang="ts">
import { Check, Close, ChatDotRound } from '@element-plus/icons-vue'
import { products, company } from '~/data/site'

const route = useRoute()
const product = computed(() => products.find((p) => p.slug === route.params.slug))

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}

useHead({ title: () => `${product.value?.name} | ${company.name}` })

const related = computed(() =>
  products.filter((p) => p.category === product.value?.category && p.slug !== product.value?.slug).slice(0, 3),
)
</script>

<template>
  <div v-if="product">
    <section class="bg-[var(--color-panel)] border-b border-[var(--color-line)]">
      <div class="container-x py-5">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/products' }">Products</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </section>

    <section class="section bg-white !pt-12">
      <div class="container-x grid lg:grid-cols-2 gap-10 lg:gap-14">
        <!-- Image -->
        <div>
          <div class="overflow-hidden border border-[var(--color-line)] bg-[var(--color-panel)]">
            <img :src="product.image" :alt="product.name" class="w-full aspect-square object-cover" />
          </div>
        </div>

        <!-- Info -->
        <div>
          <span class="inline-block bg-[var(--color-navy)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
            {{ product.category }}
          </span>
          <h1 class="mt-4 text-[clamp(26px,3.4vw,34px)] font-extrabold text-[var(--color-navy)] leading-tight">{{ product.name }}</h1>
          <p class="mt-4 text-[16px] leading-relaxed text-[var(--color-slate-muted)]">{{ product.shortDesc }}</p>

          <div class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)]">
            <div class="bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Material</div>
              <div class="mt-1 text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.material }}</div>
            </div>
            <div class="bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">MOQ</div>
              <div class="mt-1 text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.moq }}</div>
            </div>
            <div class="bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Customization</div>
              <div class="mt-1 text-[14.5px] font-semibold flex items-center gap-1.5" :class="product.custom ? 'text-[var(--color-navy)]' : 'text-[var(--color-slate-muted)]'">
                <el-icon :class="product.custom ? 'text-[var(--color-accent)]' : ''"><component :is="product.custom ? Check : Close" /></el-icon>
                {{ product.custom ? 'OEM / ODM Supported' : 'Standard Only' }}
              </div>
            </div>
            <div class="bg-white p-4">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Packaging</div>
              <div class="mt-1 text-[14.5px] font-semibold text-[var(--color-navy)]">{{ product.packaging }}</div>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink :to="`/contact?product=${encodeURIComponent(product.name)}`">
              <el-button color="#c1121f" size="large">Send Inquiry</el-button>
            </NuxtLink>
            <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">
              <el-icon class="mr-1"><ChatDotRound /></el-icon>WhatsApp
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Specs + applications -->
    <section class="section bg-[var(--color-panel)] border-y border-[var(--color-line)] !pt-12">
      <div class="container-x grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-4">Specifications</h2>
          <el-table :data="product.specs" border stripe class="overflow-hidden">
            <el-table-column prop="label" label="Parameter" width="240">
              <template #default="{ row }">
                <span class="font-semibold text-[var(--color-navy)]">{{ row.label }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="Specification" />
          </el-table>
        </div>

        <div>
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-4">Applications</h2>
          <div class="flex flex-wrap gap-2">
            <el-tag v-for="a in product.applications" :key="a" type="info" effect="plain" size="large" class="!rounded-none">
              {{ a }}
            </el-tag>
          </div>

          <div class="mt-8 bg-[var(--color-navy)] p-6 text-white">
            <h3 class="text-[16px] font-bold">Request a Quote</h3>
            <p class="mt-2 text-[13.5px] text-white/75 leading-relaxed">Send quantity and specifications for quotation.</p>
            <NuxtLink :to="`/contact?product=${encodeURIComponent(product.name)}`" class="inline-block mt-4">
              <el-button color="#c1121f">Get Pricing</el-button>
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
