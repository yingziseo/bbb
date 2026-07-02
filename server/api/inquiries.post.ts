import { createError, readBody } from 'h3'
import { assertInquiryRateLimit } from '../utils/rate-limit'
import { asString } from '../utils/content'
import { getDb, touchNow } from '../utils/db'
import { sendAndRecordInquiryMail } from '../utils/inquiry-mail'
import { mapInquiry } from '../utils/serializers'

export default defineEventHandler(async (event) => {
  assertInquiryRateLimit(event)

  const body = await readBody(event)
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
  const updated = await sendAndRecordInquiryMail(inquiry)
  return { item: mapInquiry(updated) }
})
