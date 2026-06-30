<script setup lang="ts">
import { ArrowDown, ArrowUp, Document, Message } from '@element-plus/icons-vue'
import { company } from '~/data/site'

const expanded = ref(true)

const contactOptions = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    detail: company.phone,
    href: company.whatsappLink,
    external: true,
  },
  {
    key: 'email',
    label: 'Email',
    detail: company.email,
    href: company.contactLink,
    external: true,
  },
  {
    key: 'form',
    label: 'Inquiry Form',
    detail: 'Submit requirements',
    href: '/contact',
    external: false,
  },
]
</script>

<template>
  <div class="fixed right-4 bottom-4 z-50 w-[min(calc(100vw-24px),300px)] md:right-5 md:bottom-5 md:w-[280px]">
    <div class="border border-[var(--color-accent-dark)] bg-white shadow-[0_12px_28px_rgba(193,18,31,0.18)]">
      <button
        type="button"
        class="flex w-full items-center justify-between border-b border-[var(--color-accent-dark)] bg-[var(--color-accent)] px-4 py-3 text-left text-white"
        @click="expanded = !expanded"
      >
        <span>
          <span class="block text-[12px] font-bold uppercase tracking-[0.12em] text-white/68">Contact</span>
          <span class="mt-1 block text-[14px] font-semibold">WhatsApp, email, or form</span>
        </span>
        <el-icon :size="18" class="text-white/78">
          <ArrowUp v-if="expanded" />
          <ArrowDown v-else />
        </el-icon>
      </button>

      <div v-show="expanded" class="bg-white">
        <template v-for="(item, index) in contactOptions" :key="item.key">
          <a
            v-if="item.external"
            :href="item.href"
            target="_blank"
            rel="noopener"
            :class="[
              'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fff5f6]',
              index !== contactOptions.length - 1 ? 'border-b border-[var(--color-line)]' : '',
            ]"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e9bcc0] bg-[#fff3f4] text-[var(--color-accent)]"
            >
              <svg
                v-if="item.key === 'whatsapp'"
                viewBox="0 0 24 24"
                class="h-[18px] w-[18px] fill-current"
                aria-hidden="true"
              >
                <path
                  d="M20.5 3.5A11.4 11.4 0 0 0 2.8 17.2L1.5 22.5l5.5-1.2A11.4 11.4 0 1 0 20.5 3.5m-8.6 16a9.4 9.4 0 0 1-4.8-1.3l-.3-.2-3.2.7.7-3.1-.2-.3a9.4 9.4 0 1 1 7.8 4.2m5.1-7c-.3-.1-1.8-.9-2-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.5.1a7.7 7.7 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.4.1-.5l.4-.4.3-.5v-.5c-.1-.1-.6-1.5-.9-2s-.5-.4-.7-.4h-.6a1.2 1.2 0 0 0-.8.4c-.3.3-1 1-1 2.3s1 2.5 1 2.7c.2.1 2 3.1 4.8 4.3.7.4 1.3.6 1.7.7.8.2 1.5.2 2.1.1.6-.1 1.8-.7 2-1.4s.3-1.2.2-1.4-.2-.2-.5-.4"
                />
              </svg>

              <el-icon v-else :size="18">
                <Message />
              </el-icon>
            </span>

            <span class="min-w-0 flex-1">
              <span class="block text-[14px] font-semibold text-[var(--color-navy)]">{{ item.label }}</span>
              <span class="block truncate text-[12px] text-[var(--color-slate-muted)]">{{ item.detail }}</span>
            </span>
          </a>

          <NuxtLink
            v-else
            :to="item.href"
            :class="[
              'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fff5f6]',
              index !== contactOptions.length - 1 ? 'border-b border-[var(--color-line)]' : '',
            ]"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e9bcc0] bg-[#fff3f4] text-[var(--color-accent)]"
            >
              <el-icon :size="18">
                <Document />
              </el-icon>
            </span>

            <span class="min-w-0 flex-1">
              <span class="block text-[14px] font-semibold text-[var(--color-navy)]">{{ item.label }}</span>
              <span class="block truncate text-[12px] text-[var(--color-slate-muted)]">{{ item.detail }}</span>
            </span>
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>
