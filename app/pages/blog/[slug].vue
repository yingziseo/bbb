<script setup lang="ts">
const company = await useSiteSettings()

const route = useRoute()
const { data } = await useFetch(`/api/public/posts/${route.params.slug}`)

if (!data.value?.item) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const post = computed(() => data.value?.item)

await useManagedSeo(`post:${route.params.slug}`, {
  title: data.value.item.seoTitle || `${data.value.item.title} | YIYUAN`,
  description: data.value.item.seoDescription || data.value.item.excerpt,
  keywords: data.value.item.seoKeywords,
  image: data.value.item.coverImage,
})

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const { data: moreData } = await useFetch('/api/public/posts')
const more = computed(() => (moreData.value?.items || []).filter((p) => p.slug !== post.value?.slug).slice(0, 2))
</script>

<template>
  <div v-if="post">
    <section class="bg-[var(--color-panel)] border-b border-[var(--color-line)]">
      <div class="container-x py-5">
        <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--light">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/blog' }">Blog</el-breadcrumb-item>
          <el-breadcrumb-item>Article</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </section>

    <article class="section bg-white !pt-12">
      <div class="container-x">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,768px)_260px] lg:items-start lg:justify-center">
          <div class="min-w-0">
            <div class="flex items-center gap-3 text-[13px]">
              <span class="bg-[var(--color-navy)] px-2.5 py-1 font-bold uppercase tracking-wide text-white">Article</span>
              <span class="text-[var(--color-slate-muted)]">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
            </div>
            <h1 class="mt-4 text-[clamp(26px,3.6vw,38px)] font-extrabold text-[var(--color-navy)] leading-tight text-balance">{{ post.title }}</h1>

            <div v-if="post.coverImage" class="mt-7 overflow-hidden border border-[var(--color-line)]">
              <NuxtImg
                :src="post.coverImage"
                :alt="post.title"
                width="1200"
                height="675"
                sizes="sm:100vw md:768px lg:768px"
                :preload="{ fetchPriority: 'high' }"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                class="w-full aspect-[16/9] object-cover"
              />
            </div>

            <div class="article-body mt-8" v-html="post.contentHtml" />

            <!-- Inline CTA -->
            <div class="mt-10 bg-[var(--color-navy)] p-7 text-white">
              <h3 class="text-[19px] font-extrabold">Need product details?</h3>
              <p class="mt-2 text-[14.5px] text-white/75 leading-relaxed">Contact us for product information and quotation.</p>
              <div class="mt-5 flex flex-wrap gap-3">
                <NuxtLink to="/contact"><el-button color="#c1121f">Get a Quote</el-button></NuxtLink>
                <el-button tag="a" :href="company.whatsappLink" target="_blank" color="#1b3c63">WhatsApp</el-button>
              </div>
            </div>
          </div>

          <ArticleToc :content-key="post.slug" target-selector=".article-body" />
        </div>
      </div>
    </article>

    <!-- More articles -->
    <section v-if="more.length" class="section bg-[var(--color-panel)] border-t border-[var(--color-line)]">
      <div class="container-x">
        <h2 class="text-[22px] font-extrabold text-[var(--color-navy)] mb-8">More Articles</h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <NuxtLink
            v-for="p in more"
            :key="p.slug"
            :to="`/blog/${p.slug}`"
            class="group flex flex-col overflow-hidden border border-[var(--color-line)] bg-white sm:flex-row"
          >
            <div class="sm:w-44 shrink-0 aspect-[16/10] sm:aspect-auto overflow-hidden bg-[var(--color-panel-2)]">
              <NuxtImg
                :src="p.coverImage"
                :alt="p.title"
                width="320"
                height="200"
                sizes="sm:100vw md:176px lg:176px"
                loading="lazy"
                fetchpriority="low"
                decoding="async"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="p-5">
              <span class="text-[12px] font-bold text-[var(--color-accent)] uppercase tracking-wide">Article</span>
              <h3 class="mt-1.5 text-[16px] font-bold text-[var(--color-navy)] leading-snug group-hover:text-[var(--color-accent)] transition-colors">{{ p.title }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
