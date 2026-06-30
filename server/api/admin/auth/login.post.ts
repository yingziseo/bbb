import { createError, readBody } from 'h3'
import { asString } from '../../../utils/content'
import { createAdminSession, findAdminByUsername, verifyPassword } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = asString(body?.username).trim().toLowerCase()
  const password = asString(body?.password)

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: '请输入账号和密码' })
  }

  const user = findAdminByUsername(username)
  if (!user || !verifyPassword(password, user.password_hash, user.password_salt)) {
    throw createError({ statusCode: 401, statusMessage: '账号或密码错误' })
  }

  createAdminSession(event, user.id)

  return { user: { id: user.id, username: user.username } }
})
