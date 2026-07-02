<script setup lang="ts">
const BLOG_PAGE_SIZE = 9

const route = useRoute()
const rawPage = Array.isArray(route.params.page) ? route.params.page[0] : route.params.page
const requestedPage = Number.parseInt(String(rawPage || ''), 10)

if (!/^\d+$/.test(String(rawPage || '')) || requestedPage < 2) {
  throw createError({ statusCode: 404, statusMessage: 'Blog page not found', fatal: true })
}

const { data } = await useFetch('/api/public/posts', {
  query: {
    page: requestedPage,
    pageSize: BLOG_PAGE_SIZE,
  },
})

if (!data.value || requestedPage > data.value.totalPages) {
  throw createError({ statusCode: 404, statusMessage: 'Blog page not found', fatal: true })
}

await useManagedSeo(
  'page:blog',
  {
    title: 'Food Packaging Sourcing Guides & Material Insights | YIYUAN',
    description: 'Read YIYUAN guides on cling film, food wrap, disposable containers, material selection, OEM/ODM packaging, wholesale sourcing, and export packaging trends.',
    keywords: 'food packaging blog, cling film guide, food wrap sourcing, disposable container guide, packaging material insights, OEM ODM packaging guide, wholesale packaging tips, export packaging trends',
    image: '/images/blog-supplier.webp',
  },
  {
    canonicalPath: `/blog/page/${requestedPage}`,
    titleSuffix: `Page ${requestedPage}`,
  },
)

const requestUrl = useRequestURL()
const toAbsoluteUrl = (path: string) => `${requestUrl.origin}${path}`
const posts = computed(() => data.value?.items || [])
const totalPages = computed(() => data.value?.totalPages || 1)

useHead(() => {
  const links = [
    {
      rel: 'prev',
      href: toAbsoluteUrl(requestedPage === 2 ? '/blog' : `/blog/page/${requestedPage - 1}`),
    },
  ]

  if (requestedPage < totalPages.value) {
    links.push({
      rel: 'next',
      href: toAbsoluteUrl(`/blog/page/${requestedPage + 1}`),
    })
  }

  return { link: links }
})
</script>

<template>
  <BlogListing :items="posts" :current-page="requestedPage" :total-pages="totalPages" />
</template>
