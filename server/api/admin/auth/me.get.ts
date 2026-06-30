import { getAdminUser } from '../../../utils/auth'

export default defineEventHandler((event) => {
  return { user: getAdminUser(event) }
})
