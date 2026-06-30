import { createError, getRequestIP, type H3Event } from 'h3'

const submissions = new Map<string, number[]>()
const windowMs = 10 * 60 * 1000
const maxAttempts = 5

export const assertInquiryRateLimit = (event: H3Event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const current = Date.now()
  const recent = (submissions.get(ip) || []).filter((timestamp) => current - timestamp < windowMs)

  if (recent.length >= maxAttempts) {
    throw createError({ statusCode: 429, statusMessage: 'Too many submissions. Please try again later.' })
  }

  recent.push(current)
  submissions.set(ip, recent)
}
