import { getQuery } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { getPostSchedulerOverview } from '../../../utils/post-scheduler'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const query = getQuery(event)
  return getPostSchedulerOverview({
    queuePage: Number(query.queuePage) || 1,
    queuePageSize: Number(query.queuePageSize) || 20,
    recentPage: Number(query.recentPage) || 1,
    recentPageSize: Number(query.recentPageSize) || 10,
  })
})
