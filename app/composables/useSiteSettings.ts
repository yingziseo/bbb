import { company as fallbackCompany, defaultHomePopupVideoUrl } from '~/data/site'

export type PublicSiteSettings = Omit<typeof fallbackCompany, 'founded'> & {
  founded: string
  siteUrl: string
  contactLink: string
  logoPath: string
  faviconPath: string
  homePopupEnabled: string
  homePopupCooldownHours: string
  homePopupVideoUrl: string
}

const createFallbackSettings = (): PublicSiteSettings => ({
  ...fallbackCompany,
  siteUrl: '',
  founded: String(fallbackCompany.founded),
  contactLink: fallbackCompany.contactLink,
  logoPath: '/site-logo.png',
  faviconPath: '/favicon.ico',
  homePopupEnabled: 'true',
  homePopupCooldownHours: '12',
  homePopupVideoUrl: defaultHomePopupVideoUrl,
})

export const useSiteSettings = async () => {
  const { data } = await useFetch<{ settings: PublicSiteSettings }>('/api/public/settings', {
    key: 'public-site-settings',
    default: () => ({ settings: createFallbackSettings() }),
  })

  return data.value?.settings || createFallbackSettings()
}
