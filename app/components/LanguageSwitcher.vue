<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
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

type LanguageOption = {
  code: string
  shortCode: string
  label: string
  flag: string
}

const languages: LanguageOption[] = [
  { code: 'en', shortCode: 'EN', label: 'English', flag: flagUs },
  { code: 'zh', shortCode: 'ZH', label: 'Chinese', flag: flagCn },
  { code: 'id', shortCode: 'ID', label: 'Indonesian', flag: flagId },
  { code: 'ms', shortCode: 'MS', label: 'Malay', flag: flagMy },
  { code: 'th', shortCode: 'TH', label: 'Thai', flag: flagTh },
  { code: 'vi', shortCode: 'VI', label: 'Vietnamese', flag: flagVn },
  { code: 'fil', shortCode: 'FIL', label: 'Filipino', flag: flagPh },
  { code: 'my', shortCode: 'MY', label: 'Burmese', flag: flagMm },
  { code: 'km', shortCode: 'KM', label: 'Khmer', flag: flagKh },
  { code: 'ar', shortCode: 'AR', label: 'Arabic', flag: flagSa },
  { code: 'de', shortCode: 'DE', label: 'German', flag: flagDe },
  { code: 'es', shortCode: 'ES', label: 'Spanish', flag: flagEs },
  { code: 'fr', shortCode: 'FR', label: 'French', flag: flagFr },
  { code: 'ja', shortCode: 'JA', label: 'Japanese', flag: flagJp },
  { code: 'ko', shortCode: 'KO', label: 'Korean', flag: flagKr },
]

const props = withDefaults(defineProps<{ compact?: boolean }>(), {
  compact: false,
})
const activeLanguage = languages[0]

const notifyUnavailable = () => {
  ElMessage.info('Multilingual feature is not online yet.')
}
</script>

<template>
  <el-dropdown
    trigger="click"
    placement="bottom-end"
    popper-class="language-switcher-popper"
    @command="notifyUnavailable"
  >
    <button
      type="button"
      class="language-switcher-trigger"
      :class="{ 'language-switcher-trigger--compact': props.compact }"
      aria-label="Select language"
    >
      <img :src="activeLanguage.flag" alt="" class="language-switcher-trigger__flag" aria-hidden="true" />
      <span v-if="!props.compact">{{ activeLanguage.shortCode }}</span>
      <el-icon v-if="!props.compact" :size="12"><ArrowDown /></el-icon>
    </button>

    <template #dropdown>
      <el-dropdown-menu
        class="language-switcher-menu"
        @wheel.stop
        @touchmove.stop
        @pointerdown.stop
      >
        <el-dropdown-item
          v-for="language in languages"
          :key="language.code"
          :command="language.code"
          class="language-switcher-item"
        >
          <span class="flex min-w-0 items-center gap-2">
            <img :src="language.flag" alt="" class="h-3.5 w-5 border border-black/10 object-cover" aria-hidden="true" />
            <span class="w-7 text-[11px] font-extrabold text-[var(--color-navy)]">{{ language.shortCode }}</span>
            <span class="truncate text-[12px] font-medium text-[var(--color-graphite)]">{{ language.label }}</span>
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style>
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

.language-switcher-popper {
  max-width: min(92vw, 310px);
}

.language-switcher-popper .language-switcher-menu {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px;
  max-height: min(260px, 70vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
}

.language-switcher-popper .language-switcher-item {
  width: 142px;
  min-height: 32px;
  padding: 0 8px;
  line-height: 1;
}
</style>
