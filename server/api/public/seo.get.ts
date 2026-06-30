import { createError, getQuery } from 'h3'
import { asString } from '../../utils/content'
import { buildStructuredData, getSeoByKey } from '../../utils/seo'

export default defineEventHandler((event) => {
  const key = asString(getQuery(event).key)
  if (!key) throw createError({ statusCode: 400, statusMessage: 'Missing SEO key' })

  const seo = getSeoByKey(key)
  return {
    seo,
    jsonLd: seo ? buildStructuredData(seo, event) : null,
  }
})
