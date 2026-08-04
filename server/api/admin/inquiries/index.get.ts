import { getQuery } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { asString } from '../../../utils/content'
import { getDb } from '../../../utils/db'
import { mapInquiry } from '../../../utils/serializers'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const query = getQuery(event)
  const status = asString(query.status)

  const where: string[] = []
  if (status === 'unread') where.push('read_at IS NULL')
  if (status === 'handled') where.push('handled_at IS NOT NULL')
  if (status === 'mail_pending') where.push("mail_status IN ('pending', 'submitted')")
  if (status === 'mail_delivered') where.push("mail_status = 'delivered'")
  if (status === 'mail_exception' || status === 'failed') {
    where.push("mail_status IN ('failed', 'retrying', 'delayed', 'bounced', 'suppressed', 'complained', 'skipped')")
  }

  const rows = getDb()
    .prepare(`
      SELECT *
      FROM inquiries
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY created_at DESC, id DESC
    `)
    .all()

  return { items: rows.map(mapInquiry) }
})
