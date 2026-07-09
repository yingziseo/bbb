import { readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { updatePostSchedulerSettings } from '../../../utils/post-scheduler'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  return { settings: updatePostSchedulerSettings(body || {}) }
})
