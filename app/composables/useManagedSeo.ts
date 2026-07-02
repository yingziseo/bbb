type ManagedSeoFallback = {
  title: string
  description?: string
  keywords?: string
  image?: string
}

type ManagedSeoOptions = {
  canonicalPath?: string
  titleSuffix?: string
  robots?: string
}

type SeoPayload = {
  seo: null | {
    path: string
    title: string
    description: string
    keywords: string
    canonical: string
    robots: string
    ogTitle: string
    ogDescription: string
    ogImage: string
  }
  jsonLd: unknown
}

const absoluteUrl = (value: string, origin: string) => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  const path = value.startsWith('/') ? value : `/${value}`
  return origin ? `${origin.replace(/\/+$/, '')}${path}` : path
}

export const useManagedSeo = (key: string, fallback: ManagedSeoFallback, options: ManagedSeoOptions = {}) => {
  const route = useRoute()
  const requestUrl = useRequestURL()
  const { data } = useFetch<SeoPayload>('/api/public/seo', {
    query: { key },
  })

  useHead(() => {
    const seo = data.value?.seo
    const baseTitle = seo?.title || fallback.title
    const title = options.titleSuffix ? `${baseTitle} | ${options.titleSuffix}` : baseTitle
    const description = seo?.description || fallback.description || ''
    const keywords = seo?.keywords || fallback.keywords || ''
    const ogTitle = seo?.ogTitle || title
    const ogDescription = seo?.ogDescription || description
    const canonical = absoluteUrl(options.canonicalPath || seo?.canonical || seo?.path || route.path, requestUrl.origin)
    const ogImage = absoluteUrl(seo?.ogImage || fallback.image || '', requestUrl.origin)
    const ogType = key.startsWith('post:') ? 'article' : key.startsWith('product:') ? 'product' : 'website'
    const robots = options.robots || seo?.robots

    return {
      title,
      meta: [
        description ? { name: 'description', content: description } : null,
        keywords ? { name: 'keywords', content: keywords } : null,
        robots ? { name: 'robots', content: robots } : null,
        { property: 'og:title', content: ogTitle },
        ogDescription ? { property: 'og:description', content: ogDescription } : null,
        ogImage ? { property: 'og:image', content: ogImage } : null,
        canonical ? { property: 'og:url', content: canonical } : null,
        { property: 'og:type', content: ogType },
        { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' },
        { name: 'twitter:title', content: ogTitle },
        ogDescription ? { name: 'twitter:description', content: ogDescription } : null,
        ogImage ? { name: 'twitter:image', content: ogImage } : null,
      ].filter(Boolean) as Array<Record<string, string>>,
      link: canonical ? [{ rel: 'canonical', href: canonical }] : [],
      script: data.value?.jsonLd
        ? [
            {
              type: 'application/ld+json',
              children: JSON.stringify(data.value.jsonLd),
            },
          ]
        : [],
    }
  })

  return data
}
