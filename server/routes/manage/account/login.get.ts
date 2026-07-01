import { sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  return sendRedirect(event, '/like/login', 301)
})
