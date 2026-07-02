<script setup lang="ts">
import { Close, FullScreen, Message, Mute, Present, Promotion, VideoCamera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { defaultHomePopupVideoUrl } from '~/data/site'

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
  homePopupVideoUrl: defaultHomePopupVideoUrl,
})

const { data, pending, refresh } = await useFetch<SettingsResponse>('/api/admin/settings')
const saving = ref(false)
const previewVideoOpen = ref(false)
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
const previewVideoUrl = computed(() => toEmbedVideoUrl(form.homePopupVideoUrl || defaultHomePopupVideoUrl))

const applySettings = (settings?: Partial<PopupForm>) => {
  Object.assign(form, createEmptyForm(), settings || {})
}

const isExternalUrl = (value: string) => {
  const trimmed = value.trim()
  return !trimmed || /^https?:\/\//i.test(trimmed)
}

function toEmbedVideoUrl(rawUrl: string) {
  const trimmed = rawUrl.trim()
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) return ''

  try {
    const url = new URL(trimmed)
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase()
    const youtubeHosts = ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com']
    let videoId = ''

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] || ''
    } else if (youtubeHosts.includes(hostname)) {
      if (url.pathname.startsWith('/watch')) {
        videoId = url.searchParams.get('v') || ''
      } else if (url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/').filter(Boolean)[1] || ''
      }
    }

    if (videoId && /^[\w-]{6,}$/.test(videoId)) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
    }

    return trimmed
  } catch {
    return ''
  }
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
                <span class="flex items-center gap-2"><el-icon class="text-[var(--color-accent)]"><Present /></el-icon>Free Sample Support</span>
                <span class="flex items-center gap-2 text-[var(--color-navy)]"><SocialIcon name="whatsapp" />Fast Quote by WhatsApp</span>
              </div>
              <div class="mt-6 flex flex-wrap gap-3">
                <el-button color="#c1121f">
                  <el-icon><Promotion /></el-icon>
                  <span>Free Sample</span>
                </el-button>
                <el-button color="#1b3c63">
                  <span class="inline-flex items-center gap-1.5">
                    <SocialIcon name="whatsapp" />
                    <span>Contact on WhatsApp</span>
                  </span>
                </el-button>
                <span class="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-[var(--color-slate-muted)]">
                  <el-icon><Message /></el-icon>{{ contactEmail }}
                </span>
              </div>
            </div>

            <div class="flex min-h-[260px] items-center border-t border-[var(--color-line)] bg-[var(--color-navy-dark)] p-5 md:border-l md:border-t-0">
              <div class="w-full overflow-hidden border border-white/15 bg-black/45 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
                <div class="flex h-10 items-center justify-start gap-3 border-b border-white/15 px-3 text-white">
                  <span class="flex min-w-0 items-center gap-2 text-[13px] font-extrabold">
                    <el-icon><VideoCamera /></el-icon>
                    Factory Video
                  </span>
                </div>
                <div class="relative aspect-video overflow-hidden">
                  <div class="absolute inset-0 bg-[url('/images/workshop-main.webp')] bg-cover bg-center opacity-40" />
                  <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,31,56,0.1),rgba(10,31,56,0.72))]" />
                  <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:42px_42px] opacity-30" />
                  <button
                    type="button"
                    class="group absolute inset-0 flex flex-col items-center justify-center gap-3 border-0 bg-[radial-gradient(circle_at_center,rgba(193,18,31,0.16),transparent_34%),rgba(10,31,56,0.1)] text-white transition-colors hover:bg-[radial-gradient(circle_at_center,rgba(193,18,31,0.24),transparent_38%),rgba(10,31,56,0.02)]"
                    @click="previewVideoOpen = true"
                  >
                    <span class="flex h-[66px] w-[66px] items-center justify-center border border-white/45 bg-[rgba(193,18,31,0.18)] shadow-[0_16px_34px_rgba(0,0,0,0.24),inset_0_0_0_1px_rgba(193,18,31,0.34)] backdrop-blur-md transition group-hover:scale-[1.06] group-hover:border-white/70 group-hover:bg-[rgba(193,18,31,0.26)] group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.28),0_0_0_8px_rgba(193,18,31,0.12),inset_0_0_0_1px_rgba(193,18,31,0.44)]">
                      <span
                        class="ml-1 block h-0 w-0"
                        style="border-top: 13px solid transparent; border-bottom: 13px solid transparent; border-left: 21px solid rgba(255,255,255,0.96); filter: drop-shadow(0 2px 8px rgba(193, 18, 31, 0.35));"
                      />
                    </span>
                    <strong class="text-center text-[16px]">Watch Real Factory Video</strong>
                  </button>
                </div>
                <div class="grid h-11 grid-cols-[auto_minmax(60px,1fr)_auto_auto_auto] items-center gap-2 border-t border-white/15 px-3 text-white/72">
                  <span class="text-[11px] font-extrabold tabular-nums">00:00</span>
                  <span class="h-1 overflow-hidden bg-white/18">
                    <span class="block h-full w-[28%] bg-[var(--color-accent)]" />
                  </span>
                  <span class="text-[11px] font-extrabold tabular-nums">01:28</span>
                  <span class="flex h-6 w-6 items-center justify-center border border-white/15">
                    <el-icon><Mute /></el-icon>
                  </span>
                  <span class="flex h-6 w-6 items-center justify-center border border-white/15">
                    <el-icon><FullScreen /></el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="previewVideoOpen" class="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button class="absolute inset-0 border-0 bg-black/75 backdrop-blur-md" aria-label="关闭视频预览" @click="previewVideoOpen = false" />
      <section class="relative z-10 w-[min(980px,100%)] overflow-hidden border border-white/15 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.42)]">
        <div class="flex h-12 items-center justify-between border-b border-white/12 px-4 text-white">
          <span class="flex items-center gap-2 text-[14px] font-extrabold">
            <el-icon><VideoCamera /></el-icon>
            Factory Video
          </span>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/5 text-white hover:border-[rgba(193,18,31,0.68)] hover:bg-[rgba(193,18,31,0.18)]"
            aria-label="关闭视频"
            @click="previewVideoOpen = false"
          >
            <el-icon :size="18"><Close /></el-icon>
          </button>
        </div>
        <div class="aspect-video bg-black">
          <iframe
            v-if="previewVideoUrl"
            :src="previewVideoUrl"
            title="YIYUAN production video preview"
            class="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </section>
    </div>
  </div>
</template>
