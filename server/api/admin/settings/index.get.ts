import { requireAdmin } from '../../../utils/auth'
import { getSiteSettings } from '../../../utils/site-settings'

export default defineEventHandler((event) => {
  requireAdmin(event)
  return { settings: getSiteSettings() }
})
