<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

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
  </div>
</template>

<style scoped>
.article-toc {
  display: none;
  min-width: 0;
}

.article-toc__desktop {
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

@media (min-width: 1024px) {
  .article-toc {
    position: sticky;
    top: 96px;
    display: block;
    align-self: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .article-toc__header,
  .article-toc__link {
    transition: none;
  }
}
</style>
