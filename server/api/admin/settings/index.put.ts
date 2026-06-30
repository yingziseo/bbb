import { readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { updateSiteSettings } from '../../../utils/site-settings'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  return { settings: updateSiteSettings(body || {}) }
})
