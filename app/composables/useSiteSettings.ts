import { company as fallbackCompany } from '~/data/site'

export type PublicSiteSettings = Omit<typeof fallbackCompany, 'founded'> & {
  founded: string
  siteUrl: string
  contactLink: string
  logoPath: string
  faviconPath: string
}

const createFallbackSettings = (): PublicSiteSettings => ({
  ...fallbackCompany,
  siteUrl: '',
  founded: String(fallbackCompany.founded),
  contactLink: fallbackCompany.contactLink,
  logoPath: '/site-logo.png',
  faviconPath: '/favicon.ico',
})

export const useSiteSettings = async () => {
  const { data } = await useFetch<{ settings: PublicSiteSettings }>('/api/public/settings', {
    key: 'public-site-settings',
    default: () => ({ settings: createFallbackSettings() }),
  })

  return data.value?.settings || createFallbackSettings()
}
