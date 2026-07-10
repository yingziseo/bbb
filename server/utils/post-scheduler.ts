import { asString } from './content'
import { getDb, touchNow } from './db'
import { mapPostSummary } from './serializers'

const CHINA_OFFSET_MS = 8 * 60 * 60 * 1000
const DEFAULT_START_TIME = '09:00'
const DEFAULT_END_TIME = '17:30'

const settingKeys = {
  enabled: 'postSchedulerEnabled',
  startTime: 'postSchedulerStartTime',
  endTime: 'postSchedulerEndTime',
  dailyLimit: 'postSchedulerDailyLimit',
  lastRunAt: 'postSchedulerLastRunAt',
} as const

const pad = (value: number) => String(value).padStart(2, '0')

const normalizeBoolean = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return ['1', 'true', 'yes', 'on'].includes(normalized) ? 'true' : 'false'
}

const normalizeTime = (value: string, fallback: string) => {
  const trimmed = value.trim()
  if (!/^\d{2}:\d{2}$/.test(trimmed)) return fallback
  const [hour, minute] = trimmed.split(':').map(Number)
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return fallback
  return `${pad(hour)}:${pad(minute)}`
}

const timeToMinutes = (value: string) => {
  const [hour, minute] = value.split(':').map(Number)
  return hour * 60 + minute
}

const normalizeDailyLimit = (value: string) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '1'
  return String(Math.max(1, Math.min(5, Math.trunc(number))))
}

const chinaDateParts = (date = new Date()) => {
  const chinaDate = new Date(date.getTime() + CHINA_OFFSET_MS)
  return {
    year: chinaDate.getUTCFullYear(),
    month: chinaDate.getUTCMonth() + 1,
    day: chinaDate.getUTCDate(),
  }
}

const chinaDateKey = (date = new Date()) => {
  const parts = chinaDateParts(date)
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`
}

const addDaysToChinaDateKey = (dateKey: string, days: number) => {
  const [year, month, day] = dateKey.split('-').map(Number)
  const utc = Date.UTC(year, month - 1, day + days, 0, 0, 0)
  const date = new Date(utc)
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

const chinaLocalToUtcIso = (dateKey: string, minutes: number) => {
  const [year, month, day] = dateKey.split('-').map(Number)
  const utc = Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60, 0) - CHINA_OFFSET_MS
  return new Date(utc).toISOString()
}

const chinaDayUtcRange = (dateKey = chinaDateKey()) => ({
  start: chinaLocalToUtcIso(dateKey, 0),
  end: chinaLocalToUtcIso(addDaysToChinaDateKey(dateKey, 1), 0),
})

const readSettingsRows = () => {
  const rows = getDb()
    .prepare('SELECT key, value FROM site_settings WHERE key IN (?, ?, ?, ?, ?)')
    .all(
      settingKeys.enabled,
      settingKeys.startTime,
      settingKeys.endTime,
      settingKeys.dailyLimit,
      settingKeys.lastRunAt,
    ) as Array<{ key: string; value: string }>

  return Object.fromEntries(rows.map((row) => [row.key, row.value])) as Record<string, string>
}

export const getPostSchedulerSettings = () => {
  const rows = readSettingsRows()
  const startTime = normalizeTime(rows[settingKeys.startTime] || DEFAULT_START_TIME, DEFAULT_START_TIME)
  let endTime = normalizeTime(rows[settingKeys.endTime] || DEFAULT_END_TIME, DEFAULT_END_TIME)

  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    endTime = DEFAULT_END_TIME
  }

  return {
    enabled: normalizeBoolean(rows[settingKeys.enabled] || 'true') === 'true',
    timezone: 'Asia/Shanghai',
    startTime,
    endTime,
    dailyLimit: Number(normalizeDailyLimit(rows[settingKeys.dailyLimit] || '1')),
    lastRunAt: rows[settingKeys.lastRunAt] || '',
  }
}

export const updatePostSchedulerSettings = (input: Record<string, unknown>) => {
  const current = getPostSchedulerSettings()
  const startTime = normalizeTime(asString(input.startTime, current.startTime), current.startTime)
  let endTime = normalizeTime(asString(input.endTime, current.endTime), current.endTime)

  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    endTime = current.endTime
  }

  const next = {
    [settingKeys.enabled]: normalizeBoolean(asString(input.enabled, current.enabled ? 'true' : 'false')),
    [settingKeys.startTime]: startTime,
    [settingKeys.endTime]: endTime,
    [settingKeys.dailyLimit]: normalizeDailyLimit(asString(input.dailyLimit, String(current.dailyLimit))),
  }

  const timestamp = touchNow()
  const statement = getDb().prepare(`
    INSERT INTO site_settings (key, value, created_at, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `)

  Object.entries(next).forEach(([key, value]) => {
    statement.run(key, value, timestamp, timestamp)
  })

  return getPostSchedulerSettings()
}

export const getPostSchedulerOverview = (input: {
  queuePage?: number
  queuePageSize?: number
  recentPage?: number
  recentPageSize?: number
} = {}) => {
  const db = getDb()
  const settings = getPostSchedulerSettings()
  const todayRange = chinaDayUtcRange()
  const queuePageSize = Math.max(10, Math.min(100, Math.trunc(Number(input.queuePageSize) || 20)))
  const recentPageSize = Math.max(10, Math.min(100, Math.trunc(Number(input.recentPageSize) || 10)))
  const queueTotal = (db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM posts
      WHERE status = 'draft'
        AND scheduled_publish_at IS NOT NULL
        AND scheduled_publish_at <> ''
    `)
    .get() as { count: number }).count
  const recentTotal = (db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM posts
      WHERE published_by_scheduler_at IS NOT NULL
        AND published_by_scheduler_at <> ''
    `)
    .get() as { count: number }).count
  const queueTotalPages = Math.max(1, Math.ceil(queueTotal / queuePageSize))
  const recentTotalPages = Math.max(1, Math.ceil(recentTotal / recentPageSize))
  const queuePage = Math.min(
    Math.max(1, Math.trunc(Number(input.queuePage) || 1)),
    queueTotalPages,
  )
  const recentPage = Math.min(
    Math.max(1, Math.trunc(Number(input.recentPage) || 1)),
    recentTotalPages,
  )
  const queueRows = db
    .prepare(`
      SELECT *
      FROM posts
      WHERE status = 'draft'
        AND scheduled_publish_at IS NOT NULL
        AND scheduled_publish_at <> ''
      ORDER BY scheduled_publish_at ASC, id ASC
      LIMIT ? OFFSET ?
    `)
    .all(queuePageSize, (queuePage - 1) * queuePageSize)

  const recentRows = db
    .prepare(`
      SELECT *
      FROM posts
      WHERE published_by_scheduler_at IS NOT NULL
        AND published_by_scheduler_at <> ''
      ORDER BY published_by_scheduler_at DESC, id DESC
      LIMIT ? OFFSET ?
    `)
    .all(recentPageSize, (recentPage - 1) * recentPageSize)

  const unscheduled = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM posts
      WHERE status = 'draft'
        AND (scheduled_publish_at IS NULL OR scheduled_publish_at = '')
    `)
    .get() as { count: number }

  const due = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM posts
      WHERE status = 'draft'
        AND scheduled_publish_at IS NOT NULL
        AND scheduled_publish_at <> ''
        AND scheduled_publish_at <= ?
    `)
    .get(new Date().toISOString()) as { count: number }

  const publishedToday = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM posts
      WHERE published_by_scheduler_at >= ?
        AND published_by_scheduler_at < ?
    `)
    .get(todayRange.start, todayRange.end) as { count: number }

  return {
    settings,
    queue: queueRows.map(mapPostSummary),
    recent: recentRows.map(mapPostSummary),
    stats: {
      unscheduledDrafts: unscheduled.count,
      scheduledDrafts: queueTotal,
      dueDrafts: due.count,
      publishedToday: publishedToday.count,
    },
    pagination: {
      queue: {
        page: queuePage,
        pageSize: queuePageSize,
        total: queueTotal,
        totalPages: queueTotalPages,
      },
      recent: {
        page: recentPage,
        pageSize: recentPageSize,
        total: recentTotal,
        totalPages: recentTotalPages,
      },
    },
  }
}

export const planDraftPostsRandomDaytime = (input: { days?: number } = {}) => {
  const settings = getPostSchedulerSettings()
  const days = Math.max(1, Math.min(60, Math.trunc(Number(input.days) || 30)))
  const db = getDb()
  const draftRows = db
    .prepare(`
      SELECT *
      FROM posts
      WHERE status = 'draft'
        AND (scheduled_publish_at IS NULL OR scheduled_publish_at = '')
      ORDER BY id ASC
      LIMIT ?
    `)
    .all(days)

  const latest = db
    .prepare(`
      SELECT scheduled_publish_at
      FROM posts
      WHERE status = 'draft'
        AND scheduled_publish_at IS NOT NULL
        AND scheduled_publish_at <> ''
      ORDER BY scheduled_publish_at DESC
      LIMIT 1
    `)
    .get() as { scheduled_publish_at: string } | undefined

  const tomorrow = addDaysToChinaDateKey(chinaDateKey(), 1)
  const latestNext = latest?.scheduled_publish_at
    ? addDaysToChinaDateKey(chinaDateKey(new Date(latest.scheduled_publish_at)), 1)
    : tomorrow
  let cursor = latestNext > tomorrow ? latestNext : tomorrow

  const startMinute = timeToMinutes(settings.startTime)
  const endMinute = timeToMinutes(settings.endTime)
  const timestamp = touchNow()
  const update = db.prepare('UPDATE posts SET scheduled_publish_at = ?, updated_at = ? WHERE id = ?')

  draftRows.forEach((row: any) => {
    const randomMinute = startMinute + Math.floor(Math.random() * (endMinute - startMinute + 1))
    update.run(chinaLocalToUtcIso(cursor, randomMinute), timestamp, row.id)
    cursor = addDaysToChinaDateKey(cursor, 1)
  })

  return {
    planned: draftRows.length,
    settings,
    queue: getPostSchedulerOverview().queue,
  }
}

export const publishDueScheduledPosts = () => {
  const settings = getPostSchedulerSettings()
  if (!settings.enabled) {
    return { published: 0, skipped: 'disabled' }
  }

  const db = getDb()
  const timestamp = touchNow()
  const todayRange = chinaDayUtcRange()
  const publishedToday = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM posts
      WHERE published_by_scheduler_at >= ?
        AND published_by_scheduler_at < ?
    `)
    .get(todayRange.start, todayRange.end) as { count: number }

  const remaining = Math.max(0, settings.dailyLimit - publishedToday.count)
  if (remaining <= 0) {
    return { published: 0, skipped: 'daily-limit' }
  }

  const dueRows = db
    .prepare(`
      SELECT *
      FROM posts
      WHERE status = 'draft'
        AND scheduled_publish_at IS NOT NULL
        AND scheduled_publish_at <> ''
        AND scheduled_publish_at <= ?
      ORDER BY scheduled_publish_at ASC, id ASC
      LIMIT ?
    `)
    .all(new Date().toISOString(), remaining) as Array<{ id: number; scheduled_publish_at: string }>

  const update = db.prepare(`
    UPDATE posts
    SET status = 'published',
        published_at = COALESCE(NULLIF(published_at, ''), ?),
        published_by_scheduler_at = ?,
        updated_at = ?
    WHERE id = ?
  `)

  dueRows.forEach((row) => {
    update.run(row.scheduled_publish_at || timestamp, timestamp, timestamp, row.id)
  })

  db.prepare(`
    INSERT INTO site_settings (key, value, created_at, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(settingKeys.lastRunAt, timestamp, timestamp, timestamp)

  return { published: dueRows.length }
}
