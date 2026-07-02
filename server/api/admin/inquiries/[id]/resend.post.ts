import { createError, getRouterParam } from 'h3'
import { requireAdmin } from '../../../../utils/auth'
import { getDb } from '../../../../utils/db'
import { sendAndRecordInquiryMail } from '../../../../utils/inquiry-mail'
import { mapInquiry } from '../../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()
  const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id) as any
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Inquiry not found' })

  const updated = await sendAndRecordInquiryMail(row)
  return { item: mapInquiry(updated) }
})
