import { requireAdmin } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = getDb()

  const scalar = (sql: string) => (db.prepare(sql).get() as { count: number }).count

  return {
    posts: scalar('SELECT COUNT(*) AS count FROM posts'),
    publishedPosts: scalar("SELECT COUNT(*) AS count FROM posts WHERE status = 'published'"),
    productCategories: scalar('SELECT COUNT(*) AS count FROM product_categories'),
    products: scalar('SELECT COUNT(*) AS count FROM products'),
    publishedProducts: scalar("SELECT COUNT(*) AS count FROM products WHERE status = 'published'"),
    inquiries: scalar('SELECT COUNT(*) AS count FROM inquiries'),
    unreadInquiries: scalar('SELECT COUNT(*) AS count FROM inquiries WHERE read_at IS NULL'),
    seoEntries: scalar('SELECT COUNT(*) AS count FROM seo_entries'),
    friendLinks: scalar('SELECT COUNT(*) AS count FROM friend_links'),
    failedMails: scalar("SELECT COUNT(*) AS count FROM inquiries WHERE mail_status IN ('failed', 'retrying')"),
  }
})
