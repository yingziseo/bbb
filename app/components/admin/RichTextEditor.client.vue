<script setup lang="ts">
import {
  Delete,
  Document,
  EditPen,
  Link,
  List,
  Picture,
  Tickets,
  View,
} from '@element-plus/icons-vue'

type EditorMode = 'visual' | 'source' | 'preview'

const model = defineModel<string>({ default: '<p></p>' })

const mode = ref<EditorMode>('visual')
const editorRef = ref<HTMLElement>()
const sourceValue = ref(model.value || '<p></p>')
let syncingInternally = false

const normalizedHtml = (value: string) => {
  const html = value.trim()
  return html ? html : '<p><br></p>'
}

const setEditorHtml = () => {
  if (!editorRef.value) return
  const html = normalizedHtml(model.value || '')
  if (editorRef.value.innerHTML !== html) {
    editorRef.value.innerHTML = html
  }
}

const commit = (value: string) => {
  syncingInternally = true
  model.value = value
  sourceValue.value = value
  nextTick(() => {
    syncingInternally = false
  })
}

watch(
  () => model.value,
  (value) => {
    if (syncingInternally) return
    sourceValue.value = value || '<p></p>'
    if (mode.value === 'visual') nextTick(setEditorHtml)
  },
)

watch(mode, (value) => {
  if (value === 'visual') nextTick(setEditorHtml)
})

onMounted(setEditorHtml)

const syncFromEditor = () => {
  commit(editorRef.value?.innerHTML || '<p></p>')
}

const syncFromSource = () => {
  commit(sourceValue.value || '<p></p>')
}

const focusEditor = () => {
  editorRef.value?.focus()
}

const runCommand = async (command: string, value?: string) => {
  mode.value = 'visual'
  await nextTick()
  focusEditor()
  document.execCommand(command, false, value)
  syncFromEditor()
}

const formatBlock = (tag: 'p' | 'h2' | 'h3' | 'blockquote') => {
  runCommand('formatBlock', tag)
}

const insertLink = async () => {
  const href = window.prompt('输入链接地址')
  if (!href) return
  await runCommand('createLink', href)
}

const insertImage = async () => {
  const src = window.prompt('输入图片地址，例如 /uploads/example.png')
  if (!src) return
  await runCommand('insertImage', src)
}

const insertTable = async () => {
  await runCommand(
    'insertHTML',
    '<table><tbody><tr><th>Header</th><th>Header</th></tr><tr><td>Content</td><td>Content</td></tr></tbody></table>',
  )
}

const clearFormatting = () => {
  runCommand('removeFormat')
}

const handlePaste = (event: ClipboardEvent) => {
  const html = event.clipboardData?.getData('text/html')
  if (html) return

  const text = event.clipboardData?.getData('text/plain')
  if (!text) return

  event.preventDefault()
  const paragraphs = text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<p>${item.replace(/\n/g, '<br>')}</p>`)
    .join('')
  document.execCommand('insertHTML', false, paragraphs)
  syncFromEditor()
}

const ensureContent = () => {
  const text = editorRef.value?.innerText.trim()
  if (!text && editorRef.value) {
    editorRef.value.innerHTML = '<p><br></p>'
  }
  syncFromEditor()
}
</script>

<template>
  <div class="admin-rich-editor">
    <div class="admin-rich-editor__modebar">
      <button
        type="button"
        :class="['admin-rich-editor__mode', mode === 'visual' ? 'is-active' : '']"
        @click="mode = 'visual'"
      >
        <el-icon><EditPen /></el-icon>
        编写
      </button>
      <button
        type="button"
        :class="['admin-rich-editor__mode', mode === 'source' ? 'is-active' : '']"
        @click="mode = 'source'"
      >
        <el-icon><Document /></el-icon>
        HTML
      </button>
      <button
        type="button"
        :class="['admin-rich-editor__mode', mode === 'preview' ? 'is-active' : '']"
        @click="mode = 'preview'"
      >
        <el-icon><View /></el-icon>
        预览
      </button>
    </div>

    <div v-if="mode === 'visual'" class="admin-rich-editor__toolbar" @mousedown.prevent>
      <button type="button" title="正文" @click="formatBlock('p')">P</button>
      <button type="button" title="二级标题" @click="formatBlock('h2')">H2</button>
      <button type="button" title="三级标题" @click="formatBlock('h3')">H3</button>
      <button type="button" title="引用" @click="formatBlock('blockquote')">“”</button>
      <span class="admin-rich-editor__divider" />
      <button type="button" title="加粗" @click="runCommand('bold')"><strong>B</strong></button>
      <button type="button" title="斜体" @click="runCommand('italic')"><em>I</em></button>
      <button type="button" title="下划线" @click="runCommand('underline')"><u>U</u></button>
      <span class="admin-rich-editor__divider" />
      <button type="button" title="无序列表" @click="runCommand('insertUnorderedList')">
        <el-icon><List /></el-icon>
      </button>
      <button type="button" title="有序列表" @click="runCommand('insertOrderedList')">1.</button>
      <button type="button" title="链接" @click="insertLink">
        <el-icon><Link /></el-icon>
      </button>
      <button type="button" title="图片" @click="insertImage">
        <el-icon><Picture /></el-icon>
      </button>
      <button type="button" title="表格" @click="insertTable">
        <el-icon><Tickets /></el-icon>
      </button>
      <span class="admin-rich-editor__divider" />
      <button type="button" title="清除格式" @click="clearFormatting">
        <el-icon><Delete /></el-icon>
      </button>
    </div>

    <div
      v-show="mode === 'visual'"
      ref="editorRef"
      class="admin-rich-editor__canvas article-body"
      contenteditable="true"
      role="textbox"
      aria-label="文章正文编辑器"
      @input="syncFromEditor"
      @blur="ensureContent"
      @paste="handlePaste"
    />

    <textarea
      v-show="mode === 'source'"
      v-model="sourceValue"
      class="admin-rich-editor__source"
      spellcheck="false"
      aria-label="文章 HTML 源码"
      @input="syncFromSource"
    />

    <div v-show="mode === 'preview'" class="admin-rich-editor__preview article-body" v-html="model" />
  </div>
</template>

<style scoped>
.admin-rich-editor {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--color-line-strong);
  background: #ffffff;
}

.admin-rich-editor__modebar {
  display: flex;
  border-bottom: 1px solid var(--color-line);
  background: var(--color-panel);
}

.admin-rich-editor__mode {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  gap: 6px;
  border-right: 1px solid var(--color-line);
  padding: 0 14px;
  color: var(--color-graphite);
  font-size: 13px;
  font-weight: 700;
}

.admin-rich-editor__mode.is-active {
  background: #ffffff;
  color: var(--color-navy);
}

.admin-rich-editor__toolbar {
  display: flex;
  min-height: 44px;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid var(--color-line);
  background: #ffffff;
  padding: 6px;
}

.admin-rich-editor__toolbar button {
  display: inline-flex;
  min-width: 34px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  color: var(--color-navy);
  font-size: 13px;
  font-weight: 700;
}

.admin-rich-editor__toolbar button:hover {
  border-color: var(--color-line-strong);
  background: var(--color-panel);
}

.admin-rich-editor__divider {
  width: 1px;
  height: 24px;
  margin-inline: 4px;
  background: var(--color-line);
}

.admin-rich-editor__canvas,
.admin-rich-editor__source,
.admin-rich-editor__preview {
  min-height: 460px;
  width: 100%;
  background: #ffffff;
}

.admin-rich-editor__canvas,
.admin-rich-editor__preview {
  padding: 22px;
}

.admin-rich-editor__canvas {
  outline: none;
}

.admin-rich-editor__canvas:focus {
  box-shadow: inset 0 0 0 2px rgba(15, 42, 74, 0.14);
}

.admin-rich-editor__source {
  display: block;
  resize: vertical;
  border: 0;
  padding: 18px;
  color: var(--color-ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.65;
  outline: none;
}

.admin-rich-editor__preview {
  overflow: auto;
  background: #fbfcfd;
}
</style>
