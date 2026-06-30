import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import {
  createError,
  deleteCookie,
  getCookie,
  setCookie,
  type H3Event,
} from 'h3'
import { createPasswordHash, getDb, touchNow } from './db'

const cookieName = 'yiyuan_admin_session'
const sessionDays = 7

type AdminUserRow = {
  id: number
  username: string
  password_hash: string
  password_salt: string
}

export type AdminUser = {
  id: number
  username: string
}

export const verifyPassword = (password: string, hash: string, salt: string) => {
  const calculated = scryptSync(password, salt, 64)
  const stored = Buffer.from(hash, 'hex')
  if (stored.length !== calculated.length) return false
  return timingSafeEqual(stored, calculated)
}

export const findAdminByUsername = (username: string) =>
  getDb()
    .prepare('SELECT id, username, password_hash, password_salt FROM admin_users WHERE username = ?')
    .get(username) as AdminUserRow | undefined

export const createAdminSession = (event: H3Event, userId: number) => {
  const db = getDb()
  const id = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000)

  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(touchNow())
  db.prepare('INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)').run(
    id,
    userId,
    expires.toISOString(),
    touchNow(),
  )

  setCookie(event, cookieName, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    path: '/',
    maxAge: sessionDays * 24 * 60 * 60,
  })
}

export const clearAdminSession = (event: H3Event) => {
  const id = getCookie(event, cookieName)
  if (id) getDb().prepare('DELETE FROM sessions WHERE id = ?').run(id)
  deleteCookie(event, cookieName, { path: '/' })
}

export const getAdminUser = (event: H3Event): AdminUser | null => {
  const id = getCookie(event, cookieName)
  if (!id) return null

  const row = getDb()
    .prepare(`
      SELECT admin_users.id, admin_users.username
      FROM sessions
      JOIN admin_users ON admin_users.id = sessions.user_id
      WHERE sessions.id = ? AND sessions.expires_at > ?
    `)
    .get(id, touchNow()) as AdminUser | undefined

  return row || null
}

export const requireAdmin = (event: H3Event) => {
  const user = getAdminUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
}

export const resetAdminPasswordFromEnv = () => {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  if (!username || !password) return

  const user = findAdminByUsername(username)
  if (!user) return

  const hashed = createPasswordHash(password)
  getDb()
    .prepare('UPDATE admin_users SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?')
    .run(hashed.hash, hashed.salt, touchNow(), user.id)
}
