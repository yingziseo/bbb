import { getDb, touchNow } from './db'
import { sendInquiryMail, type MailResult } from './mail'

type InquiryMailRow = {
  id: number
  mail_attempts?: number | null
  forwarded_at?: string | null
}

const maxMailAttempts = 5
const retryDelaysMinutes = [5, 30, 120, 720]

const truncateError = (value = '') => value.slice(0, 2000)

const addMinutes = (value: string, minutes: number) =>
  new Date(new Date(value).getTime() + minutes * 60 * 1000).toISOString()

const nextRetryAt = (attempts: number, timestamp: string) => {
  if (attempts >= maxMailAttempts) return null
  const delay = retryDelaysMinutes[Math.max(0, attempts - 1)] || retryDelaysMinutes.at(-1) || 720
  return addMinutes(timestamp, delay)
}

const nextStatus = (result: MailResult, attempts: number) => {
  if (result.status === 'sent') return 'sent'
  if (result.status === 'skipped') return 'skipped'
  return attempts >= maxMailAttempts ? 'failed' : 'retrying'
}

export const sendAndRecordInquiryMail = async (inquiry: InquiryMailRow & Record<string, unknown>) => {
  const db = getDb()
  const attempts = Number(inquiry.mail_attempts || 0) + 1
  const timestamp = touchNow()
  const result = await sendInquiryMail(inquiry as any)
  const status = nextStatus(result, attempts)
  const nextAttemptAt = status === 'retrying' ? nextRetryAt(attempts, timestamp) : null
  const forwardedAt = status === 'sent' ? timestamp : inquiry.forwarded_at || null

  db.prepare(`
    UPDATE inquiries
    SET mail_status = ?,
        mail_error = ?,
        mail_provider = ?,
        mail_to = ?,
        mail_message_id = ?,
        mail_attempts = ?,
        last_mail_attempt_at = ?,
        next_mail_attempt_at = ?,
        forwarded_at = ?,
        updated_at = ?
    WHERE id = ?
  `).run(
    status,
    status === 'sent' ? '' : truncateError(result.error || ''),
    result.provider,
    result.to,
    result.messageId || '',
    attempts,
    timestamp,
    nextAttemptAt,
    forwardedAt,
    timestamp,
    inquiry.id,
  )

  return db.prepare('SELECT * FROM inquiries WHERE id = ?').get(inquiry.id)
}

export const retryDueInquiryMails = async (limit = 10) => {
  const db = getDb()
  const timestamp = touchNow()
  const rows = db
    .prepare(`
      SELECT *
      FROM inquiries
      WHERE mail_status = 'retrying'
        AND next_mail_attempt_at IS NOT NULL
        AND next_mail_attempt_at <= ?
      ORDER BY next_mail_attempt_at ASC, id ASC
      LIMIT ?
    `)
    .all(timestamp, limit) as Array<InquiryMailRow & Record<string, unknown>>

  const results = []
  for (const row of rows) {
    const updated = await sendAndRecordInquiryMail(row)
    results.push(updated)
  }

  return {
    checkedAt: timestamp,
    processed: results.length,
    items: results,
  }
}
