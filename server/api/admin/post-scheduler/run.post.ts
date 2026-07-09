import { requireAdmin } from '../../../utils/auth'
import { publishDueScheduledPosts } from '../../../utils/post-scheduler'

export default defineEventHandler((event) => {
  requireAdmin(event)
  return publishDueScheduledPosts()
})
