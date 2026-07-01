import { createError, readBody } from 'h3'
import { assertInquiryRateLimit } from '../utils/rate-limit'
import { asString } from '../utils/content'
import { getDb, touchNow } from '../utils/db'
import { sendInquiryMail } from '../utils/mail'
import { mapInquiry } from '../utils/serializers'

export default defineEventHandler(async (event) => {
  assertInquiryRateLimit(event)

  const body = await readBody(event)
  if (asString(body?.website)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
  }

  const name = asString(body?.name)
  const email = asString(body?.email).toLowerCase()
  const country = asString(body?.country)
  const message = asString(body?.message)

  if (!name || !email || !country || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Name, email, country, and requirement details are required' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Please enter a valid email' })
  }

  const db = getDb()
  const timestamp = touchNow()
  const result = db
    .prepare(`
      INSERT INTO inquiries (
        name, email, country, message,
        mail_status, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, 'pending', ?, ?)
    `)
    .run(
      name,
      email,
      country,
      message,
      timestamp,
      timestamp,
    )

  const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid) as any
  const mail = await sendInquiryMail(inquiry)

  db.prepare(`
    UPDATE inquiries
    SET mail_status = ?, mail_error = ?, forwarded_at = ?, updated_at = ?
    WHERE id = ?
  `).run(
    mail.status,
    mail.error || '',
    mail.status === 'sent' ? touchNow() : null,
    touchNow(),
    inquiry.id,
  )

  const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(inquiry.id)
  return { item: mapInquiry(updated) }
})
