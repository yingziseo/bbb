<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '新建文章 | YIYUAN' })

const loading = ref(false)
const uploadLoading = ref(false)

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  contentHtml: '<p></p>',
  status: 'draft',
  publishedAt: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  canonical: '',
})

const uploadCover = async (option: any) => {
  uploadLoading.value = true
  try {
    const body = new FormData()
    body.append('file', option.file)
    const result = await $fetch<{ path: string }>('/api/admin/uploads', { method: 'POST', body })
    form.coverImage = result.path
    ElMessage.success('封面已上传')
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '上传失败')
  } finally {
    uploadLoading.value = false
  }
}

const save = async () => {
  loading.value = true
  try {
    const result = await $fetch<{ item: { id: number } }>('/api/admin/posts', {
      method: 'POST',
      body: form,
    })
    ElMessage.success('文章已创建')
    await navigateTo(`/like/posts/${result.item.id}`)
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">新建文章</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">发布博客文章，支持富文本和 HTML 源码。</p>
      </div>
      <NuxtLink to="/like/posts"><el-button plain>返回列表</el-button></NuxtLink>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div class="border border-[var(--color-line)] bg-white p-6">
        <el-form label-position="top">
          <el-form-item label="标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="Slug">
            <el-input v-model="form.slug" placeholder="留空则根据标题自动生成" />
          </el-form-item>
          <el-form-item label="摘要">
            <el-input v-model="form.excerpt" type="textarea" :rows="3" maxlength="220" show-word-limit />
          </el-form-item>
          <el-form-item label="正文">
            <ClientOnly>
              <AdminRichTextEditor v-model="form.contentHtml" />
              <template #fallback>
                <div class="min-h-[520px] w-full border border-[var(--color-line-strong)] bg-white p-6 text-[14px] text-[var(--color-slate-muted)]">
                  编辑器加载中...
                </div>
              </template>
            </ClientOnly>
          </el-form-item>
        </el-form>
      </div>

      <aside class="space-y-6">
        <div class="border border-[var(--color-line)] bg-white p-5">
          <h2 class="mb-4 text-[17px] font-bold text-[var(--color-navy)]">发布设置</h2>
          <el-form label-position="top">
            <el-form-item label="状态">
              <el-select v-model="form.status" class="w-full">
                <el-option label="草稿" value="draft" />
                <el-option label="已发布" value="published" />
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker v-model="form.publishedAt" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss.sssZ" class="!w-full" />
            </el-form-item>
            <el-form-item label="封面图">
              <div class="flex w-full flex-col gap-3">
                <el-input v-model="form.coverImage" placeholder="/uploads/xxx.png" />
                <img v-if="form.coverImage" :src="form.coverImage" alt="" class="h-36 w-full border border-[var(--color-line)] object-cover" />
                <el-upload :show-file-list="false" :http-request="uploadCover" accept="image/*">
                  <el-button :loading="uploadLoading">上传封面</el-button>
                </el-upload>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <div class="border border-[var(--color-line)] bg-white p-5">
          <h2 class="mb-4 text-[17px] font-bold text-[var(--color-navy)]">文章 SEO</h2>
          <el-form label-position="top">
            <el-form-item label="SEO Title"><el-input v-model="form.seoTitle" /></el-form-item>
            <el-form-item label="SEO Description"><el-input v-model="form.seoDescription" type="textarea" :rows="3" /></el-form-item>
            <el-form-item label="SEO Keywords"><el-input v-model="form.seoKeywords" /></el-form-item>
            <el-form-item label="Canonical"><el-input v-model="form.canonical" /></el-form-item>
          </el-form>
        </div>

        <el-button color="#c1121f" size="large" class="w-full" :loading="loading" @click="save">保存文章</el-button>
      </aside>
    </div>
  </div>
</template>
