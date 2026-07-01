<script setup lang="ts">
import { ChatDotRound, Close, FullScreen, Message, Mute, Present, VideoCamera, VideoPlay } from '@element-plus/icons-vue'
import type { PublicSiteSettings } from '~/composables/useSiteSettings'

const props = defineProps<{
  settings: PublicSiteSettings
}>()

const storageKey = 'yiyuan:home-popup-player-dismissed-until'
const visible = ref(false)
const playing = ref(false)

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
  playing.value = false
}

const startVideo = () => {
  if (!hasVideo.value) return
  playing.value = true
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
  visible.value = shouldShowPopup()
})

watch(popupEnabled, (enabled) => {
  if (!enabled) {
    visible.value = false
    playing.value = false
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
        <div class="home-lead-popup__shade" aria-hidden="true" />
        <section class="home-lead-popup__panel">
          <button type="button" class="home-lead-popup__close" aria-label="Close popup" @click="closePopup">
            <el-icon :size="18"><Close /></el-icon>
          </button>

          <div class="home-lead-popup__content">
            <div class="home-lead-popup__copy">
              <span class="home-lead-popup__eyebrow">YIYUAN Packaging Supply</span>
              <h2 id="home-lead-popup-title">Custom Food Packaging and Cling Film</h2>
              <p>
                We supply cling film, fresh wrap, disposable food containers, and private-label packaging for wholesale and OEM orders.
              </p>

              <div class="home-lead-popup__points">
                <span>
                  <el-icon><Present /></el-icon>
                  Free sample support
                </span>
                <span>
                  <el-icon><ChatDotRound /></el-icon>
                  Fast quote by WhatsApp
                </span>
              </div>

              <div class="home-lead-popup__actions">
                <NuxtLink to="/contact?source=home-popup">
                  <el-button color="#c1121f" size="large">
                    Free Sample
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
                  Contact Us
                </el-button>
                <a class="home-lead-popup__email" :href="settings.contactLink">
                  <el-icon><Message /></el-icon>
                  {{ settings.email }}
                </a>
              </div>
            </div>

            <div class="home-lead-popup__media">
              <div class="home-lead-popup__player" :class="{ 'is-ready': hasVideo, 'is-playing': playing }">
                <div class="home-lead-popup__player-top">
                  <span>
                    <el-icon><VideoCamera /></el-icon>
                    Factory Video
                  </span>
                  <small>{{ hasVideo ? 'External source' : 'Video URL reserved' }}</small>
                </div>

                <div class="home-lead-popup__screen">
                  <iframe
                    v-if="playing && videoUrl"
                    :src="videoUrl"
                    title="YIYUAN production video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  />
                  <button
                    v-else
                    type="button"
                    class="home-lead-popup__play"
                    :class="{ 'is-disabled': !hasVideo }"
                    :aria-disabled="!hasVideo"
                    @click="startVideo"
                  >
                    <span class="home-lead-popup__play-icon">
                      <el-icon :size="30"><VideoPlay /></el-icon>
                    </span>
                    <span class="home-lead-popup__play-copy">
                      <strong>Watch factory overview</strong>
                      <small>External video player</small>
                    </span>
                  </button>
                </div>

                <div class="home-lead-popup__controls" aria-hidden="true">
                  <span class="home-lead-popup__time">00:00</span>
                  <span class="home-lead-popup__track">
                    <span :style="{ width: playing ? '82%' : '28%' }" />
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

.home-lead-popup__actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.home-lead-popup__email {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 7px;
  color: var(--color-slate-muted);
  font-size: 13px;
  font-weight: 700;
  transition: color 180ms ease;
}

@media (hover: hover) {
  .home-lead-popup__email:hover {
    color: var(--color-accent);
  }
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
    url('/images/workshop-main.png') center / cover;
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
  justify-content: space-between;
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

.home-lead-popup__player-top small {
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
}

.home-lead-popup__screen {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(10, 31, 56, 0.1), rgba(10, 31, 56, 0.72)),
    url('/images/workshop-main.png') center / cover;
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

.home-lead-popup__screen iframe {
  position: relative;
  z-index: 2;
  display: block;
  height: 100%;
  width: 100%;
  border: 0;
  background: #000;
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
  background: rgba(10, 31, 56, 0.12);
  color: #fff;
  cursor: pointer;
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
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(193, 18, 31, 0.92);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);
  transition:
    transform 180ms ease,
    background-color 180ms ease;
}

@media (hover: hover) {
  .home-lead-popup__play:not(.is-disabled):hover .home-lead-popup__play-icon {
    background: var(--color-accent);
    transform: scale(1.04);
  }
}

.home-lead-popup__play-copy {
  display: grid;
  gap: 3px;
  text-align: center;
}

.home-lead-popup__play-copy strong {
  font-size: 17px;
  font-weight: 900;
}

.home-lead-popup__play-copy small {
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
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

@media (max-width: 760px) {
  .home-lead-popup {
    align-items: flex-end;
    padding: 12px;
  }

  .home-lead-popup__panel {
    max-height: calc(100dvh - 24px);
    overflow-y: auto;
  }

  .home-lead-popup__content {
    grid-template-columns: 1fr;
  }

  .home-lead-popup__copy {
    padding: 34px 22px 24px;
  }

  .home-lead-popup__copy h2 {
    max-width: 14ch;
    font-size: 29px;
  }

  .home-lead-popup__actions {
    align-items: stretch;
  }

  .home-lead-popup__actions > a,
  .home-lead-popup__actions :deep(.el-button) {
    width: 100%;
    margin-left: 0;
  }

  .home-lead-popup__email {
    justify-content: center;
    width: 100%;
  }

  .home-lead-popup__media {
    min-height: 0;
    padding: 18px;
    border-top: 1px solid var(--color-line);
    border-left: 0;
  }
}
</style>
