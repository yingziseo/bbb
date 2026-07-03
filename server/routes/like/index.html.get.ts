import { sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  return sendRedirect(event, '/like', 301)
})
