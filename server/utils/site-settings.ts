import type { H3Event } from 'h3'
import { getRequestHeader } from 'h3'
import { company } from '../../app/data/site'
import { asString } from './content'
import { getDb, touchNow } from './db'

export const siteSettingKeys = [
  'siteUrl',
  'displayName',
  'name',
  'tagline',
  'email',
  'phone',
  'whatsapp',
  'whatsappLink',
  'address',
  'location',
  'founded',
  'registeredCapital',
  'legalRepresentative',
] as const

type SiteSettingKey = (typeof siteSettingKeys)[number]

export type SiteSettings = Record<SiteSettingKey, string> & {
  contactLink: string
}

const defaultSettings = (): Record<SiteSettingKey, string> => ({
  siteUrl: process.env.SITE_URL || '',
  displayName: company.displayName,
  name: company.name,
  tagline: company.tagline,
  email: company.email,
  phone: company.phone,
  whatsapp: company.whatsapp,
  whatsappLink: company.whatsappLink,
  address: company.address,
  location: company.location,
  founded: String(company.founded),
  registeredCapital: company.registeredCapital,
  legalRepresentative: company.legalRepresentative,
})

const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, '')

const whatsappHref = (value: string) => {
  const digits = value.replace(/[^\d]/g, '')
  return digits ? `https://wa.me/${digits}` : ''
}

export const normalizeSiteSettings = (input: Partial<Record<SiteSettingKey, string>> = {}): SiteSettings => {
  const defaults = defaultSettings()
  const settings = siteSettingKeys.reduce((acc, key) => {
    acc[key] = asString(input[key], defaults[key])
    return acc
  }, {} as Record<SiteSettingKey, string>)

  settings.siteUrl = normalizeBaseUrl(settings.siteUrl)
  settings.whatsapp = settings.whatsapp || settings.phone
  settings.whatsappLink = normalizeBaseUrl(settings.whatsappLink) || whatsappHref(settings.whatsapp)

  return {
    ...settings,
    contactLink: settings.email ? `mailto:${settings.email}` : '',
  }
}

export const getSiteSettings = () => {
  const rows = getDb()
    .prepare('SELECT key, value FROM site_settings')
    .all() as Array<{ key: SiteSettingKey; value: string }>

  const values = rows.reduce((acc, row) => {
    if ((siteSettingKeys as readonly string[]).includes(row.key)) {
      acc[row.key] = row.value
    }
    return acc
  }, {} as Partial<Record<SiteSettingKey, string>>)

  return normalizeSiteSettings(values)
}

export const updateSiteSettings = (input: Record<string, unknown>) => {
  const current = getSiteSettings()
  const next = normalizeSiteSettings(
    siteSettingKeys.reduce((acc, key) => {
      acc[key] = asString(input[key], current[key])
      return acc
    }, {} as Partial<Record<SiteSettingKey, string>>),
  )

  const timestamp = touchNow()
  const statement = getDb().prepare(`
    INSERT INTO site_settings (key, value, created_at, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `)

  siteSettingKeys.forEach((key) => {
    statement.run(key, next[key], timestamp, timestamp)
  })

  return getSiteSettings()
}

export const getSiteOrigin = (event?: H3Event) => {
  const configured = getSiteSettings().siteUrl || normalizeBaseUrl(process.env.SITE_URL || '')
  if (configured) return configured

  if (!event) return ''

  const forwardedHost = getRequestHeader(event, 'x-forwarded-host')
  const host = forwardedHost || getRequestHeader(event, 'host')
  if (!host) return ''

  const forwardedProto = getRequestHeader(event, 'x-forwarded-proto')
  const proto = forwardedProto?.split(',')[0]?.trim() || 'http'
  return `${proto}://${host}`.replace(/\/+$/, '')
}

export const toAbsoluteSiteUrl = (path = '', event?: H3Event) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const origin = getSiteOrigin(event)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return origin ? `${origin}${normalizedPath}` : normalizedPath
}
