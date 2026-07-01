<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg
    v-if="name === 'facebook'"
    viewBox="0 0 24 24"
    class="h-5 w-5 fill-current"
    aria-hidden="true"
  >
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.6 1.5-1.6H16V4.8c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H8v3h2.6v7z" />
  </svg>

  <svg
    v-else-if="name === 'instagram'"
    viewBox="0 0 24 24"
    class="h-5 w-5 fill-none stroke-current"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <rect x="4.2" y="4.2" width="15.6" height="15.6" />
    <circle cx="12" cy="12" r="3.7" />
    <circle cx="17.2" cy="6.8" r="0.8" class="fill-current stroke-none" />
  </svg>

  <svg v-else-if="name === 'x'" viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M18.9 4H16l-3.7 4.8L9.4 4H4l5.6 7.5L4.3 20H7l3.9-5 3.7 5H20l-5.9-8z" />
  </svg>

  <svg v-else-if="name === 'youtube'" viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M21 8.6c-.2-1.2-1.1-2.2-2.2-2.4C16.9 5.8 12 5.8 12 5.8s-4.9 0-6.8.4C4.1 6.4 3.2 7.4 3 8.6c-.4 1.9-.4 3.4-.4 3.4s0 1.5.4 3.4c.2 1.2 1.1 2.2 2.2 2.4 1.9.4 6.8.4 6.8.4s4.9 0 6.8-.4c1.1-.2 2-1.2 2.2-2.4.4-1.9.4-3.4.4-3.4s0-1.5-.4-3.4M10 15.5v-7l6 3.5z" />
  </svg>

  <svg v-else-if="name === 'tiktok'" viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M14.6 4c.4 1.4 1.2 2.3 2.4 3 .8.5 1.7.8 2.6.8v2.8c-1.4 0-2.8-.4-4-1.2v5.1c0 3-2.2 5.3-5.3 5.3S5 17.5 5 14.7s2.3-5.2 5.2-5.2h.5v2.8h-.5c-1.3 0-2.4 1-2.4 2.4 0 1.3 1 2.4 2.4 2.4 1.5 0 2.5-1.1 2.5-2.8V4z" />
  </svg>

  <svg v-else-if="name === 'linkedin'" viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M5.4 8.5h3.2V19H5.4zm1.6-4.1A1.85 1.85 0 1 1 7 8.1a1.85 1.85 0 0 1 0-3.7M10.7 8.5h3v1.4h.1c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.7V19h-3.2v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19h-3.2z" />
  </svg>

  <svg v-else viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M20.7 4.3 2.9 11.1c-.8.3-.8 1.4.1 1.6l4.6 1.4 1.8 5.1c.3.8 1.3.9 1.7.2l2.6-4 4.7 3.5c.6.5 1.5.1 1.6-.7l1.5-12.4c.1-1-1-1.6-1.8-1.3m-9.3 10.4-.7 2.7-.9-2.7 7.2-6.1z" />
  </svg>
</template>
