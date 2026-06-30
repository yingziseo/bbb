<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '网站设置 | YIYUAN' })

type SettingsForm = {
  siteUrl: string
  displayName: string
  name: string
  tagline: string
  email: string
  phone: string
  whatsapp: string
  whatsappLink: string
  address: string
  location: string
  founded: string
  registeredCapital: string
  legalRepresentative: string
}

type SettingsResponse = {
  settings: SettingsForm & { contactLink?: string }
}

const createEmptyForm = (): SettingsForm => ({
  siteUrl: '',
  displayName: '',
  name: '',
  tagline: '',
  email: '',
  phone: '',
  whatsapp: '',
  whatsappLink: '',
  address: '',
  location: '',
  founded: '',
  registeredCapital: '',
  legalRepresentative: '',
})

const { data, pending, refresh } = await useFetch<SettingsResponse>('/api/admin/settings')
const saving = ref(false)
const form = reactive<SettingsForm>(createEmptyForm())

const applySettings = (settings?: Partial<SettingsForm>) => {
  Object.assign(form, createEmptyForm(), settings || {})
}

applySettings(data.value?.settings)

watch(
  () => data.value?.settings,
  (settings) => applySettings(settings),
)

const save = async () => {
  saving.value = true
  try {
    const result = await $fetch<SettingsResponse>('/api/admin/settings', {
      method: 'PUT',
      body: form,
    })
    applySettings(result.settings)
    ElMessage.success('网站设置已保存')
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">网站设置</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">维护前台页头、页脚、联系按钮、结构化数据、sitemap 和 robots 使用的基础信息。</p>
      </div>
      <div class="flex gap-3">
        <el-button :loading="pending" @click="refresh">刷新</el-button>
        <el-button color="#c1121f" :loading="saving" @click="save">保存设置</el-button>
      </div>
    </div>

    <el-form label-position="top">
      <div class="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section class="border border-[var(--color-line)] bg-white p-5 sm:p-6">
          <h2 class="mb-5 text-[18px] font-extrabold text-[var(--color-navy)]">站点身份</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <el-form-item label="品牌显示名">
              <el-input v-model="form.displayName" placeholder="YIYUAN NEW MATERIALS" />
            </el-form-item>
            <el-form-item label="公司法定名称">
              <el-input v-model="form.name" placeholder="Shangqiu Yiyuan New Materials Co., Ltd." />
            </el-form-item>
            <el-form-item label="品牌标语" class="md:col-span-2">
              <el-input v-model="form.tagline" placeholder="China Export Quality Factory" />
            </el-form-item>
            <el-form-item label="成立年份">
              <el-input v-model="form.founded" placeholder="2023" />
            </el-form-item>
            <el-form-item label="注册资本">
              <el-input v-model="form.registeredCapital" placeholder="RMB 1 million" />
            </el-form-item>
            <el-form-item label="法定代表人">
              <el-input v-model="form.legalRepresentative" placeholder="Liu Ke" />
            </el-form-item>
            <el-form-item label="地区">
              <el-input v-model="form.location" placeholder="Shangqiu, Henan, China" />
            </el-form-item>
          </div>
        </section>

        <section class="border border-[var(--color-line)] bg-white p-5 sm:p-6">
          <h2 class="mb-5 text-[18px] font-extrabold text-[var(--color-navy)]">联系方式</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="sales@example.com" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="form.phone" placeholder="+86 ..." />
            </el-form-item>
            <el-form-item label="WhatsApp 号码">
              <el-input v-model="form.whatsapp" placeholder="+86 ..." />
            </el-form-item>
            <el-form-item label="WhatsApp 链接">
              <el-input v-model="form.whatsappLink" placeholder="留空则根据号码自动生成 https://wa.me/..." />
            </el-form-item>
            <el-form-item label="工厂地址" class="md:col-span-2">
              <el-input v-model="form.address" type="textarea" :rows="4" placeholder="完整地址" />
            </el-form-item>
          </div>
        </section>

        <section class="border border-[var(--color-line)] bg-white p-5 sm:p-6 xl:col-span-2">
          <h2 class="mb-5 text-[18px] font-extrabold text-[var(--color-navy)]">SEO / Sitemap</h2>
          <div class="max-w-3xl">
            <el-form-item label="网站域名">
              <el-input v-model="form.siteUrl" placeholder="例如：http://43.134.105.149:3005 或 https://www.example.com" />
            </el-form-item>
            <p class="text-[13px] leading-relaxed text-[var(--color-slate-muted)]">
              留空时，sitemap.xml 和 robots.txt 会按当前访问请求自动生成完整域名；正式上线绑定域名后建议填写固定域名。
            </p>
          </div>
        </section>
      </div>
    </el-form>
  </div>
</template>
