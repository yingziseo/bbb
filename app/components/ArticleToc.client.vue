<script setup lang="ts">
import { ArrowDown, ArrowUp, Close, Operation } from '@element-plus/icons-vue'

type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

const props = withDefaults(
  defineProps<{
    targetSelector?: string
    contentKey?: string | number
  }>(),
  {
    targetSelector: '.article-body',
    contentKey: '',
  },
)

const items = ref<TocItem[]>([])
const activeId = ref('')
const desktopExpanded = ref(true)
const mobileOpen = ref(false)
let ticking = false

const hasItems = computed(() => items.value.length >= 2)

const makeSlug = (value: string, index: number) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)

  return slug || `section-${index + 1}`
}

const collectHeadings = () => {
  const article = document.querySelector<HTMLElement>(props.targetSelector)
  if (!article) {
    items.value = []
    activeId.value = ''
    return
  }

  const used = new Set<string>()
  const headings = Array.from(article.querySelectorAll<HTMLElement>('h2, h3'))

  items.value = headings
    .map((heading, index) => {
      const text = heading.textContent?.replace(/\s+/g, ' ').trim() || ''
      if (!text) return null

      const sourceId = heading.id || makeSlug(text, index)
      let id = sourceId
      let suffix = 2
      while (used.has(id)) {
        id = `${sourceId}-${suffix}`
        suffix += 1
      }
      used.add(id)
      heading.id = id

      return {
        id,
        text,
        level: heading.tagName.toLowerCase() === 'h3' ? 3 : 2,
      } satisfies TocItem
    })
    .filter(Boolean) as TocItem[]

  activeId.value = items.value[0]?.id || ''
  updateActive()
}

const updateActive = () => {
  if (!items.value.length) return

  const topOffset = 104
  let current = items.value[0]?.id || ''

  for (const item of items.value) {
    const heading = document.getElementById(item.id)
    if (!heading) continue
    if (heading.getBoundingClientRect().top <= topOffset) {
      current = item.id
    } else {
      break
    }
  }

  activeId.value = current
}

const requestActiveUpdate = () => {
  if (ticking) return
  ticking = true
  window.requestAnimationFrame(() => {
    updateActive()
    ticking = false
  })
}

const scrollToHeading = (id: string) => {
  const heading = document.getElementById(id)
  if (!heading) return

  heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
  activeId.value = id
  mobileOpen.value = false
}

const rebuild = async () => {
  await nextTick()
  collectHeadings()
}

watch(() => props.contentKey, rebuild)

onMounted(() => {
  rebuild()
  window.addEventListener('scroll', requestActiveUpdate, { passive: true })
  window.addEventListener('resize', requestActiveUpdate, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestActiveUpdate)
  window.removeEventListener('resize', requestActiveUpdate)
})
</script>

<template>
  <div v-if="hasItems" class="article-toc">
    <aside class="article-toc__desktop" aria-label="Article outline">
      <button
        type="button"
        class="article-toc__header"
        :aria-expanded="desktopExpanded"
        @click="desktopExpanded = !desktopExpanded"
      >
        <span class="article-toc__header-copy">
          <span class="article-toc__eyebrow">Article</span>
          <span class="article-toc__title">On this page</span>
        </span>
        <el-icon :size="16" class="article-toc__header-icon">
          <ArrowUp v-if="desktopExpanded" />
          <ArrowDown v-else />
        </el-icon>
      </button>

      <nav v-show="desktopExpanded" class="article-toc__nav">
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="article-toc__link"
          :class="[
            item.level === 3 ? 'article-toc__link--child' : '',
            activeId === item.id ? 'is-active' : '',
          ]"
          @click="scrollToHeading(item.id)"
        >
          {{ item.text }}
        </button>
      </nav>
    </aside>

    <button
      type="button"
      class="article-toc__mobile-trigger"
      aria-controls="article-mobile-toc"
      :aria-expanded="mobileOpen"
      @click="mobileOpen = true"
    >
      <el-icon :size="17"><Operation /></el-icon>
      <span>Outline</span>
    </button>

    <button
      v-if="mobileOpen"
      type="button"
      class="article-toc__mobile-backdrop"
      aria-label="Close article outline"
      @click="mobileOpen = false"
    />

    <section
      id="article-mobile-toc"
      class="article-toc__mobile-panel"
      :class="{ 'is-open': mobileOpen }"
      aria-label="Article outline"
    >
      <div class="article-toc__mobile-head">
        <div>
          <span class="article-toc__eyebrow">Article</span>
          <h2>On this page</h2>
        </div>
        <button type="button" class="article-toc__close" aria-label="Close article outline" @click="mobileOpen = false">
          <el-icon :size="20"><Close /></el-icon>
        </button>
      </div>

      <nav class="article-toc__mobile-list">
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="article-toc__mobile-link"
          :class="[
            item.level === 3 ? 'article-toc__mobile-link--child' : '',
            activeId === item.id ? 'is-active' : '',
          ]"
          @click="scrollToHeading(item.id)"
        >
          {{ item.text }}
        </button>
      </nav>
    </section>
  </div>
</template>

<style scoped>
.article-toc {
  min-width: 0;
}

.article-toc__desktop {
  position: sticky;
  top: 96px;
  display: none;
  border: 1px solid var(--color-line);
  background: #fff;
}

.article-toc__header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 0;
  border-bottom: 1px solid var(--color-line);
  background: #fff;
  padding: 14px 15px;
  text-align: left;
  color: var(--color-navy);
  cursor: pointer;
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.article-toc__header:hover {
  background: var(--color-panel);
}

.article-toc__header-copy {
  min-width: 0;
}

.article-toc__eyebrow {
  display: block;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.article-toc__title {
  margin-top: 2px;
  display: block;
  font-size: 15px;
  font-weight: 800;
}

.article-toc__header-icon {
  flex: 0 0 auto;
  color: var(--color-slate-muted);
}

.article-toc__nav {
  max-height: calc(100vh - 178px);
  overflow-y: auto;
  padding: 8px 0;
}

.article-toc__link {
  position: relative;
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 8px 15px 8px 18px;
  text-align: left;
  color: var(--color-slate-muted);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.35;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.article-toc__link::before {
  position: absolute;
  top: 9px;
  bottom: 9px;
  left: 0;
  width: 3px;
  background: transparent;
  content: '';
}

.article-toc__link:hover {
  background: #fff5f6;
  color: var(--color-navy);
}

.article-toc__link.is-active {
  background: #fff5f6;
  color: var(--color-navy);
}

.article-toc__link.is-active::before {
  background: var(--color-accent);
}

.article-toc__link--child {
  padding-left: 30px;
  font-size: 12.5px;
  font-weight: 600;
}

.article-toc__mobile-trigger {
  position: fixed;
  right: auto;
  bottom: 16px;
  left: 16px;
  z-index: 45;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-navy);
  background: var(--color-navy);
  padding: 0 13px;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 12px 28px rgba(15, 42, 74, 0.18);
}

.article-toc__mobile-backdrop {
  position: fixed;
  inset: 0;
  z-index: 58;
  border: 0;
  background: rgba(10, 31, 56, 0.34);
}

.article-toc__mobile-panel {
  position: fixed;
  right: 12px;
  bottom: 12px;
  left: 12px;
  z-index: 60;
  max-height: min(74vh, 560px);
  transform: translateY(calc(100% + 24px));
  border: 1px solid var(--color-line-strong);
  background: #fff;
  box-shadow: 0 -18px 38px rgba(15, 42, 74, 0.2);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 220ms ease,
    opacity 180ms ease;
}

.article-toc__mobile-panel.is-open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.article-toc__mobile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-line);
  padding: 14px 15px;
}

.article-toc__mobile-head h2 {
  margin: 2px 0 0;
  color: var(--color-navy);
  font-size: 18px;
  font-weight: 850;
  line-height: 1.2;
}

.article-toc__close {
  display: inline-flex;
  height: 38px;
  width: 38px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-line);
  background: #fff;
  color: var(--color-navy);
}

.article-toc__mobile-list {
  max-height: calc(min(74vh, 560px) - 68px);
  overflow-y: auto;
  padding: 8px 0 10px;
}

.article-toc__mobile-link {
  position: relative;
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 11px 16px 11px 20px;
  text-align: left;
  color: var(--color-graphite);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.article-toc__mobile-link::before {
  position: absolute;
  top: 11px;
  bottom: 11px;
  left: 0;
  width: 3px;
  background: transparent;
  content: '';
}

.article-toc__mobile-link.is-active {
  background: #fff5f6;
  color: var(--color-navy);
}

.article-toc__mobile-link.is-active::before {
  background: var(--color-accent);
}

.article-toc__mobile-link--child {
  padding-left: 34px;
  color: var(--color-slate-muted);
  font-size: 13px;
  font-weight: 650;
}

@media (min-width: 1024px) {
  .article-toc__desktop {
    display: block;
  }

  .article-toc__mobile-trigger,
  .article-toc__mobile-backdrop,
  .article-toc__mobile-panel {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .article-toc__mobile-panel,
  .article-toc__header,
  .article-toc__link {
    transition: none;
  }
}
</style>
