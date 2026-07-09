import { readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { planDraftPostsRandomDaytime } from '../../../utils/post-scheduler'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  return planDraftPostsRandomDaytime({ days: Number(body?.days) || 30 })
})
