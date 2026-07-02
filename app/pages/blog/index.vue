<script setup lang="ts">
const BLOG_PAGE_SIZE = 9

await useManagedSeo('page:blog', {
  title: 'Food Packaging Sourcing Guides & Material Insights | YIYUAN',
  description: 'Read YIYUAN guides on cling film, food wrap, disposable containers, material selection, OEM/ODM packaging, wholesale sourcing, and export packaging trends.',
  keywords: 'food packaging blog, cling film guide, food wrap sourcing, disposable container guide, packaging material insights, OEM ODM packaging guide, wholesale packaging tips, export packaging trends',
  image: '/images/blog-supplier.webp',
})

const { data } = await useFetch('/api/public/posts', {
  query: {
    page: 1,
    pageSize: BLOG_PAGE_SIZE,
  },
})

const requestUrl = useRequestURL()
const toAbsoluteUrl = (path: string) => `${requestUrl.origin}${path}`

const posts = computed(() => data.value?.items || [])
const totalPages = computed(() => data.value?.totalPages || 1)

useHead(() => ({
  link: totalPages.value > 1 ? [{ rel: 'next', href: toAbsoluteUrl('/blog/page/2') }] : [],
}))
</script>

<template>
  <BlogListing :items="posts" :current-page="1" :total-pages="totalPages" show-featured />
</template>
