<script setup lang="ts">
import { products, categories, company } from '~/data/site'

useHead({ title: `Products | ${company.name}` })

const route = useRoute()
const router = useRouter()

const categoryNameBySlug: Record<string, string> = {
  'disposable-containers': 'Disposable Containers',
  'cling-film': 'Cling Film & Fresh Wrap',
  'food-containers': 'Food Packaging Containers',
  'custom-packaging': 'Custom Packaging',
}

const active = ref<string>((route.query.category as string) || 'all')

watch(
  () => route.query.category,
  (v) => {
    active.value = (v as string) || 'all'
  },
)

const setFilter = (slug: string) => {
  active.value = slug
  router.replace({ query: slug === 'all' ? {} : { category: slug } })
}

const filtered = computed(() => {
  if (active.value === 'all') return products
  const name = categoryNameBySlug[active.value]
  return products.filter((p) => p.category === name)
})
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
        <h1 class="text-[clamp(28px,4vw,40px)] font-extrabold leading-tight">Food Packaging Products</h1>
        <p class="mt-3 text-[16px] text-white/80 max-w-2xl leading-relaxed">
          Cling film, containers, and custom packaging for OEM and export orders.
        </p>
      </div>
    </section>

    <!-- Filters + grid -->
    <section class="section bg-white">
      <div class="container-x">
        <div class="flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-5">
          <button
            class="border px-4 py-2 text-[14px] font-semibold transition-colors"
            :class="active === 'all'
              ? 'bg-[var(--color-navy)] text-white border-[var(--color-navy)]'
              : 'bg-white text-[var(--color-graphite)] border-[var(--color-line)] hover:border-[var(--color-navy)]'"
            @click="setFilter('all')"
          >
            All Products
          </button>
          <button
            v-for="c in categories"
            :key="c.slug"
            class="border px-4 py-2 text-[14px] font-semibold transition-colors"
            :class="active === c.slug
              ? 'bg-[var(--color-navy)] text-white border-[var(--color-navy)]'
              : 'bg-white text-[var(--color-graphite)] border-[var(--color-line)] hover:border-[var(--color-navy)]'"
            @click="setFilter(c.slug)"
          >
            {{ c.name }}
          </button>
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="p in filtered" :key="p.slug" :product="p" />
        </div>

        <div v-if="!filtered.length" class="py-16 text-center text-[var(--color-slate-muted)]">
          No products in this category yet.
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[var(--color-panel)] border-t border-[var(--color-line)]">
      <div class="container-x py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-[22px] font-extrabold text-[var(--color-navy)]">Need a custom specification or bulk pricing?</h2>
          <p class="mt-2 text-[15px] text-[var(--color-slate-muted)]">Send quantity, size, and product details.</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/contact"><el-button color="#c1121f" size="large">Get a Quote</el-button></NuxtLink>
          <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">WhatsApp</el-button>
        </div>
      </div>
    </section>
  </div>
</template>
