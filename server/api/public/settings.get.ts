import { getSiteSettings } from '../../utils/site-settings'

export default defineEventHandler(() => ({ settings: getSiteSettings() }))
