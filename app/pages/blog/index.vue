<script setup lang="ts">
await useManagedSeo('page:blog', {
  title: 'Food Packaging Sourcing Guides & Material Insights | YIYUAN',
  description: 'Read food packaging sourcing guides, material comparisons and wholesale purchasing tips for cling film, containers and custom packaging.',
  keywords: 'food packaging sourcing guide, packaging material comparison, wholesale packaging tips',
  image: '/images/blog-supplier.webp',
})

const { data } = await useFetch('/api/public/posts')

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const posts = computed(() => data.value?.items || [])
const featured = computed(() => posts.value[0])
const rest = computed(() => posts.value.slice(1))
</script>

<template>
  <div>
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="mb-4 [&_.el-breadcrumb__inner]:!text-white/70">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item>Blog</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="text-[clamp(28px,4vw,40px)] font-extrabold leading-tight">Packaging Insights & Sourcing Guides</h1>
        <p class="mt-3 text-[16px] text-white/80 max-w-2xl leading-relaxed">
          Notes on materials, sourcing, and packaging use cases.
        </p>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x">
        <!-- Featured -->
        <NuxtLink
          v-if="featured"
          :to="`/blog/${featured.slug}`"
          class="group mb-12 grid gap-0 overflow-hidden border border-[var(--color-line)] md:grid-cols-2"
        >
          <div class="aspect-[16/10] md:aspect-auto overflow-hidden bg-[var(--color-panel)]">
            <img :src="featured.coverImage" :alt="featured.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          </div>
          <div class="p-7 sm:p-9 flex flex-col justify-center">
            <div class="flex items-center gap-3 text-[12.5px]">
              <span class="bg-[var(--color-navy)] px-2.5 py-1 font-bold uppercase tracking-wide text-white">Article</span>
              <span class="text-[var(--color-slate-muted)]">{{ formatDate(featured.publishedAt || featured.createdAt) }}</span>
            </div>
            <h2 class="mt-4 text-[24px] font-extrabold text-[var(--color-navy)] leading-snug group-hover:text-[var(--color-accent)] transition-colors text-balance">
              {{ featured.title }}
            </h2>
            <p class="mt-3 text-[15px] leading-relaxed text-[var(--color-slate-muted)]">{{ featured.excerpt }}</p>
            <span class="mt-5 text-[14px] font-semibold text-[var(--color-accent)]">Read article →</span>
          </div>
        </NuxtLink>

        <!-- Grid -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="p in rest"
            :key="p.slug"
            :to="`/blog/${p.slug}`"
            class="group flex flex-col overflow-hidden border border-[var(--color-line)] bg-white"
          >
            <div class="aspect-[16/10] overflow-hidden bg-[var(--color-panel)]">
              <img :src="p.coverImage" :alt="p.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
            </div>
            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-center gap-2 text-[12px] text-[var(--color-slate-muted)]">
                <span class="font-bold text-[var(--color-accent)] uppercase tracking-wide">Article</span>
                <span>·</span>
                <span>{{ formatDate(p.publishedAt || p.createdAt) }}</span>
              </div>
              <h3 class="mt-2 text-[17px] font-bold text-[var(--color-navy)] leading-snug group-hover:text-[var(--color-accent)] transition-colors">{{ p.title }}</h3>
              <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--color-slate-muted)] flex-1">{{ p.excerpt }}</p>
              <span class="mt-4 text-[13px] text-[var(--color-slate-muted)]">Read article</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
