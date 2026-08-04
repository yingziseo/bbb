import { createError, getHeader, readRawBody } from 'h3'
import { Webhook } from 'svix'
import { processResendWebhookEvent } from '../../utils/inquiry-mail'

export default defineEventHandler(async (event) => {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Resend webhook is not configured' })
  }

  const payload = await readRawBody(event)
  const id = getHeader(event, 'svix-id') || ''
  const timestamp = getHeader(event, 'svix-timestamp') || ''
  const signature = getHeader(event, 'svix-signature') || ''

  if (!payload || !id || !timestamp || !signature) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Resend webhook request' })
  }

  let verified: Record<string, unknown>
  try {
    verified = new Webhook(secret).verify(payload, {
      'svix-id': id,
      'svix-timestamp': timestamp,
      'svix-signature': signature,
    }) as Record<string, unknown>
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Resend webhook signature' })
  }

  return {
    ok: true,
    result: processResendWebhookEvent(verified),
  }
})
