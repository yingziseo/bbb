<script setup lang="ts">
import { Close, FullScreen, Mute, Present, Promotion, VideoCamera } from '@element-plus/icons-vue'
import type { PublicSiteSettings } from '~/composables/useSiteSettings'

const props = defineProps<{
  settings: PublicSiteSettings
}>()

const { isCn, localePath } = useLocale()
const copy = computed(() => isCn.value ? {
  closePopup: '关闭弹窗',
  closeVideo: '关闭视频',
  eyebrow: '宜沅包装供应',
  title: '保鲜膜与食品包装定制',
  desc: '供应保鲜膜、生鲜膜、一次性食品容器和私标包装，支持批发与 OEM 订单。',
  sample: '样品支持',
  quote: 'WhatsApp 快速询价',
  form: '询盘表单',
  whatsapp: 'WhatsApp 联系',
  video: '工厂视频',
  watch: '观看工厂视频',
  videoDialog: '工厂视频播放器',
  videoTitle: '宜沅生产视频',
} : {
  closePopup: 'Close popup',
  closeVideo: 'Close video',
  eyebrow: 'YIYUAN Packaging Supply',
  title: 'Custom Food Packaging and Cling Film',
  desc: 'We supply cling film, fresh wrap, disposable food containers, and private-label packaging for wholesale and OEM orders.',
  sample: 'Free Sample Support',
  quote: 'Fast Quote by WhatsApp',
  form: 'Inquiry Form',
  whatsapp: 'Contact on WhatsApp',
  video: 'Factory Video',
  watch: 'Watch Real Factory Video',
  videoDialog: 'Factory video player',
  videoTitle: 'YIYUAN production video',
})

const storageKey = 'yiyuan:home-popup-video-modal-dismissed-until'
const visible = ref(false)
const videoOpen = ref(false)
let popupTimer: ReturnType<typeof window.setTimeout> | null = null

const popupEnabled = computed(() => props.settings.homePopupEnabled === 'true')
const cooldownMs = computed(() => {
  const hours = Number(props.settings.homePopupCooldownHours)
  const normalizedHours = Number.isFinite(hours) ? Math.max(1, Math.min(720, Math.trunc(hours))) : 12
  return normalizedHours * 60 * 60 * 1000
})

const videoUrl = computed(() => toEmbedVideoUrl(props.settings.homePopupVideoUrl || ''))
const hasVideo = computed(() => Boolean(videoUrl.value))

const shouldShowPopup = () => {
  if (!popupEnabled.value) return false

  const dismissedUntil = Number(window.localStorage.getItem(storageKey) || 0)
  if (!dismissedUntil) return true

  if (Date.now() >= dismissedUntil) {
    window.localStorage.removeItem(storageKey)
    return true
  }

  return false
}

const closePopup = () => {
  window.localStorage.setItem(storageKey, String(Date.now() + cooldownMs.value))
  visible.value = false
  videoOpen.value = false
}

const skipPopup = () => {
  visible.value = false
  videoOpen.value = false
}

const startVideo = () => {
  if (!hasVideo.value) return
  videoOpen.value = true
}

const closeVideo = () => {
  videoOpen.value = false
}

const getPopupDelay = () => {
  if (!import.meta.client) return 0

  return window.matchMedia('(max-width: 760px)').matches ? 3000 : 2500
}

const clearPopupTimer = () => {
  if (!popupTimer) return
  window.clearTimeout(popupTimer)
  popupTimer = null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !visible.value) return

  if (videoOpen.value) {
    closeVideo()
    return
  }

  skipPopup()
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

onMounted(() => {
  if (shouldShowPopup()) {
    popupTimer = window.setTimeout(() => {
      visible.value = true
      popupTimer = null
    }, getPopupDelay())
  }
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  clearPopupTimer()
  window.removeEventListener('keydown', handleKeydown)
})

watch(popupEnabled, (enabled) => {
  if (!enabled) {
    clearPopupTimer()
    visible.value = false
    videoOpen.value = false
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="home-lead-popup">
      <div
        v-if="visible"
        class="home-lead-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-lead-popup-title"
      >
        <div class="home-lead-popup__shade" aria-hidden="true" @click="skipPopup" />
        <section class="home-lead-popup__panel">
          <button type="button" class="home-lead-popup__close" :aria-label="copy.closePopup" @click="closePopup">
            <el-icon :size="18"><Close /></el-icon>
          </button>

          <div class="home-lead-popup__content">
            <div class="home-lead-popup__copy">
              <span class="home-lead-popup__eyebrow">{{ copy.eyebrow }}</span>
              <h2 id="home-lead-popup-title">{{ copy.title }}</h2>
              <p>
                {{ copy.desc }}
              </p>

              <div class="home-lead-popup__points">
                <span>
                  <el-icon><Present /></el-icon>
                  {{ copy.sample }}
                </span>
                <span>
                  <SocialIcon name="whatsapp" />
                  {{ copy.quote }}
                </span>
              </div>

              <div class="home-lead-popup__actions">
                <NuxtLink :to="localePath('/contact?source=home-popup')">
                  <el-button color="#c1121f" size="large">
                    <el-icon><Promotion /></el-icon>
                    <span>{{ copy.form }}</span>
                  </el-button>
                </NuxtLink>
                <el-button
                  tag="a"
                  :href="settings.whatsappLink"
                  target="_blank"
                  rel="noopener"
                  color="#1b3c63"
                  size="large"
                >
                  <span class="inline-flex items-center gap-1.5">
                    <SocialIcon name="whatsapp" />
                    <span>{{ copy.whatsapp }}</span>
                  </span>
                </el-button>
              </div>
            </div>

            <div class="home-lead-popup__media">
              <div class="home-lead-popup__player" :class="{ 'is-ready': hasVideo, 'is-playing': videoOpen }">
                <div class="home-lead-popup__player-top">
                  <span>
                    <el-icon><VideoCamera /></el-icon>
                    {{ copy.video }}
                  </span>
                </div>

                <div class="home-lead-popup__screen">
                  <button
                    type="button"
                    class="home-lead-popup__play"
                    :class="{ 'is-disabled': !hasVideo }"
                    :aria-disabled="!hasVideo"
                    :disabled="!hasVideo"
                    @click="startVideo"
                  >
                    <span class="home-lead-popup__play-icon">
                      <span class="home-lead-popup__play-triangle" />
                    </span>
                    <span class="home-lead-popup__play-copy">
                      <strong>{{ copy.watch }}</strong>
                    </span>
                  </button>
                </div>

                <div class="home-lead-popup__controls" aria-hidden="true">
                  <span class="home-lead-popup__time">00:00</span>
                  <span class="home-lead-popup__track">
                    <span />
                  </span>
                  <span class="home-lead-popup__time">01:28</span>
                  <span class="home-lead-popup__control-icon">
                    <el-icon><Mute /></el-icon>
                  </span>
                  <span class="home-lead-popup__control-icon">
                    <el-icon><FullScreen /></el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Transition name="home-video-modal">
          <div v-if="videoOpen" class="home-video-modal" role="dialog" aria-modal="true" :aria-label="copy.videoDialog">
            <div class="home-video-modal__shade" aria-hidden="true" @click="closeVideo" />
            <section class="home-video-modal__panel">
              <div class="home-video-modal__bar">
                <span>
                  <el-icon><VideoCamera /></el-icon>
                  {{ copy.video }}
                </span>
                <button type="button" :aria-label="copy.closeVideo" @click="closeVideo">
                  <el-icon :size="18"><Close /></el-icon>
                </button>
              </div>
              <div class="home-video-modal__frame">
                <iframe
                  :src="videoUrl"
                  :title="copy.videoTitle"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                />
              </div>
            </section>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.home-lead-popup {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.home-lead-popup__shade {
  position: absolute;
  inset: 0;
  background: rgba(10, 31, 56, 0.66);
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.home-lead-popup__panel {
  position: relative;
  z-index: 1;
  width: min(900px, 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #fff;
  box-shadow: 0 26px 72px rgba(10, 31, 56, 0.28);
}

.home-lead-popup__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  display: flex;
  height: 38px;
  width: 38px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-line);
  background: #fff;
  color: var(--color-navy);
  transition:
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

@media (hover: hover) {
  .home-lead-popup__close:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-1px);
  }
}

.home-lead-popup__content {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(300px, 0.9fr);
  gap: 0;
}

.home-lead-popup__copy {
  padding: 42px 42px 38px;
}

.home-lead-popup__eyebrow {
  display: inline-block;
  border-left: 3px solid var(--color-accent);
  padding-left: 10px;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.home-lead-popup__copy h2 {
  margin-top: 18px;
  max-width: 12ch;
  color: var(--color-navy);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 900;
  line-height: 1.08;
}

.home-lead-popup__copy p {
  margin-top: 18px;
  max-width: 46ch;
  color: var(--color-graphite);
  font-size: 15.5px;
  line-height: 1.7;
}

.home-lead-popup__points {
  margin-top: 22px;
  display: grid;
  gap: 10px;
  color: var(--color-navy);
  font-size: 14px;
  font-weight: 700;
}

.home-lead-popup__points span {
  display: flex;
  align-items: center;
  gap: 9px;
}

.home-lead-popup__points .el-icon {
  color: var(--color-accent);
}

.home-lead-popup__points svg {
  flex: 0 0 auto;
  color: var(--color-accent);
}

.home-lead-popup__actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.home-lead-popup__media {
  position: relative;
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  padding: 30px 26px;
  border-left: 1px solid var(--color-line);
  background:
    linear-gradient(135deg, rgba(15, 42, 74, 0.92), rgba(10, 31, 56, 0.98)),
    url('/images/workshop-main.webp') center / cover;
}

.home-lead-popup__player {
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(4, 14, 28, 0.72);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
}

.home-lead-popup__player-top {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  padding: 0 14px;
  color: #fff;
}

.home-lead-popup__player-top span {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
}

.home-lead-popup__screen {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(10, 31, 56, 0.1), rgba(10, 31, 56, 0.72)),
    url('/images/workshop-main.webp') center / cover;
}

.home-lead-popup__screen::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  content: '';
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 42px 42px;
  opacity: 0.36;
}

.home-lead-popup__play {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 0;
  background:
    radial-gradient(circle at center, rgba(193, 18, 31, 0.16), transparent 34%),
    rgba(10, 31, 56, 0.1);
  color: #fff;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    backdrop-filter 180ms ease;
}

.home-lead-popup__play.is-disabled {
  cursor: default;
}

.home-lead-popup__play-icon {
  display: flex;
  height: 74px;
  width: 74px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.42);
  background: rgba(193, 18, 31, 0.18);
  box-shadow:
    0 16px 34px rgba(0, 0, 0, 0.24),
    inset 0 0 0 1px rgba(193, 18, 31, 0.34);
  backdrop-filter: blur(10px);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease,
    background-color 180ms ease;
}

.home-lead-popup__play-triangle {
  display: block;
  width: 0;
  height: 0;
  margin-left: 5px;
  border-top: 14px solid transparent;
  border-bottom: 14px solid transparent;
  border-left: 22px solid rgba(255, 255, 255, 0.96);
  filter: drop-shadow(0 2px 8px rgba(193, 18, 31, 0.35));
}

@media (hover: hover) {
  .home-lead-popup__player.is-ready:hover {
    border-color: rgba(193, 18, 31, 0.46);
    box-shadow:
      0 20px 48px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(193, 18, 31, 0.18);
  }

  .home-lead-popup__player.is-ready:hover .home-lead-popup__play {
    background:
      radial-gradient(circle at center, rgba(193, 18, 31, 0.24), transparent 38%),
      rgba(10, 31, 56, 0.02);
  }

  .home-lead-popup__play:not(.is-disabled):hover .home-lead-popup__play-icon {
    border-color: rgba(255, 255, 255, 0.68);
    background: rgba(193, 18, 31, 0.26);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 0 8px rgba(193, 18, 31, 0.12),
      inset 0 0 0 1px rgba(193, 18, 31, 0.44);
    transform: scale(1.06);
  }
}

.home-lead-popup__play-copy {
  display: grid;
  text-align: center;
}

.home-lead-popup__play-copy strong {
  font-size: 17px;
  font-weight: 900;
}

.home-lead-popup__controls {
  display: grid;
  grid-template-columns: auto minmax(56px, 1fr) auto auto auto;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.72);
}

.home-lead-popup__time {
  font-size: 11px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.home-lead-popup__track {
  position: relative;
  height: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.18);
}

.home-lead-popup__track span {
  display: block;
  width: 28%;
  height: 100%;
  background: var(--color-accent);
  transition: width 220ms ease;
}

.home-lead-popup__control-icon {
  display: flex;
  height: 24px;
  width: 24px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.72);
}

.home-lead-popup-enter-active,
.home-lead-popup-leave-active {
  transition: opacity 180ms ease;
}

.home-lead-popup-enter-active .home-lead-popup__panel,
.home-lead-popup-leave-active .home-lead-popup__panel {
  transition: transform 180ms ease;
}

.home-lead-popup-enter-from,
.home-lead-popup-leave-to {
  opacity: 0;
}

.home-lead-popup-enter-from .home-lead-popup__panel,
.home-lead-popup-leave-to .home-lead-popup__panel {
  transform: translateY(12px);
}

.home-video-modal {
  position: fixed;
  inset: 0;
  z-index: 140;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.home-video-modal__shade {
  position: absolute;
  inset: 0;
  background: rgba(3, 12, 24, 0.78);
  backdrop-filter: blur(10px);
}

.home-video-modal__panel {
  position: relative;
  z-index: 1;
  width: min(980px, 100%);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #020812;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
}

.home-video-modal__bar {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0 14px;
  color: #fff;
}

.home-video-modal__bar span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 900;
}

.home-video-modal__bar button {
  display: flex;
  height: 34px;
  width: 34px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  transition:
    border-color 180ms ease,
    background-color 180ms ease;
}

@media (hover: hover) {
  .home-video-modal__bar button:hover {
    border-color: rgba(193, 18, 31, 0.68);
    background: rgba(193, 18, 31, 0.18);
  }
}

.home-video-modal__frame {
  aspect-ratio: 16 / 9;
  background: #000;
}

.home-video-modal__frame iframe {
  display: block;
  height: 100%;
  width: 100%;
  border: 0;
  background: #000;
}

.home-video-modal-enter-active,
.home-video-modal-leave-active {
  transition: opacity 180ms ease;
}

.home-video-modal-enter-active .home-video-modal__panel,
.home-video-modal-leave-active .home-video-modal__panel {
  transition: transform 180ms ease;
}

.home-video-modal-enter-from,
.home-video-modal-leave-to {
  opacity: 0;
}

.home-video-modal-enter-from .home-video-modal__panel,
.home-video-modal-leave-to .home-video-modal__panel {
  transform: translateY(10px) scale(0.98);
}

@media (max-width: 760px) {
  .home-lead-popup {
    align-items: center;
    padding: 10px;
  }

  .home-lead-popup__panel {
    width: min(392px, 100%);
    max-height: calc(100dvh - 20px);
    overflow: hidden;
  }

  .home-lead-popup__close {
    top: 8px;
    right: 8px;
    height: 32px;
    width: 32px;
  }

  .home-lead-popup__content {
    grid-template-columns: 1fr;
  }

  .home-lead-popup__copy {
    padding: 20px 16px 14px;
  }

  .home-lead-popup__eyebrow {
    padding-left: 8px;
    font-size: 10.5px;
    letter-spacing: 0.08em;
  }

  .home-lead-popup__copy h2 {
    margin-top: 9px;
    max-width: none;
    font-size: 23px;
    line-height: 1.12;
  }

  .home-lead-popup__copy p {
    margin-top: 8px;
    font-size: 12.5px;
    line-height: 1.45;
  }

  .home-lead-popup__points {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
    margin-top: 10px;
    font-size: 11.5px;
  }

  .home-lead-popup__points span {
    min-width: 0;
    min-height: 32px;
    gap: 6px;
    border: 1px solid var(--color-line);
    padding: 6px 8px;
    line-height: 1.2;
  }

  .home-lead-popup__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 12px;
    align-items: stretch;
  }

  .home-lead-popup__actions > a,
  .home-lead-popup__actions :deep(.el-button) {
    width: 100%;
    height: 38px;
    min-height: 38px;
    padding: 0 10px;
    margin-left: 0;
    font-size: 13px;
  }

  .home-lead-popup__media {
    min-height: 0;
    padding: 12px 16px 16px;
    border-top: 1px solid var(--color-line);
    border-left: 0;
  }

  .home-lead-popup__player-top {
    min-height: 32px;
    padding: 0 10px;
  }

  .home-lead-popup__player-top span {
    font-size: 11.5px;
  }

  .home-lead-popup__screen {
    aspect-ratio: 16 / 8;
  }

  .home-lead-popup__play {
    gap: 8px;
  }

  .home-lead-popup__play-icon {
    height: 56px;
    width: 56px;
  }

  .home-lead-popup__play-triangle {
    margin-left: 4px;
    border-top-width: 10px;
    border-bottom-width: 10px;
    border-left-width: 16px;
  }

  .home-lead-popup__play-copy strong {
    font-size: 13px;
  }

  .home-lead-popup__controls {
    min-height: 34px;
    grid-template-columns: auto minmax(44px, 1fr) auto auto auto;
    gap: 6px;
    padding: 0 9px;
  }

  .home-lead-popup__control-icon {
    height: 20px;
    width: 20px;
  }

  .home-video-modal {
    padding: 12px;
  }
}

@media (max-width: 760px) and (max-height: 700px) {
  .home-lead-popup {
    padding: 8px;
  }

  .home-lead-popup__panel {
    width: min(374px, 100%);
    max-height: calc(100dvh - 16px);
  }

  .home-lead-popup__copy {
    padding: 16px 14px 10px;
  }

  .home-lead-popup__copy h2 {
    margin-top: 7px;
    font-size: 21px;
  }

  .home-lead-popup__copy p {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.38;
  }

  .home-lead-popup__points {
    gap: 6px;
    margin-top: 8px;
    font-size: 11px;
  }

  .home-lead-popup__points span {
    min-height: 28px;
    padding: 5px 7px;
  }

  .home-lead-popup__actions {
    gap: 6px;
    margin-top: 10px;
  }

  .home-lead-popup__actions > a,
  .home-lead-popup__actions :deep(.el-button) {
    height: 34px;
    min-height: 34px;
  }

  .home-lead-popup__media {
    padding: 8px 14px 12px;
  }

  .home-lead-popup__player-top {
    min-height: 28px;
  }

  .home-lead-popup__screen {
    aspect-ratio: 16 / 7;
  }

  .home-lead-popup__play-icon {
    height: 50px;
    width: 50px;
  }

  .home-lead-popup__controls {
    min-height: 30px;
  }
}
</style>
