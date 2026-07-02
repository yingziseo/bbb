<script setup lang="ts">
import { ArrowDown, ArrowUp, ChatDotRound, Document, Message } from '@element-plus/icons-vue'

const company = await useSiteSettings()

const expanded = ref(false)
const hasUserToggled = ref(false)
let contactMediaQuery: MediaQueryList | null = null
let removeMediaQueryListener = () => {}

const applyDefaultExpanded = () => {
  if (!contactMediaQuery || hasUserToggled.value) return
  expanded.value = contactMediaQuery.matches
}

const openContactOptions = () => {
  hasUserToggled.value = true
  expanded.value = true
}

const collapseContactOptions = () => {
  hasUserToggled.value = true
  expanded.value = false
}

onMounted(() => {
  contactMediaQuery = window.matchMedia('(min-width: 768px)')
  const handleMediaChange = () => applyDefaultExpanded()

  applyDefaultExpanded()
  contactMediaQuery.addEventListener('change', handleMediaChange)
  removeMediaQueryListener = () => {
    contactMediaQuery?.removeEventListener('change', handleMediaChange)
  }
})

onBeforeUnmount(() => {
  removeMediaQueryListener()
})

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
  <div class="fixed right-4 bottom-4 z-50 md:right-5 md:bottom-5">
    <button
      v-if="!expanded"
      type="button"
      class="whatsapp-fab__trigger"
      aria-label="Open contact options"
      :aria-expanded="expanded"
      @click="openContactOptions"
    >
      <span class="whatsapp-fab__trigger-icon" aria-hidden="true">
        <el-icon :size="22">
          <ChatDotRound />
        </el-icon>
      </span>
      <span class="whatsapp-fab__trigger-copy">
        <span class="whatsapp-fab__trigger-label">Contact Us</span>
        <span class="whatsapp-fab__trigger-note">Fast Quote</span>
      </span>
    </button>

    <div
      v-else
      class="w-[min(calc(100vw-24px),300px)] border border-[var(--color-accent-dark)] bg-white shadow-[0_12px_28px_rgba(193,18,31,0.18)] md:w-[280px]"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between border-b border-[var(--color-accent-dark)] bg-[var(--color-accent)] px-4 py-3 text-left text-white"
        aria-label="Collapse contact options"
        :aria-expanded="expanded"
        @click="collapseContactOptions"
      >
        <span>
          <span class="block text-[12px] font-bold uppercase text-white/68">Contact</span>
          <span class="mt-1 block text-[14px] font-semibold">WhatsApp, Email, or Inquiry Form</span>
        </span>
        <el-icon :size="18" class="text-white/78">
          <ArrowUp v-if="expanded" />
          <ArrowDown v-else />
        </el-icon>
      </button>

      <div class="bg-white">
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
              class="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--color-accent-dark)] bg-[var(--color-accent)] text-white"
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
              class="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--color-accent-dark)] bg-[var(--color-accent)] text-white"
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

<style scoped>
.whatsapp-fab__trigger {
  position: relative;
  display: inline-flex;
  min-height: 58px;
  min-width: 142px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid var(--color-accent-dark);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0) 36%),
    linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: #ffffff;
  padding: 8px 17px 8px 11px;
  box-shadow:
    0 18px 36px rgba(15, 42, 74, 0.18),
    0 10px 28px rgba(193, 18, 31, 0.28);
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
  animation: contact-soft-nudge 2s ease-in-out infinite;
}

.whatsapp-fab__trigger::before {
  content: '';
  position: absolute;
  inset: -4px;
  border: 1px solid rgba(193, 18, 31, 0.22);
  pointer-events: none;
}

.whatsapp-fab__trigger:hover {
  border-color: #7f0b13;
  box-shadow:
    0 20px 40px rgba(15, 42, 74, 0.2),
    0 12px 30px rgba(193, 18, 31, 0.34);
}

.whatsapp-fab__trigger-icon {
  display: inline-flex;
  height: 38px;
  width: 38px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.38);
  background: rgba(15, 42, 74, 0.16);
}

.whatsapp-fab__trigger-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.05;
}

.whatsapp-fab__trigger-label {
  white-space: nowrap;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0;
}

.whatsapp-fab__trigger-note {
  margin-top: 4px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

@keyframes contact-soft-nudge {
  0%,
  70%,
  100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }

  74% {
    transform: translate3d(-1px, 0, 0) rotate(-0.8deg);
  }

  78% {
    transform: translate3d(2px, 0, 0) rotate(0.9deg);
  }

  82% {
    transform: translate3d(-2px, 0, 0) rotate(-0.7deg);
  }

  86% {
    transform: translate3d(1px, 0, 0) rotate(0.45deg);
  }

  90% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
}

@media (max-width: 480px) {
  .whatsapp-fab__trigger {
    min-height: 56px;
    min-width: 132px;
    padding-right: 14px;
  }

  .whatsapp-fab__trigger-icon {
    height: 36px;
    width: 36px;
  }

  .whatsapp-fab__trigger-label {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .whatsapp-fab__trigger {
    animation: none;
  }
}
</style>
