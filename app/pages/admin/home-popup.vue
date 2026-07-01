<script setup lang="ts">
import { ChatDotRound, Message, Present, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '首页弹窗 | YIYUAN' })

type PopupForm = {
  homePopupEnabled: string
  homePopupCooldownHours: string
  homePopupVideoUrl: string
}

type SettingsResponse = {
  settings: PopupForm & {
    email?: string
    whatsappLink?: string
    contactLink?: string
  }
}

const createEmptyForm = (): PopupForm => ({
  homePopupEnabled: 'true',
  homePopupCooldownHours: '12',
  homePopupVideoUrl: '',
})

const { data, pending, refresh } = await useFetch<SettingsResponse>('/api/admin/settings')
const saving = ref(false)
const form = reactive<PopupForm>(createEmptyForm())

const enabledModel = computed({
  get: () => form.homePopupEnabled === 'true',
  set: (value: boolean) => {
    form.homePopupEnabled = value ? 'true' : 'false'
  },
})

const cooldownModel = computed({
  get: () => {
    const value = Number(form.homePopupCooldownHours)
    return Number.isFinite(value) ? Math.max(1, Math.min(720, Math.trunc(value))) : 12
  },
  set: (value: number | undefined) => {
    form.homePopupCooldownHours = String(Math.max(1, Math.min(720, Math.trunc(Number(value) || 12))))
  },
})

const contactEmail = computed(() => data.value?.settings.email || 'sales@example.com')

const applySettings = (settings?: Partial<PopupForm>) => {
  Object.assign(form, createEmptyForm(), settings || {})
}

const isExternalUrl = (value: string) => {
  const trimmed = value.trim()
  return !trimmed || /^https?:\/\//i.test(trimmed)
}

const save = async () => {
  if (!isExternalUrl(form.homePopupVideoUrl)) {
    ElMessage.error('视频地址必须是 http 或 https 外链')
    return
  }

  saving.value = true
  try {
    form.homePopupCooldownHours = String(cooldownModel.value)
    const result = await $fetch<SettingsResponse>('/api/admin/settings', {
      method: 'PUT',
      body: form,
    })
    applySettings(result.settings)
    ElMessage.success('首页弹窗设置已保存')
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
  } finally {
    saving.value = false
  }
}

applySettings(data.value?.settings)

watch(
  () => data.value?.settings,
  (settings) => applySettings(settings),
)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">首页弹窗</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">
          控制首页业务弹窗展示、关闭后的本机缓存时间，以及外部视频播放地址。
        </p>
      </div>
      <div class="flex gap-3">
        <el-button :loading="pending" @click="refresh">刷新</el-button>
        <el-button color="#c1121f" :loading="saving" @click="save">保存设置</el-button>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section class="border border-[var(--color-line)] bg-white p-5 sm:p-6">
        <h2 class="mb-5 text-[18px] font-extrabold text-[var(--color-navy)]">展示规则</h2>
        <el-form label-position="top">
          <el-form-item label="是否展示首页弹窗">
            <div class="flex w-full items-center justify-between gap-4 border border-[var(--color-line)] px-4 py-3">
              <div>
                <div class="text-[14px] font-semibold text-[var(--color-navy)]">
                  {{ enabledModel ? '已开启' : '已关闭' }}
                </div>
                <div class="mt-1 text-[12px] text-[var(--color-slate-muted)]">
                  关闭后前台首页不会弹出业务引导窗口。
                </div>
              </div>
              <el-switch v-model="enabledModel" />
            </div>
          </el-form-item>

          <el-form-item label="点击关闭后缓存时间">
            <div class="grid w-full gap-3 sm:grid-cols-[220px_1fr]">
              <el-input-number v-model="cooldownModel" :min="1" :max="720" :step="1" controls-position="right" />
              <div class="flex items-center text-[13px] leading-relaxed text-[var(--color-slate-muted)]">
                单位：小时。只有访客点击弹窗关闭按钮后才开始计时，默认 12 小时。
              </div>
            </div>
          </el-form-item>

          <el-form-item label="外部视频播放地址">
            <el-input
              v-model.trim="form.homePopupVideoUrl"
              placeholder="例如：https://www.youtube.com/watch?v=..."
              clearable
            />
            <p class="mt-2 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">
              支持 YouTube、youtu.be 或其他可 iframe 播放的 https 外链；视频不上传到本服务器。
            </p>
          </el-form-item>
        </el-form>

        <div class="mt-4 border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
          <div class="text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--color-slate-muted)]">Current Logic</div>
          <div class="mt-3 grid gap-2 text-[14px] text-[var(--color-graphite)]">
            <div>展示状态：<strong class="text-[var(--color-navy)]">{{ enabledModel ? '开启' : '关闭' }}</strong></div>
            <div>关闭冷却：<strong class="text-[var(--color-navy)]">{{ cooldownModel }} 小时</strong></div>
            <div>视频来源：<strong class="text-[var(--color-navy)]">{{ form.homePopupVideoUrl ? '外部链接' : '未配置' }}</strong></div>
          </div>
        </div>
      </section>

      <section class="border border-[var(--color-line)] bg-white p-5 sm:p-6">
        <h2 class="mb-5 text-[18px] font-extrabold text-[var(--color-navy)]">弹窗预览</h2>
        <div class="border border-[var(--color-line)] bg-white">
          <div class="grid md:grid-cols-[1fr_0.9fr]">
            <div class="p-6 sm:p-8">
              <span class="inline-block border-l-3 border-[var(--color-accent)] pl-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                YIYUAN Packaging Supply
              </span>
              <h3 class="mt-4 max-w-[12ch] text-[30px] font-extrabold leading-tight text-[var(--color-navy)]">
                Custom Food Packaging and Cling Film
              </h3>
              <p class="mt-4 text-[14px] leading-relaxed text-[var(--color-graphite)]">
                We supply cling film, fresh wrap, disposable food containers, and private-label packaging for wholesale and OEM orders.
              </p>
              <div class="mt-5 grid gap-2 text-[13px] font-semibold text-[var(--color-navy)]">
                <span class="flex items-center gap-2"><el-icon class="text-[var(--color-accent)]"><Present /></el-icon>Free sample support</span>
                <span class="flex items-center gap-2"><el-icon class="text-[var(--color-accent)]"><ChatDotRound /></el-icon>Fast quote by WhatsApp</span>
              </div>
              <div class="mt-6 flex flex-wrap gap-3">
                <el-button color="#c1121f">Free Sample</el-button>
                <el-button color="#1b3c63">Contact Us</el-button>
                <span class="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-[var(--color-slate-muted)]">
                  <el-icon><Message /></el-icon>{{ contactEmail }}
                </span>
              </div>
            </div>

            <div class="relative min-h-[260px] border-t border-[var(--color-line)] bg-[var(--color-navy-dark)] md:border-l md:border-t-0">
              <div class="absolute inset-0 bg-[url('/images/workshop-main.png')] bg-cover bg-center opacity-28" />
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                <span class="flex h-[66px] w-[66px] items-center justify-center border border-white/40 bg-[var(--color-accent)]">
                  <el-icon :size="28"><VideoPlay /></el-icon>
                </span>
                <strong class="text-[16px]">Factory Video</strong>
                <span class="text-[12px] font-semibold uppercase text-white/65">External player</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
