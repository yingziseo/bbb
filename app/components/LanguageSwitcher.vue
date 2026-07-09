<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import flagCn from 'flag-icons/flags/4x3/cn.svg'
import flagDe from 'flag-icons/flags/4x3/de.svg'
import flagEs from 'flag-icons/flags/4x3/es.svg'
import flagFr from 'flag-icons/flags/4x3/fr.svg'
import flagId from 'flag-icons/flags/4x3/id.svg'
import flagJp from 'flag-icons/flags/4x3/jp.svg'
import flagKh from 'flag-icons/flags/4x3/kh.svg'
import flagKr from 'flag-icons/flags/4x3/kr.svg'
import flagMm from 'flag-icons/flags/4x3/mm.svg'
import flagMy from 'flag-icons/flags/4x3/my.svg'
import flagPh from 'flag-icons/flags/4x3/ph.svg'
import flagSa from 'flag-icons/flags/4x3/sa.svg'
import flagTh from 'flag-icons/flags/4x3/th.svg'
import flagUs from 'flag-icons/flags/4x3/us.svg'
import flagVn from 'flag-icons/flags/4x3/vn.svg'
import type { LocaleCode } from '~/data/i18n'

type LanguageRow = {
  code: string
  shortCode: string
  nativeLabel: string
  flag: string
  enabled: boolean
}

const props = withDefaults(defineProps<{ compact?: boolean }>(), {
  compact: false,
})

const { currentLanguage, switchLocalePath } = useLocale()
const route = useRoute()
const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)

const languageRows: LanguageRow[] = [
  { code: 'en', shortCode: 'EN', nativeLabel: 'English', flag: flagUs, enabled: true },
  { code: 'cn', shortCode: '中文', nativeLabel: '中文', flag: flagCn, enabled: true },
  { code: 'id', shortCode: 'ID', nativeLabel: 'Indonesian', flag: flagId, enabled: false },
  { code: 'ms', shortCode: 'MS', nativeLabel: 'Malay', flag: flagMy, enabled: false },
  { code: 'th', shortCode: 'TH', nativeLabel: 'Thai', flag: flagTh, enabled: false },
  { code: 'vi', shortCode: 'VI', nativeLabel: 'Vietnamese', flag: flagVn, enabled: false },
  { code: 'fil', shortCode: 'FIL', nativeLabel: 'Filipino', flag: flagPh, enabled: false },
  { code: 'my', shortCode: 'MY', nativeLabel: 'Burmese', flag: flagMm, enabled: false },
  { code: 'km', shortCode: 'KM', nativeLabel: 'Khmer', flag: flagKh, enabled: false },
  { code: 'ar', shortCode: 'AR', nativeLabel: 'Arabic', flag: flagSa, enabled: false },
  { code: 'de', shortCode: 'DE', nativeLabel: 'German', flag: flagDe, enabled: false },
  { code: 'es', shortCode: 'ES', nativeLabel: 'Spanish', flag: flagEs, enabled: false },
  { code: 'fr', shortCode: 'FR', nativeLabel: 'French', flag: flagFr, enabled: false },
  { code: 'ja', shortCode: 'JA', nativeLabel: 'Japanese', flag: flagJp, enabled: false },
  { code: 'ko', shortCode: 'KO', nativeLabel: 'Korean', flag: flagKr, enabled: false },
]

const activeLanguage = computed(() => ({
  ...currentLanguage.value,
  flag: currentLanguage.value.code === 'cn' ? flagCn : flagUs,
}))
const enabledLanguageRows = computed(() => languageRows.filter((item) => item.enabled))
const disabledLanguageRows = computed(() => languageRows.filter((item) => !item.enabled))

const toggleMenu = () => {
  open.value = !open.value
}

const closeMenu = () => {
  open.value = false
}

const changeLanguage = async (code: string) => {
  if (code !== 'en' && code !== 'cn') return
  closeMenu()
  await navigateTo(switchLocalePath(code as LocaleCode))
}

const handleOutsidePointer = (event: PointerEvent) => {
  if (!rootRef.value || rootRef.value.contains(event.target as Node)) return
  closeMenu()
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)

onMounted(() => {
  window.addEventListener('pointerdown', handleOutsidePointer)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handleOutsidePointer)
})
</script>

<template>
  <div ref="rootRef" class="language-switcher" :class="{ 'language-switcher--open': open }">
    <button
      type="button"
      class="language-switcher-trigger"
      :class="{ 'language-switcher-trigger--compact': props.compact }"
      :aria-label="props.compact ? 'Select language' : `Select language ${activeLanguage.shortCode}`"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click.stop="toggleMenu"
    >
      <img :src="activeLanguage.flag" alt="" class="language-switcher-trigger__flag" aria-hidden="true" />
      <span v-if="!props.compact">{{ activeLanguage.shortCode }}</span>
      <el-icon v-if="!props.compact" :size="12"><ArrowDown /></el-icon>
    </button>

    <Transition name="language-switcher-panel">
      <div
        v-if="open"
        class="language-switcher-menu"
        role="menu"
        @click.stop
        @pointerdown.stop
      >
        <button
          v-for="language in enabledLanguageRows"
          :key="language.code"
          type="button"
          class="language-switcher-item"
          role="menuitem"
          @click="changeLanguage(language.code)"
        >
          <span class="flex min-w-0 items-center gap-2">
            <img :src="language.flag" alt="" class="h-3.5 w-5 border border-black/10 object-cover" aria-hidden="true" />
            <span class="w-9 text-[11px] font-extrabold text-[var(--color-navy)]">{{ language.shortCode }}</span>
            <span class="truncate text-[12px] font-medium text-[var(--color-graphite)]">{{ language.nativeLabel }}</span>
          </span>
        </button>

        <span
          v-for="language in disabledLanguageRows"
          :key="language.code"
          class="language-switcher-item language-switcher-item--disabled"
          role="menuitem"
          aria-disabled="true"
          title="Coming soon"
        >
          <span class="flex min-w-0 items-center gap-2">
            <img :src="language.flag" alt="" class="h-3.5 w-5 border border-black/10 object-cover" aria-hidden="true" />
            <span class="w-9 text-[11px] font-extrabold text-[var(--color-navy)]">{{ language.shortCode }}</span>
            <span class="truncate text-[12px] font-medium text-[var(--color-graphite)]">{{ language.nativeLabel }}</span>
          </span>
        </span>
      </div>
    </Transition>
  </div>
</template>

<style>
.language-switcher {
  position: relative;
  display: inline-flex;
}

.language-switcher-trigger {
  display: inline-flex;
  height: 32px;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--color-line);
  background: #fff;
  padding: 0 10px;
  color: var(--color-navy);
  font-size: 12px;
  font-weight: 700;
  transition:
    border-color 180ms ease,
    background-color 180ms ease;
}

.language-switcher-trigger:hover,
.language-switcher-trigger:focus-visible {
  border-color: var(--color-navy);
}

.language-switcher-trigger--compact {
  height: 40px;
  min-width: 40px;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
}

.language-switcher-trigger__flag {
  height: 14px;
  width: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.language-switcher-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 120;
  display: grid;
  width: min(92vw, 300px);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px;
  max-height: min(260px, 70vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--color-line);
  background: #fff;
  padding: 6px;
  box-shadow: 0 16px 36px rgba(15, 42, 74, 0.16);
}

.language-switcher-item {
  display: flex;
  min-width: 0;
  min-height: 32px;
  align-items: center;
  border: 0;
  background: #fff;
  padding: 0 8px;
  text-align: left;
  line-height: 1;
}

.language-switcher-item:hover,
.language-switcher-item:focus-visible {
  background: var(--color-panel);
}

.language-switcher-item--disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.language-switcher-item--disabled:hover,
.language-switcher-item--disabled:focus {
  background: transparent;
  color: inherit;
}

.language-switcher-panel-enter-active,
.language-switcher-panel-leave-active {
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.language-switcher-panel-enter-from,
.language-switcher-panel-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
