import { requireAdmin } from '../../../utils/auth'
import { sendInquiryMail } from '../../../utils/mail'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const result = await sendInquiryMail({
    id: 0,
    name: 'Mail Forwarding Test',
    email: 'test@yiyuanpack.com',
    country: 'System Test',
    message: 'This is a test email from the YIYUAN inquiry forwarding settings.',
    created_at: new Date().toISOString(),
  })

  return { result }
})
