import { escapeHtml } from './content'
import { getSiteSettings, parseMailFrom } from './site-settings'

type InquiryForMail = {
  id: number
  name: string
  email: string
  country?: string
  message: string
  created_at: string
}

export type MailResult = {
  status: 'sent' | 'failed' | 'skipped'
  error?: string
  provider: string
  to: string
  messageId?: string
}

const row = (label: string, value?: string | null) => {
  if (!value) return ''
  return `<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:700;">${escapeHtml(label)}</td><td style="padding:6px 12px;border:1px solid #ddd;">${escapeHtml(value)}</td></tr>`
}

export const sendInquiryMail = async (inquiry: InquiryForMail): Promise<MailResult> => {
  const provider = 'resend'
  const settings = getSiteSettings()
  const to = settings.inquiryMailTo || settings.email

  if (settings.inquiryMailEnabled === 'false') {
    return { status: 'skipped', error: 'Inquiry mail forwarding is disabled', provider, to }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { status: 'skipped', error: 'RESEND_API_KEY is not configured', provider, to }
  }

  const fallbackFrom = parseMailFrom(process.env.MAIL_FROM || '')
  const fromName = settings.inquiryMailFromName || fallbackFrom.name || 'YIYUAN Website'
  const fromEmail = settings.inquiryMailFromEmail || fallbackFrom.email || 'inquiry@yiyuanpack.com'
  const from = `${fromName} <${fromEmail}>`
  const subjectPrefix = settings.inquiryMailSubjectPrefix || process.env.MAIL_SUBJECT_PREFIX || '[YIYUAN Inquiry]'
  const subject = `${subjectPrefix} #${inquiry.id} from ${inquiry.name}`
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1a1f26;">
      <h2>New Website Inquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        ${row('Inquiry ID', String(inquiry.id))}
        ${row('Name', inquiry.name)}
        ${row('Email', inquiry.email)}
        ${row('Country / Region', inquiry.country)}
        ${row('Submitted At', inquiry.created_at)}
      </table>
      <h3>Requirement Details</h3>
      <p style="white-space:pre-line;line-height:1.6;">${escapeHtml(inquiry.message)}</p>
    </div>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      return { status: 'failed', error: text || `HTTP ${response.status}`, provider, to }
    }

    const payload = await response.json().catch(() => null) as { id?: string } | null
    return { status: 'sent', provider, to, messageId: payload?.id || '' }
  } catch (error) {
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown mail error',
      provider,
      to,
    }
  }
}
