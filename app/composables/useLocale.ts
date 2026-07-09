import {
  getLocaleFromPath,
  getSeoAlternatePaths,
  languageOptions,
  localizePath,
  switchLocalePath,
  uiText,
  type LocaleCode,
} from '~/data/i18n'

export const useLocale = () => {
  const route = useRoute()

  const locale = computed<LocaleCode>(() => getLocaleFromPath(route.path))
  const isCn = computed(() => locale.value === 'cn')
  const text = computed(() => uiText[locale.value])
  const currentLanguage = computed(() => languageOptions.find((item) => item.code === locale.value) || languageOptions[0])

  return {
    locale,
    isCn,
    text,
    languages: languageOptions,
    currentLanguage,
    localePath: (path: string) => localizePath(path, locale.value),
    switchLocalePath: (targetLocale: LocaleCode) => switchLocalePath(route.fullPath, targetLocale),
    seoAlternatePaths: () => getSeoAlternatePaths(route.path),
    htmlLang: computed(() => (isCn.value ? 'zh-CN' : 'en')),
  }
}
