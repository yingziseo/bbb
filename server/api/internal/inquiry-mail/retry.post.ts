import { createError, getHeader } from 'h3'
import { retryDueInquiryMails } from '../../../utils/inquiry-mail'

export default defineEventHandler(async (event) => {
  const token = process.env.INQUIRY_RETRY_TOKEN
  const authorization = getHeader(event, 'authorization') || ''

  if (!token || authorization !== `Bearer ${token}`) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return retryDueInquiryMails(10)
})
