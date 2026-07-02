import { requireAdmin } from '../../../utils/auth'
import { getSiteSettings } from '../../../utils/site-settings'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const settings = getSiteSettings()

  return {
    settings: {
      enabled: settings.inquiryMailEnabled === 'true',
      to: settings.inquiryMailTo || settings.email,
      fromName: settings.inquiryMailFromName,
      fromEmail: settings.inquiryMailFromEmail,
      subjectPrefix: settings.inquiryMailSubjectPrefix,
      defaultContactEmail: settings.email,
      provider: 'resend',
      apiKeyConfigured: Boolean(process.env.RESEND_API_KEY),
    },
  }
})
