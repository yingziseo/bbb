<script setup lang="ts">
type BlogPost = {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  publishedAt: string
  createdAt: string
}

const props = withDefaults(
  defineProps<{
    items: BlogPost[]
    currentPage: number
    totalPages: number
    showFeatured?: boolean
  }>(),
  {
    showFeatured: false,
  },
)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const featured = computed(() => (props.showFeatured ? props.items[0] : null))
const gridPosts = computed(() => (props.showFeatured ? props.items.slice(1) : props.items))
</script>

<template>
  <div>
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-4">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item>Blog</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="text-[clamp(28px,4vw,40px)] font-extrabold leading-tight">Packaging Insights & Sourcing Guides</h1>
        <p class="mt-3 max-w-2xl text-[16px] leading-relaxed text-white/80">
          Notes on materials, sourcing, and packaging use cases.
        </p>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x">
        <NuxtLink
          v-if="featured"
          :to="`/blog/${featured.slug}`"
          class="group mb-12 grid gap-0 overflow-hidden border border-[var(--color-line)] md:grid-cols-2"
        >
          <div class="aspect-[16/10] overflow-hidden bg-[var(--color-panel)] md:aspect-auto">
            <RuntimeImage
              :src="featured.coverImage"
              :alt="featured.title"
              width="1000"
              height="625"
              sizes="sm:100vw md:50vw lg:560px"
              :preload="{ fetchPriority: 'high' }"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              image-class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
          <div class="flex flex-col justify-center p-7 sm:p-9">
            <div class="flex items-center gap-3 text-[12.5px]">
              <span class="bg-[var(--color-navy)] px-2.5 py-1 font-bold uppercase text-white">Article</span>
              <span class="text-[var(--color-slate-muted)]">{{ formatDate(featured.publishedAt || featured.createdAt) }}</span>
            </div>
            <h2 class="mt-4 text-balance text-[24px] font-extrabold leading-snug text-[var(--color-navy)] transition-colors group-hover:text-[var(--color-accent)]">
              {{ featured.title }}
            </h2>
            <p class="mt-3 text-[15px] leading-relaxed text-[var(--color-slate-muted)]">{{ featured.excerpt }}</p>
            <span class="mt-5 text-[14px] font-semibold text-[var(--color-accent)]">Read article -></span>
          </div>
        </NuxtLink>

        <div v-if="gridPosts.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="p in gridPosts"
            :key="p.slug"
            :to="`/blog/${p.slug}`"
            class="group flex flex-col overflow-hidden border border-[var(--color-line)] bg-white"
          >
            <div class="aspect-[16/10] overflow-hidden bg-[var(--color-panel)]">
              <RuntimeImage
                :src="p.coverImage"
                :alt="p.title"
                width="640"
                height="400"
                sizes="sm:100vw md:50vw lg:33vw"
                loading="lazy"
                fetchpriority="low"
                decoding="async"
                image-class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </div>
            <div class="flex flex-1 flex-col p-5">
              <div class="flex items-center gap-2 text-[12px] text-[var(--color-slate-muted)]">
                <span class="font-bold uppercase text-[var(--color-accent)]">Article</span>
                <span>|</span>
                <span>{{ formatDate(p.publishedAt || p.createdAt) }}</span>
              </div>
              <h3 class="mt-2 text-[17px] font-bold leading-snug text-[var(--color-navy)] transition-colors group-hover:text-[var(--color-accent)]">
                {{ p.title }}
              </h3>
              <p class="mt-2 flex-1 text-[13.5px] leading-relaxed text-[var(--color-slate-muted)]">{{ p.excerpt }}</p>
              <span class="mt-4 text-[13px] text-[var(--color-slate-muted)]">Read article</span>
            </div>
          </NuxtLink>
        </div>

        <div v-else-if="!featured" class="border border-[var(--color-line)] bg-[var(--color-panel)] p-8 text-center text-[var(--color-slate-muted)]">
          Articles are being prepared.
        </div>

        <BlogPagination :current-page="currentPage" :total-pages="totalPages" />
      </div>
    </section>
  </div>
</template>
