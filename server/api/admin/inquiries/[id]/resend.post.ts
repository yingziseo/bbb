import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../../utils/auth'
import { getDb, touchNow } from '../../../../utils/db'
import { sendInquiryMail } from '../../../../utils/mail'
import { mapInquiry } from '../../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()
  const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id) as any
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Inquiry not found' })

  const result = await sendInquiryMail(row)
  db.prepare(`
    UPDATE inquiries
    SET mail_status = ?, mail_error = ?, forwarded_at = ?, updated_at = ?
    WHERE id = ?
  `).run(
    result.status,
    result.error || '',
    result.status === 'sent' ? touchNow() : row.forwarded_at,
    touchNow(),
    id,
  )

  const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id)
  return { item: mapInquiry(updated) }
})
