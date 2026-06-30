<script setup lang="ts">
import { company, categories, complianceMarqueeItems } from '~/data/site'

const socialPlatforms = [
  { key: 'facebook', name: 'Facebook' },
  { key: 'instagram', name: 'Instagram' },
  { key: 'x', name: 'X' },
  { key: 'youtube', name: 'YouTube' },
  { key: 'tiktok', name: 'TikTok' },
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'telegram', name: 'Telegram' },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-[var(--color-navy-dark)] text-white/80">
    <div class="footer-compliance">
      <InfoMarquee :items="complianceMarqueeItems" direction="rtl" tone="dark" />
    </div>

    <div class="container-x py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="flex h-9 w-9 items-center justify-center bg-white text-[var(--color-navy)] font-extrabold text-lg">Y</span>
          <span class="font-extrabold text-[18px] text-white">{{ company.displayName }}</span>
        </div>
        <p class="text-[14px] leading-relaxed text-white/70">{{ company.tagline }}</p>
      </div>

      <div>
        <h4 class="text-white font-bold text-[14px] uppercase tracking-[0.12em] mb-4">Products</h4>
        <ul class="space-y-2.5 text-[14px]">
          <li v-for="c in categories" :key="c.slug">
            <NuxtLink :to="`/products?category=${c.slug}`" class="hover:text-white transition-colors">{{ c.name }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold text-[14px] uppercase tracking-[0.12em] mb-4">Company</h4>
        <ul class="space-y-2.5 text-[14px]">
          <li><NuxtLink to="/about" class="hover:text-white transition-colors">Company Profile</NuxtLink></li>
          <li><NuxtLink to="/products" class="hover:text-white transition-colors">All Products</NuxtLink></li>
          <li><NuxtLink to="/blog" class="hover:text-white transition-colors">Blog</NuxtLink></li>
          <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Contact</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold text-[14px] uppercase tracking-[0.12em] mb-4">Contact</h4>
        <ul class="space-y-2.5 text-[14px] text-white/70">
          <li>{{ company.phone }}</li>
          <li>{{ company.email }}</li>
          <li>{{ company.name }}</li>
          <li class="leading-relaxed">{{ company.address }}</li>
        </ul>
        <a :href="company.whatsappLink" target="_blank" class="inline-block mt-4">
          <el-button color="#c1121f">Chat on WhatsApp</el-button>
        </a>

        <div class="mt-7">
          <h5 class="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-white/54">Social</h5>
          <div class="grid grid-cols-4 gap-2.5">
            <span
              v-for="item in socialPlatforms"
              :key="item.key"
              :title="item.name"
              :aria-label="item.name"
              aria-disabled="true"
              class="flex h-10 w-10 items-center justify-center border border-white/12 bg-transparent text-white/62 transition-colors hover:bg-white/6 hover:text-white/82"
            >
              <svg
                v-if="item.key === 'facebook'"
                viewBox="0 0 24 24"
                class="h-[15px] w-[15px] fill-current"
                aria-hidden="true"
              >
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.6 1.5-1.6H16V4.8c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H8v3h2.6v7z" />
              </svg>

              <svg
                v-else-if="item.key === 'instagram'"
                viewBox="0 0 24 24"
                class="h-[16px] w-[16px] fill-none stroke-current"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <rect x="4.2" y="4.2" width="15.6" height="15.6" />
                <circle cx="12" cy="12" r="3.7" />
                <circle cx="17.2" cy="6.8" r="0.8" class="fill-current stroke-none" />
              </svg>

              <svg
                v-else-if="item.key === 'x'"
                viewBox="0 0 24 24"
                class="h-[15px] w-[15px] fill-current"
                aria-hidden="true"
              >
                <path d="M18.9 4H16l-3.7 4.8L9.4 4H4l5.6 7.5L4.3 20H7l3.9-5 3.7 5H20l-5.9-8z" />
              </svg>

              <svg
                v-else-if="item.key === 'youtube'"
                viewBox="0 0 24 24"
                class="h-[16px] w-[16px] fill-current"
                aria-hidden="true"
              >
                <path d="M21 8.6c-.2-1.2-1.1-2.2-2.2-2.4C16.9 5.8 12 5.8 12 5.8s-4.9 0-6.8.4C4.1 6.4 3.2 7.4 3 8.6c-.4 1.9-.4 3.4-.4 3.4s0 1.5.4 3.4c.2 1.2 1.1 2.2 2.2 2.4 1.9.4 6.8.4 6.8.4s4.9 0 6.8-.4c1.1-.2 2-1.2 2.2-2.4.4-1.9.4-3.4.4-3.4s0-1.5-.4-3.4M10 15.5v-7l6 3.5z" />
              </svg>

              <svg
                v-else-if="item.key === 'tiktok'"
                viewBox="0 0 24 24"
                class="h-[16px] w-[16px] fill-current"
                aria-hidden="true"
              >
                <path d="M14.6 4c.4 1.4 1.2 2.3 2.4 3 .8.5 1.7.8 2.6.8v2.8c-1.4 0-2.8-.4-4-1.2v5.1c0 3-2.2 5.3-5.3 5.3S5 17.5 5 14.7s2.3-5.2 5.2-5.2h.5v2.8h-.5c-1.3 0-2.4 1-2.4 2.4 0 1.3 1 2.4 2.4 2.4 1.5 0 2.5-1.1 2.5-2.8V4z" />
              </svg>

              <svg
                v-else-if="item.key === 'linkedin'"
                viewBox="0 0 24 24"
                class="h-[16px] w-[16px] fill-current"
                aria-hidden="true"
              >
                <path d="M5.4 8.5h3.2V19H5.4zm1.6-4.1A1.85 1.85 0 1 1 7 8.1a1.85 1.85 0 0 1 0-3.7M10.7 8.5h3v1.4h.1c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.7V19h-3.2v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19h-3.2z" />
              </svg>

              <svg
                v-else
                viewBox="0 0 24 24"
                class="h-[16px] w-[16px] fill-current"
                aria-hidden="true"
              >
                <path d="M20.7 4.3 2.9 11.1c-.8.3-.8 1.4.1 1.6l4.6 1.4 1.8 5.1c.3.8 1.3.9 1.7.2l2.6-4 4.7 3.5c.6.5 1.5.1 1.6-.7l1.5-12.4c.1-1-1-1.6-1.8-1.3m-9.3 10.4-.7 2.7-.9-2.7 7.2-6.1z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/55">
        <span>© {{ year }} {{ company.name }} All rights reserved.</span>
        <span>{{ company.location }}</span>
      </div>
    </div>
  </footer>
</template>
