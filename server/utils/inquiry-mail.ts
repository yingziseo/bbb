import { getDb, touchNow } from './db'
import { checkInquiryMailStatus, sendInquiryMail, type MailResult } from './mail'

type InquiryMailRow = {
  id: number
  mail_status?: string | null
  mail_message_id?: string | null
  mail_attempts?: number | null
  mail_last_event_at?: string | null
  forwarded_at?: string | null
}

type ResendWebhookPayload = {
  type?: string
  created_at?: string
  data?: Record<string, unknown> & { email_id?: string }
}

type MailDeliveryStatus =
  | 'submitted'
  | 'delivered'
  | 'delayed'
  | 'bounced'
  | 'suppressed'
  | 'complained'
  | 'failed'

const maxMailAttempts = 5
const retryDelaysMinutes = [5, 30, 120, 720]
const terminalStatuses = new Set(['delivered', 'bounced', 'suppressed', 'complained', 'failed'])

const truncateError = (value = '') => value.slice(0, 2000)

const addMinutes = (value: string, minutes: number) =>
  new Date(new Date(value).getTime() + minutes * 60 * 1000).toISOString()

const nextRetryAt = (attempts: number, timestamp: string) => {
  if (attempts >= maxMailAttempts) return null
  const delay = retryDelaysMinutes[Math.max(0, attempts - 1)] || retryDelaysMinutes.at(-1) || 720
  return addMinutes(timestamp, delay)
}

const nextStatus = (result: MailResult, attempts: number) => {
  if (result.status === 'submitted') return 'submitted'
  if (result.status === 'skipped') return 'skipped'
  return attempts >= maxMailAttempts ? 'failed' : 'retrying'
}

const normalizeEventType = (value = '') => value.toLowerCase().replace(/^email\./, '')

const deliveryStatusForEvent = (eventType: string): MailDeliveryStatus | null => {
  const normalized = normalizeEventType(eventType)
  if (['sent', 'queued', 'scheduled', 'submitted'].includes(normalized)) return 'submitted'
  if (['delivered', 'opened', 'clicked'].includes(normalized)) return 'delivered'
  if (normalized === 'delivery_delayed') return 'delayed'
  if (normalized === 'bounced') return 'bounced'
  if (normalized === 'suppressed') return 'suppressed'
  if (normalized === 'complained') return 'complained'
  if (['failed', 'canceled'].includes(normalized)) return 'failed'
  return null
}

const defaultEventError = (status: MailDeliveryStatus) => {
  if (status === 'delayed') return 'Resend reported a temporary delivery delay'
  if (status === 'bounced') return 'The recipient mail server rejected the email'
  if (status === 'suppressed') return 'The recipient is on the Resend suppression list'
  if (status === 'complained') return 'The recipient marked a previous email as spam'
  if (status === 'failed') return 'Resend reported a delivery failure'
  return ''
}

const webhookDetails = (payload: ResendWebhookPayload) => {
  const data = payload.data || {}
  const candidates = [data.suppressed, data.bounce, data.failed, data.delivery_delayed]
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue
    const detail = candidate as Record<string, unknown>
    const message = detail.message || detail.error || detail.reason
    if (typeof message === 'string' && message) return message
    return JSON.stringify(detail)
  }
  return ''
}

const isOlderEvent = (currentEventAt?: string | null, nextEventAt?: string | null) => {
  if (!currentEventAt || !nextEventAt) return false
  const current = Date.parse(currentEventAt)
  const next = Date.parse(nextEventAt)
  return Number.isFinite(current) && Number.isFinite(next) && next < current
}

const shouldApplyStatus = (currentStatus: string, nextStatusValue: MailDeliveryStatus) => {
  if (!terminalStatuses.has(currentStatus)) return true
  return currentStatus === 'delivered' && nextStatusValue === 'complained'
}

const applyResendMailEvent = (input: {
  messageId: string
  eventType: string
  eventAt?: string
  error?: string
}) => {
  const status = deliveryStatusForEvent(input.eventType)
  if (!status) return { matched: false, updated: false, ignored: 'unsupported_event' }

  const db = getDb()
  const timestamp = touchNow()
  const eventAt = input.eventAt && Number.isFinite(Date.parse(input.eventAt)) ? input.eventAt : timestamp

  const row = db
    .prepare(`
      SELECT id, mail_status, mail_last_event_at, forwarded_at
      FROM inquiries
      WHERE mail_provider = 'resend' AND mail_message_id = ?
    `)
    .get(input.messageId) as InquiryMailRow | undefined

  if (!row) return { matched: false, updated: false, ignored: 'unknown_message' }

  if (isOlderEvent(row.mail_last_event_at, eventAt) || !shouldApplyStatus(row.mail_status || '', status)) {
    return { matched: true, updated: false, ignored: 'stale_event' }
  }

  const error = status === 'submitted' || status === 'delivered'
    ? ''
    : truncateError(input.error || defaultEventError(status))
  const forwardedAt = status === 'delivered'
    ? eventAt
    : status === 'complained'
      ? row.forwarded_at || null
      : null

  db.prepare(`
    UPDATE inquiries
    SET mail_status = ?,
        mail_error = ?,
        mail_last_event = ?,
        mail_last_event_at = ?,
        mail_last_checked_at = ?,
        mail_check_error = '',
        next_mail_attempt_at = NULL,
        forwarded_at = ?,
        updated_at = ?
    WHERE id = ?
  `).run(
    status,
    error,
    normalizeEventType(input.eventType),
    eventAt,
    timestamp,
    forwardedAt,
    timestamp,
    row.id,
  )

  return { matched: true, updated: true, status, inquiryId: row.id }
}

export const sendAndRecordInquiryMail = async (inquiry: InquiryMailRow & Record<string, unknown>) => {
  const db = getDb()
  const attempts = Number(inquiry.mail_attempts || 0) + 1
  const timestamp = touchNow()
  const result = await sendInquiryMail(inquiry as any)
  const status = nextStatus(result, attempts)
  const nextAttemptAt = status === 'retrying' ? nextRetryAt(attempts, timestamp) : null

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
        mail_last_event = ?,
        mail_last_event_at = ?,
        mail_last_checked_at = NULL,
        mail_check_error = '',
        forwarded_at = NULL,
        updated_at = ?
    WHERE id = ?
  `).run(
    status,
    status === 'submitted' ? '' : truncateError(result.error || ''),
    result.provider,
    result.to,
    result.messageId || '',
    attempts,
    timestamp,
    nextAttemptAt,
    status,
    timestamp,
    timestamp,
    inquiry.id,
  )

  return db.prepare('SELECT * FROM inquiries WHERE id = ?').get(inquiry.id)
}

export const processResendWebhookEvent = (payload: ResendWebhookPayload) => {
  const messageId = typeof payload.data?.email_id === 'string' ? payload.data.email_id : ''
  const eventType = typeof payload.type === 'string' ? payload.type : ''
  if (!messageId || !eventType) return { matched: false, updated: false, ignored: 'invalid_payload' }

  return applyResendMailEvent({
    messageId,
    eventType,
    eventAt: payload.created_at,
    error: webhookDetails(payload),
  })
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
    results.push(await sendAndRecordInquiryMail(row))
  }

  return results
}

export const reconcilePendingInquiryMails = async (limit = 25) => {
  const db = getDb()
  const retentionCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const rows = db
    .prepare(`
      SELECT id, mail_status, mail_message_id, mail_last_event_at, forwarded_at
      FROM inquiries
      WHERE mail_provider = 'resend'
        AND mail_message_id IS NOT NULL
        AND mail_message_id != ''
        AND mail_status IN ('submitted', 'delayed')
        AND created_at >= ?
      ORDER BY id DESC
      LIMIT ?
    `)
    .all(retentionCutoff, limit) as InquiryMailRow[]

  const results = []
  for (const row of rows) {
    const checkedAt = touchNow()
    const result = await checkInquiryMailStatus(row.mail_message_id || '')
    if (!result.ok) {
      db.prepare(`
        UPDATE inquiries
        SET mail_last_checked_at = ?, mail_check_error = ?, updated_at = ?
        WHERE id = ?
      `).run(checkedAt, truncateError(result.error), checkedAt, row.id)
      results.push({ inquiryId: row.id, updated: false, error: result.error })
      continue
    }

    const updated = applyResendMailEvent({
      messageId: row.mail_message_id || '',
      eventType: result.lastEvent,
      eventAt: checkedAt,
    })
    results.push({ inquiryId: row.id, ...updated })
  }

  return results
}

export const runInquiryMailMaintenance = async () => {
  const checkedAt = touchNow()
  const retried = await retryDueInquiryMails(10)
  const reconciled = await reconcilePendingInquiryMails(25)

  return {
    checkedAt,
    retried: retried.length,
    reconciled: reconciled.length,
    retryItems: retried,
    reconciliationItems: reconciled,
  }
}
