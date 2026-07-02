import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asBoolean, asString } from '../../../utils/content'
import { getSiteSettings, updateSiteSettings } from '../../../utils/site-settings'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const current = getSiteSettings()

  const to = asString(body?.to, current.inquiryMailTo || current.email)
  const fromName = asString(body?.fromName, current.inquiryMailFromName)
  const fromEmail = asString(body?.fromEmail, current.inquiryMailFromEmail)
  const subjectPrefix = asString(body?.subjectPrefix, current.inquiryMailSubjectPrefix)

  if (!emailPattern.test(to)) {
    throw createError({ statusCode: 400, statusMessage: '请填写有效的转发收件邮箱' })
  }

  if (!emailPattern.test(fromEmail)) {
    throw createError({ statusCode: 400, statusMessage: '请填写有效的发件邮箱' })
  }

  const settings = updateSiteSettings({
    ...current,
    inquiryMailEnabled: asBoolean(body?.enabled, current.inquiryMailEnabled === 'true') ? 'true' : 'false',
    inquiryMailTo: to,
    inquiryMailFromName: fromName || 'YIYUAN Website',
    inquiryMailFromEmail: fromEmail,
    inquiryMailSubjectPrefix: subjectPrefix || '[YIYUAN Inquiry]',
  })

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
