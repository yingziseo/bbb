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
              :class="item.key === 'whatsapp' ? '!text-[#25D366]' : ''"
            >
              <svg
                v-if="item.key === 'whatsapp'"
                viewBox="0 0 24 24"
                class="h-[19px] w-[19px] fill-current"
                aria-hidden="true"
              >
                <path
                  d="M12 2.2A9.8 9.8 0 0 0 3.7 17.3L2.4 21.6l4.5-1.2A9.8 9.8 0 1 0 12 2.2m0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-2.6.7.7-2.5-.2-.3A8 8 0 1 1 12 20m4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8.9-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.3 0-.4.1-.5l.4-.4.2-.4c.1-.2 0-.3 0-.4s-.5-1.2-.7-1.7-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3s-.9.8-.9 2 .9 2.4 1 2.5a9.3 9.3 0 0 0 3.6 3.2c1.8.8 1.8.5 2.2.5s1.4-.5 1.6-1 .2-1 .2-1.1-.2-.2-.4-.3"
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
