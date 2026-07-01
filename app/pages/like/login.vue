<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

definePageMeta({ layout: false })
useHead({ title: '后台登录 | YIYUAN' })

const route = useRoute()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
})

const adminHome = '/like'

const redirectTarget = () => {
  const value = route.query.redirect
  const target = Array.isArray(value) ? value[0] : value
  if (!target || typeof target !== 'string') return adminHome
  if (target === '/like/index.html' || target.startsWith('/like/login')) return adminHome
  if (target.startsWith('//') || target.includes('://') || target.includes('\\')) return adminHome
  if (target !== '/like' && !target.startsWith('/like/')) return adminHome
  return target
}

const login = async () => {
  if (!form.username || !form.password || loading.value) return
  loading.value = true

  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: form,
    })
    ElMessage.success('登录成功')
    await navigateTo(redirectTarget())
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-navy)] text-white">
    <div class="container-x flex min-h-screen items-center justify-center py-12">
      <div class="w-full max-w-[420px] border border-white/12 bg-white p-8 text-[var(--color-ink)]">
        <div class="mb-8 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center bg-[var(--color-navy)] text-xl font-extrabold text-white">Y</div>
          <h1 class="mt-4 text-[24px] font-extrabold text-[var(--color-navy)]">YIYUAN 后台登录</h1>
          <p class="mt-2 text-[13px] text-[var(--color-slate-muted)]">内容、SEO、询盘和社交链接管理</p>
        </div>

        <el-form label-position="top" @submit.prevent="login">
          <el-form-item label="管理员账号">
            <el-input v-model="form.username" size="large" placeholder="请输入管理员账号" @keyup.enter="login">
              <template #prefix><el-icon><User /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" size="large" show-password placeholder="请输入密码" @keyup.enter="login">
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-button color="#c1121f" size="large" class="mt-2 w-full" :loading="loading" @click="login">
            登录
          </el-button>
        </el-form>

        <p class="mt-5 text-[12px] leading-relaxed text-[var(--color-slate-muted)]">
          请使用已配置的管理员账号和密码登录。
        </p>
      </div>
    </div>
  </div>
</template>
