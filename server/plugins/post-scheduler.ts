import { publishDueScheduledPosts } from '../utils/post-scheduler'

let running = false

const runScheduler = () => {
  if (running) return
  running = true

  try {
    publishDueScheduledPosts()
  } catch (error) {
    console.error('[post-scheduler] failed to publish due posts', error)
  } finally {
    running = false
  }
}

export default defineNitroPlugin(() => {
  runScheduler()
  setInterval(runScheduler, 5 * 60 * 1000)
})
