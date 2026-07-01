<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = route.params.id as string
const loading = ref(false)

const { data } = await useFetch(`/api/admin/seo/${id}`)

if (!data.value?.item) {
  throw createError({ statusCode: 404, statusMessage: 'SEO entry not found' })
}

useHead({ title: `编辑页面 TDK | ${data.value.item.name}` })

const form = reactive({
  title: data.value.item.title,
  description: data.value.item.description,
  keywords: data.value.item.keywords,
  canonical: data.value.item.canonical,
  robots: data.value.item.robots,
})

const save = async () => {
  loading.value = true
  try {
    await $fetch(`/api/admin/seo/${id}`, {
      method: 'PUT',
      body: form,
    })
    ElMessage.success('SEO 已保存')
    await navigateTo('/admin/seo')
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
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">编辑页面 TDK</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">{{ data?.item.name }} · {{ data?.item.path }}</p>
      </div>
      <NuxtLink to="/admin/seo">
        <el-button plain>返回列表</el-button>
      </NuxtLink>
    </div>

    <div class="border border-[var(--color-line)] bg-white p-6">
      <el-form label-position="top">
        <el-form-item label="Title">
          <el-input v-model="form.title" maxlength="80" show-word-limit />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="form.description" type="textarea" :rows="3" maxlength="180" show-word-limit />
        </el-form-item>
        <el-form-item label="Keywords">
          <el-input v-model="form.keywords" placeholder="关键词用英文逗号分隔" />
        </el-form-item>
        <el-form-item label="Canonical">
          <el-input v-model="form.canonical" placeholder="可留空，或填写绝对 URL" />
        </el-form-item>
        <el-form-item label="Robots">
          <el-select v-model="form.robots" class="w-full">
            <el-option label="index,follow" value="index,follow" />
            <el-option label="noindex,follow" value="noindex,follow" />
            <el-option label="index,nofollow" value="index,nofollow" />
            <el-option label="noindex,nofollow" value="noindex,nofollow" />
          </el-select>
        </el-form-item>

        <div class="mt-6 flex gap-3">
          <el-button color="#c1121f" :loading="loading" @click="save">保存</el-button>
          <NuxtLink to="/admin/seo"><el-button plain>取消</el-button></NuxtLink>
        </div>
      </el-form>
    </div>
  </div>
</template>
