import { requireAdmin } from '../../../utils/auth'
import { getPostSchedulerOverview } from '../../../utils/post-scheduler'

export default defineEventHandler((event) => {
  requireAdmin(event)
  return getPostSchedulerOverview()
})
