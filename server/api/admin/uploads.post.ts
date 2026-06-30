import { mkdirSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { createError, readMultipartFormData } from 'h3'
import { requireAdmin } from '../../utils/auth'
import { getDb, touchNow } from '../../utils/db'

const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon'])
const maxSize = 5 * 1024 * 1024

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const form = await readMultipartFormData(event)
  const file = form?.find((item) => item.name === 'file' && item.filename)

  if (!file?.data || !file.filename || !file.type) {
    throw createError({ statusCode: 400, statusMessage: '请选择图片文件' })
  }

  if (!allowedTypes.has(file.type)) {
    throw createError({ statusCode: 400, statusMessage: '只支持 png、jpg、webp、gif、ico 图片' })
  }

  if (file.data.length > maxSize) {
    throw createError({ statusCode: 400, statusMessage: '图片不能超过 5MB' })
  }

  const dir = join(process.cwd(), 'public/uploads')
  mkdirSync(dir, { recursive: true })

  const ext = extname(file.filename).toLowerCase() || '.png'
  const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`
  const diskPath = join(dir, filename)
  writeFileSync(diskPath, file.data)

  const publicPath = `/uploads/${filename}`
  const timestamp = touchNow()
  getDb()
    .prepare('INSERT INTO uploaded_files (path, original_name, mime_type, size, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(publicPath, file.filename, file.type, file.data.length, timestamp)

  return { path: publicPath }
})
