import { toValue, type MaybeRefOrGetter } from 'vue'

type ManagedSeoFallback = {
  title: string
  description?: string
  keywords?: string
  image?: string
}

type ManagedSeoOptions = {
  canonicalPath?: MaybeRefOrGetter<string | undefined>
  titleSuffix?: MaybeRefOrGetter<string | undefined>
  robots?: MaybeRefOrGetter<string | undefined>
  fallbackOnly?: MaybeRefOrGetter<boolean>
  htmlLang?: MaybeRefOrGetter<string>
  alternatePaths?: MaybeRefOrGetter<Record<string, string> | undefined>
}

type SeoPayload = {
  siteUrl?: string
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

const toCanonicalPath = (value: string) => {
  if (!value) return ''

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      return url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')
    } catch {
      return ''
    }
  }

  const pathname = value.split('#')[0]?.split('?')[0] || ''
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return path === '/' ? '/' : path.replace(/\/+$/, '')
}

export const useManagedSeo = (key: string, fallback: MaybeRefOrGetter<ManagedSeoFallback>, options: ManagedSeoOptions = {}) => {
  const route = useRoute()
  const requestUrl = useRequestURL()
  const { data } = useFetch<SeoPayload>('/api/public/seo', {
    query: { key },
  })

  useHead(() => {
    const fallbackValue = toValue(fallback)
    const seo = toValue(options.fallbackOnly) ? null : data.value?.seo
    const titleSuffix = toValue(options.titleSuffix)
    const baseTitle = seo?.title || fallbackValue.title
    const title = titleSuffix ? `${baseTitle} | ${titleSuffix}` : baseTitle
    const description = seo?.description || fallbackValue.description || ''
    const keywords = seo?.keywords || fallbackValue.keywords || ''
    const ogTitle = seo?.ogTitle || title
    const ogDescription = seo?.ogDescription || description
    const siteOrigin = data.value?.siteUrl || requestUrl.origin
    const canonical = absoluteUrl(toCanonicalPath(toValue(options.canonicalPath) || seo?.canonical || seo?.path || route.path), siteOrigin)
    const ogImage = absoluteUrl(seo?.ogImage || fallbackValue.image || '', siteOrigin)
    const ogType = key.startsWith('post:') ? 'article' : key.startsWith('product:') ? 'product' : 'website'
    const robots = toValue(options.robots) || seo?.robots

    const alternateLinks = Object.entries(toValue(options.alternatePaths) || {}).map(([hreflang, path]) => ({
      rel: 'alternate',
      hreflang,
      href: absoluteUrl(toCanonicalPath(path), siteOrigin),
    }))

    return {
      htmlAttrs: toValue(options.htmlLang) ? { lang: toValue(options.htmlLang) } : undefined,
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
      link: [
        canonical ? { rel: 'canonical', href: canonical } : null,
        ...alternateLinks,
      ].filter(Boolean) as Array<Record<string, string>>,
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
