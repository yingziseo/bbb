<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import flagCn from 'flag-icons/flags/4x3/cn.svg'
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
  label: string
  nativeName: string
  flag: string
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: flagUs },
  { code: 'id', label: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: flagId },
  { code: 'ms', label: 'Malay', nativeName: 'Bahasa Melayu', flag: flagMy },
  { code: 'th', label: 'Thai', nativeName: 'ไทย', flag: flagTh },
  { code: 'vi', label: 'Vietnamese', nativeName: 'Tiếng Việt', flag: flagVn },
  { code: 'fil', label: 'Filipino', nativeName: 'Filipino', flag: flagPh },
  { code: 'my', label: 'Burmese', nativeName: 'မြန်မာ', flag: flagMm },
  { code: 'km', label: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: flagKh },
  { code: 'zh', label: 'Chinese', nativeName: '中文', flag: flagCn },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', flag: flagJp },
  { code: 'ko', label: 'Korean', nativeName: '한국어', flag: flagKr },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: flagSa },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: flagEs },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: flagFr },
]

const activeLanguage = languages[0]

const notifyUnavailable = () => {
  ElMessage.info('Multilingual feature is not online yet.')
}
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end" @command="notifyUnavailable">
    <button
      type="button"
      class="inline-flex h-9 items-center gap-2 border border-[var(--color-line)] bg-white px-3 text-[13px] font-semibold text-[var(--color-navy)] transition-colors hover:border-[var(--color-navy)]"
      aria-label="Select language"
    >
      <img :src="activeLanguage.flag" alt="" class="h-3.5 w-5 border border-black/10 object-cover" aria-hidden="true" />
      <span>{{ activeLanguage.code.toUpperCase() }}</span>
      <el-icon :size="13"><ArrowDown /></el-icon>
    </button>

    <template #dropdown>
      <el-dropdown-menu class="language-switcher-menu">
        <el-dropdown-item
          v-for="language in languages"
          :key="language.code"
          :command="language.code"
        >
          <span class="flex min-w-[190px] items-center gap-3">
            <img :src="language.flag" alt="" class="h-3.5 w-5 border border-black/10 object-cover" aria-hidden="true" />
            <span class="min-w-0">
              <span class="block text-[13px] font-semibold text-[var(--color-navy)]">{{ language.label }}</span>
              <span class="block truncate text-[12px] text-[var(--color-slate-muted)]">{{ language.nativeName }}</span>
            </span>
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
