<script setup lang="ts">
import {
  Box,
  Document,
  Expand,
  HomeFilled,
  Link,
  MessageBox,
  Notebook,
  Operation,
  Setting as SettingIcon,
  SwitchButton,
  VideoCamera,
  Close,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const mobileNavOpen = ref(false)

const nav = [
  { label: '概览', to: '/like', icon: HomeFilled },
  { label: '页面 TDK', to: '/like/seo', icon: Operation },
  { label: '产品管理', to: '/like/products', icon: Box },
  { label: '首页弹窗', to: '/like/home-popup', icon: VideoCamera },
  { label: '博客文章', to: '/like/posts', icon: Document },
  { label: '询盘记录', to: '/like/inquiries', icon: MessageBox },
  { label: '网站设置', to: '/like/settings', icon: SettingIcon },
  { label: '社交链接', to: '/like/social-links', icon: Link },
]

const isActiveNav = (to: string) => route.path === to || (to !== '/like' && route.path.startsWith(to))
const currentNav = computed(() => nav.find((item) => isActiveNav(item.to)) || nav[0])

watch(
  () => route.fullPath,
  () => {
    mobileNavOpen.value = false
  },
)

const logout = async () => {
  await $fetch('/api/admin/auth/logout', { method: 'POST' })
  ElMessage.success('已退出登录')
  mobileNavOpen.value = false
  await navigateTo('/like/login')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-panel)] text-[var(--color-ink)]">
    <aside class="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-[var(--color-line)] bg-white lg:block">
      <div class="flex h-[76px] items-center gap-3 border-b border-[var(--color-line)] px-5">
        <span class="flex h-9 w-9 items-center justify-center bg-[var(--color-navy)] text-lg font-extrabold text-white">Y</span>
        <div class="min-w-0">
          <div class="text-[16px] font-extrabold text-[var(--color-navy)]">YIYUAN 后台</div>
          <div class="text-[11px] uppercase tracking-[0.12em] text-[var(--color-slate-muted)]">Admin Panel</div>
        </div>
      </div>

      <nav class="p-3">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="mb-1 flex items-center gap-3 border px-4 py-3 text-[14px] font-semibold transition-colors"
          :class="isActiveNav(item.to)
            ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white'
            : 'border-transparent text-[var(--color-graphite)] hover:border-[var(--color-line)] hover:bg-[var(--color-panel)]'"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          {{ item.label }}
        </NuxtLink>
      </nav>
    </aside>

    <div
      v-if="mobileNavOpen"
      class="fixed inset-0 z-50 bg-black/35 lg:hidden"
      aria-hidden="true"
      @click="mobileNavOpen = false"
    />

    <aside
      class="fixed inset-y-0 right-0 z-[60] flex w-[min(86vw,320px)] flex-col border-l border-[var(--color-line)] bg-white shadow-[-18px_0_36px_rgba(15,42,74,0.18)] transition-transform duration-200 lg:hidden"
      :style="{ transform: mobileNavOpen ? 'translateX(0)' : 'translateX(100%)' }"
      aria-label="后台移动端导航"
    >
      <div class="flex h-[72px] items-center justify-between border-b border-[var(--color-line)] px-5">
        <div class="flex min-w-0 items-center gap-3">
          <span class="flex h-9 w-9 items-center justify-center bg-[var(--color-navy)] text-lg font-extrabold text-white">Y</span>
          <div class="min-w-0">
            <div class="truncate text-[16px] font-extrabold text-[var(--color-navy)]">YIYUAN 后台</div>
            <div class="text-[11px] uppercase tracking-[0.12em] text-[var(--color-slate-muted)]">Admin Panel</div>
          </div>
        </div>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center border border-[var(--color-line)] text-[var(--color-navy)]"
          aria-label="关闭导航"
          @click="mobileNavOpen = false"
        >
          <el-icon :size="20"><Close /></el-icon>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto p-3">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="mb-1 flex items-center gap-3 border px-4 py-3 text-[15px] font-semibold transition-colors"
          :class="isActiveNav(item.to)
            ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white'
            : 'border-transparent text-[var(--color-graphite)] hover:border-[var(--color-line)] hover:bg-[var(--color-panel)]'"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="border-t border-[var(--color-line)] p-4">
        <NuxtLink to="/" target="_blank" class="mb-3 block">
          <el-button plain class="w-full">打开网站</el-button>
        </NuxtLink>
        <el-button type="danger" plain class="w-full" @click="logout">
          <el-icon class="mr-1"><SwitchButton /></el-icon>
          退出
        </el-button>
      </div>
    </aside>

    <div class="lg:pl-[260px]">
      <header class="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-[var(--color-line)] bg-white px-4 py-3 lg:px-8">
        <div class="flex min-w-0 items-center gap-3">
          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--color-line)] text-[var(--color-navy)] lg:hidden"
            aria-label="打开导航"
            :aria-expanded="mobileNavOpen"
            @click="mobileNavOpen = true"
          >
            <el-icon :size="20"><Expand /></el-icon>
          </button>
          <span class="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-navy)]">
            <el-icon><component :is="currentNav.icon || Notebook" /></el-icon>
          </span>
          <div class="min-w-0">
            <div class="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-slate-muted)]">YIYUAN Content Management</div>
            <div class="truncate text-[18px] font-extrabold text-[var(--color-navy)]">{{ currentNav.label }}</div>
          </div>
        </div>
        <div class="hidden shrink-0 items-center gap-3 sm:flex">
          <NuxtLink to="/" target="_blank">
            <el-button plain>打开网站</el-button>
          </NuxtLink>
          <el-button type="danger" plain @click="logout">
            <el-icon class="mr-1"><SwitchButton /></el-icon>
            退出
          </el-button>
        </div>
      </header>

      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
