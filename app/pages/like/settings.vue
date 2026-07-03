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
  logoPath: string
  faviconPath: string
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
  logoPath: '/site-logo.png',
  faviconPath: '/favicon-96x96.png',
})

const { data, pending, refresh } = await useFetch<SettingsResponse>('/api/admin/settings')
const saving = ref(false)
const uploadLoading = ref('')
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

const uploadAsset = async (option: any, target: 'logoPath' | 'faviconPath') => {
  uploadLoading.value = target
  try {
    const body = new FormData()
    body.append('file', option.file)
    const result = await $fetch<{ path: string }>('/api/admin/uploads', {
      method: 'POST',
      body,
    })
    form[target] = result.path
    ElMessage.success(target === 'logoPath' ? 'Logo 已上传' : 'ICO 图标已上传')
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '上传失败')
  } finally {
    uploadLoading.value = ''
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
            <el-form-item label="网站 Logo 图标" class="md:col-span-2">
              <div class="grid w-full gap-3 sm:grid-cols-[96px_1fr]">
                <div class="flex h-24 w-24 items-center justify-center border border-[var(--color-line)] bg-[var(--color-panel)] p-2">
                  <img :src="form.logoPath || '/site-logo.png'" alt="Logo 预览" class="max-h-full max-w-full object-contain" />
                </div>
                <div class="min-w-0">
                  <el-input v-model="form.logoPath" placeholder="/site-logo.png 或 /uploads/logo.png" />
                  <div class="mt-2 flex flex-wrap items-center gap-3">
                    <el-upload
                      :show-file-list="false"
                      :http-request="(option: any) => uploadAsset(option, 'logoPath')"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                    >
                      <el-button :loading="uploadLoading === 'logoPath'">上传替换 Logo</el-button>
                    </el-upload>
                    <span class="text-[12px] text-[var(--color-slate-muted)]">建议 100x100 PNG，前台导航会自动读取。</span>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="网页 PNG 图标" class="md:col-span-2">
              <div class="grid w-full gap-3 sm:grid-cols-[72px_1fr]">
                <div class="flex h-[72px] w-[72px] items-center justify-center border border-[var(--color-line)] bg-[var(--color-panel)] p-2">
                  <img :src="form.faviconPath || '/favicon-96x96.png'" alt="网页图标预览" class="max-h-full max-w-full object-contain" />
                </div>
                <div class="min-w-0">
                  <el-input v-model="form.faviconPath" placeholder="/favicon-96x96.png 或 /uploads/favicon.png" />
                  <div class="mt-2 flex flex-wrap items-center gap-3">
                    <el-upload
                      :show-file-list="false"
                      :http-request="(option: any) => uploadAsset(option, 'faviconPath')"
                      accept="image/png"
                    >
                      <el-button :loading="uploadLoading === 'faviconPath'">上传替换 PNG 图标</el-button>
                    </el-upload>
                    <span class="text-[12px] text-[var(--color-slate-muted)]">当前默认使用 96x96 PNG，网页头部会输出明确的 type 和 sizes。</span>
                  </div>
                </div>
              </div>
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
