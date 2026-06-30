import { escapeHtml } from './content'

type InquiryForMail = {
  id: number
  name: string
  company?: string
  email: string
  country?: string
  product?: string
  quantity?: string
  message: string
  created_at: string
}

export type MailResult = {
  status: 'sent' | 'failed' | 'skipped'
  error?: string
}

const row = (label: string, value?: string | null) => {
  if (!value) return ''
  return `<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:700;">${escapeHtml(label)}</td><td style="padding:6px 12px;border:1px solid #ddd;">${escapeHtml(value)}</td></tr>`
}

export const sendInquiryMail = async (inquiry: InquiryForMail): Promise<MailResult> => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { status: 'skipped', error: 'RESEND_API_KEY is not configured' }
  }

  const to = process.env.MAIL_TO || 'yiyuancoop@gmail.com'
  const from = process.env.MAIL_FROM || 'YIYUAN Website <onboarding@resend.dev>'
  const subject = `New inquiry from ${inquiry.name}`
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1a1f26;">
      <h2>New Website Inquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        ${row('Inquiry ID', String(inquiry.id))}
        ${row('Name', inquiry.name)}
        ${row('Email', inquiry.email)}
        ${row('Company', inquiry.company)}
        ${row('Country / Region', inquiry.country)}
        ${row('Product', inquiry.product)}
        ${row('Quantity', inquiry.quantity)}
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
        reply_to: inquiry.email,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      return { status: 'failed', error: text || `HTTP ${response.status}` }
    }

    return { status: 'sent' }
  } catch (error) {
    return { status: 'failed', error: error instanceof Error ? error.message : 'Unknown mail error' }
  }
}
