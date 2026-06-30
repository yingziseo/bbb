import { company as fallbackCompany } from '~/data/site'

export type PublicSiteSettings = Omit<typeof fallbackCompany, 'founded'> & {
  founded: string
  siteUrl: string
  contactLink: string
}

const createFallbackSettings = (): PublicSiteSettings => ({
  ...fallbackCompany,
  siteUrl: '',
  founded: String(fallbackCompany.founded),
  contactLink: fallbackCompany.contactLink,
})

export const useSiteSettings = async () => {
  const { data } = await useFetch<{ settings: PublicSiteSettings }>('/api/public/settings', {
    key: 'public-site-settings',
    default: () => ({ settings: createFallbackSettings() }),
  })

  return data.value?.settings || createFallbackSettings()
}
