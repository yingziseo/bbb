import { createReadStream, statSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import { createError, getRouterParam, sendStream, setHeader } from 'h3'

const uploadRoot = () => resolve(process.cwd(), 'public/uploads')

const contentTypes: Record<string, string> = {
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const resolveUploadPath = (rawPath: string) => {
  let decoded = ''
  try {
    decoded = decodeURIComponent(rawPath).replace(/^\/+/, '')
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid upload path' })
  }

  if (!decoded || decoded.includes('\0')) {
    throw createError({ statusCode: 404, statusMessage: 'Upload not found' })
  }

  const root = uploadRoot()
  const filePath = resolve(root, decoded)
  const scopedPath = relative(root, filePath)
  if (!scopedPath || scopedPath.startsWith('..') || resolve(root, scopedPath) !== filePath) {
    throw createError({ statusCode: 404, statusMessage: 'Upload not found' })
  }

  return filePath
}

export default defineEventHandler((event) => {
  const method = event.method.toUpperCase()
  if (!['GET', 'HEAD'].includes(method)) {
    setHeader(event, 'Allow', 'GET, HEAD')
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const filePath = resolveUploadPath(getRouterParam(event, 'path') || '')
  let stats
  try {
    stats = statSync(filePath)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Upload not found' })
  }

  if (!stats.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'Upload not found' })
  }

  setHeader(event, 'Content-Type', contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream')
  setHeader(event, 'Content-Length', String(stats.size))
  setHeader(event, 'Last-Modified', stats.mtime.toUTCString())
  setHeader(event, 'Cache-Control', 'public, max-age=604800')

  if (method === 'HEAD') return ''
  return sendStream(event, createReadStream(filePath))
})
