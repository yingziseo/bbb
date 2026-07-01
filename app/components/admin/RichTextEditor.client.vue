<script setup lang="ts">
import { ElMessage } from 'element-plus'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/tinymce'
import 'tinymce/models/dom'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/image'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
import 'tinymce-i18n/langs8/zh-CN.js'
import 'tinymce/skins/ui/oxide/skin.min.css'
import type { RawEditorOptions } from 'tinymce'

const model = defineModel<string>({ default: '<p></p>' })

const uploadImage = async (file: Blob, filename: string) => {
  const body = new FormData()
  body.append('file', file, filename)
  const result = await $fetch<{ path: string }>('/api/admin/uploads', {
    method: 'POST',
    body,
  })

  return result.path
}

const imagesUploadHandler: RawEditorOptions['images_upload_handler'] = async (blobInfo, progress) => {
  progress(15)
  const path = await uploadImage(blobInfo.blob(), blobInfo.filename())
  progress(100)
  return path
}

const filePickerCallback: RawEditorOptions['file_picker_callback'] = (callback, _value, meta) => {
  if (meta.filetype !== 'image') return

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png,image/jpeg,image/webp,image/gif'

  input.addEventListener('change', async () => {
    const file = input.files?.[0]
    if (!file) return

    try {
      const path = await uploadImage(file, file.name)
      callback(path, {
        alt: file.name.replace(/\.[^.]+$/, ''),
        title: file.name,
      })
      ElMessage.success('图片已插入正文')
    } catch (error: any) {
      ElMessage.error(error?.data?.message || error?.statusMessage || '图片上传失败')
    }
  })

  input.click()
}

const editorInit: RawEditorOptions = {
  license_key: 'gpl',
  language: 'zh-CN',
  height: 560,
  min_height: 420,
  max_height: 900,
  resize: true,
  skin: false,
  content_css: false,
  branding: false,
  promotion: false,
  elementpath: false,
  menubar: 'file edit view insert format tools table help',
  plugins:
    'advlist anchor autolink autosave charmap code fullscreen help image insertdatetime link lists media nonbreaking pagebreak preview quickbars searchreplace table visualblocks visualchars wordcount',
  toolbar:
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table blockquote | removeformat code preview fullscreen',
  toolbar_mode: 'sliding',
  quickbars_selection_toolbar: 'bold italic underline | quicklink h2 h3 blockquote | bullist numlist',
  quickbars_insert_toolbar: 'quickimage quicktable media',
  contextmenu: 'link image table',
  block_formats: '段落=p; 一级标题=h1; 二级标题=h2; 三级标题=h3; 引用=blockquote; 预格式=pre',
  font_size_formats: '12px 14px 16px 18px 20px 24px 28px 32px',
  paste_data_images: true,
  automatic_uploads: true,
  images_reuse_filename: false,
  images_file_types: 'jpeg,jpg,jpe,png,gif,webp',
  images_upload_handler: imagesUploadHandler,
  file_picker_types: 'image',
  file_picker_callback: filePickerCallback,
  image_advtab: true,
  image_caption: true,
  image_title: true,
  link_assume_external_targets: 'https',
  link_default_target: '_blank',
  link_title: true,
  default_link_target: '_blank',
  target_list: [
    { title: '当前窗口打开', value: '' },
    { title: '新窗口打开', value: '_blank' },
  ],
  rel_list: [
    { title: '默认', value: '' },
    { title: 'No opener', value: 'noopener' },
    { title: 'No follow', value: 'nofollow' },
    { title: 'No opener + No follow', value: 'noopener nofollow' },
  ],
  media_live_embeds: true,
  media_alt_source: false,
  media_poster: false,
  table_default_attributes: {
    border: '0',
  },
  table_default_styles: {
    width: '100%',
  },
  style_formats: [
    { title: '正文强调', inline: 'strong' },
    { title: '红色重点', inline: 'span', styles: { color: '#c1121f', fontWeight: '700' } },
    { title: '蓝色重点', inline: 'span', styles: { color: '#0f2a4a', fontWeight: '700' } },
    { title: '图片居中', selector: 'img', styles: { display: 'block', marginLeft: 'auto', marginRight: 'auto' } },
  ],
  content_style: `
    body {
      color: #2f3b49;
      font-family: Inter, Arial, Helvetica, sans-serif;
      font-size: 16px;
      line-height: 1.75;
      margin: 18px;
    }
    h1, h2, h3, h4 {
      color: #0f2a4a;
      font-weight: 800;
      line-height: 1.25;
    }
    h1 { font-size: 30px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    a {
      color: #c1121f;
      font-weight: 700;
    }
    img {
      border: 1px solid #d7dee8;
      height: auto;
      max-width: 100%;
    }
    figure {
      margin: 1.5rem 0;
    }
    figcaption {
      color: #69778a;
      font-size: 13px;
      margin-top: 8px;
      text-align: center;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    td, th {
      border: 1px solid #d7dee8;
      padding: 10px 12px;
    }
    th {
      background: #f4f7fb;
      color: #0f2a4a;
      font-weight: 800;
    }
    blockquote {
      border-left: 4px solid #c1121f;
      color: #43556b;
      margin: 1.4rem 0;
      padding: 8px 0 8px 18px;
    }
  `,
}
</script>

<template>
  <div class="admin-rich-editor">
    <Editor v-model="model" :init="editorInit" license-key="gpl" output-format="html" />
    <div class="admin-rich-editor__hint">
      支持图片上传、粘贴图片、插入链接、表格、视频嵌入、HTML 源码和预览。
    </div>
  </div>
</template>

<style scoped>
.admin-rich-editor {
  width: 100%;
}

.admin-rich-editor :deep(.tox-tinymce) {
  border-color: var(--color-line-strong);
  border-radius: 0;
}

.admin-rich-editor :deep(.tox .tox-toolbar),
.admin-rich-editor :deep(.tox .tox-toolbar__overflow),
.admin-rich-editor :deep(.tox .tox-toolbar__primary) {
  background: #ffffff;
}

.admin-rich-editor :deep(.tox .tox-tbtn:hover),
.admin-rich-editor :deep(.tox .tox-tbtn--enabled),
.admin-rich-editor :deep(.tox .tox-split-button:hover) {
  background: var(--color-panel);
}

.admin-rich-editor :deep(.tox .tox-tbtn svg) {
  fill: var(--color-navy);
}

.admin-rich-editor :deep(.tox .tox-statusbar) {
  border-top-color: var(--color-line);
}

.admin-rich-editor__hint {
  border: 1px solid var(--color-line-strong);
  border-top: 0;
  background: #fbfcfd;
  padding: 10px 12px;
  color: var(--color-slate-muted);
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .admin-rich-editor :deep(.tox-tinymce) {
    min-height: 480px;
  }

  .admin-rich-editor__hint {
    font-size: 11.5px;
  }
}
</style>
