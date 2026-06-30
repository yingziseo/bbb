type ManagedSeoFallback = {
  title: string
  description?: string
  keywords?: string
  image?: string
}

type SeoPayload = {
  seo: null | {
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

export const useManagedSeo = (key: string, fallback: ManagedSeoFallback) => {
  const { data } = useFetch<SeoPayload>('/api/public/seo', {
    query: { key },
  })

  useHead(() => {
    const seo = data.value?.seo
    const title = seo?.title || fallback.title
    const description = seo?.description || fallback.description || ''
    const keywords = seo?.keywords || fallback.keywords || ''
    const ogTitle = seo?.ogTitle || title
    const ogDescription = seo?.ogDescription || description
    const ogImage = seo?.ogImage || fallback.image || ''

    return {
      title,
      meta: [
        description ? { name: 'description', content: description } : null,
        keywords ? { name: 'keywords', content: keywords } : null,
        seo?.robots ? { name: 'robots', content: seo.robots } : null,
        { property: 'og:title', content: ogTitle },
        ogDescription ? { property: 'og:description', content: ogDescription } : null,
        ogImage ? { property: 'og:image', content: ogImage } : null,
        { property: 'og:type', content: key.startsWith('post:') ? 'article' : 'website' },
      ].filter(Boolean) as Array<Record<string, string>>,
      link: seo?.canonical ? [{ rel: 'canonical', href: seo.canonical }] : [],
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
