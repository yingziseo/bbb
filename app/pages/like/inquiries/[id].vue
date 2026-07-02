<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = route.params.id as string
const { data, refresh } = await useFetch(`/api/admin/inquiries/${id}`)

if (!data.value?.item) {
  throw createError({ statusCode: 404, statusMessage: 'Inquiry not found' })
}

useHead({ title: `询盘 #${id} | YIYUAN` })

const item = computed(() => data.value?.item)
const formatDate = (value?: string) => (value ? new Date(value).toLocaleString('zh-CN') : '-')

const mailStatusLabel = (status?: string) => {
  if (status === 'sent') return '成功'
  if (status === 'retrying') return '重试中'
  if (status === 'failed') return '失败'
  if (status === 'skipped') return '未启用'
  return '等待'
}

const updateFlag = async (field: 'read' | 'handled', value: boolean) => {
  try {
    await $fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      body: { [field]: value },
    })
    ElMessage.success('状态已更新')
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '更新失败')
  }
}

const resend = async () => {
  try {
    await $fetch(`/api/admin/inquiries/${id}/resend`, { method: 'POST' })
    ElMessage.success('已重新尝试发送邮件')
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '重发失败')
  }
}
</script>

<template>
  <div v-if="item">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">客户询盘 #{{ item.id }}</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">提交时间：{{ formatDate(item.createdAt) }}</p>
      </div>
      <NuxtLink to="/like/inquiries"><el-button plain>返回列表</el-button></NuxtLink>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div class="border border-[var(--color-line)] bg-white p-6">
        <h2 class="mb-5 text-[18px] font-bold text-[var(--color-navy)]">客户信息</h2>
        <div class="grid gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2">
          <div class="bg-white p-4">
            <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">姓名</div>
            <div class="mt-1 font-semibold text-[var(--color-navy)]">{{ item.name }}</div>
          </div>
          <div class="bg-white p-4">
            <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">邮箱</div>
            <a :href="`mailto:${item.email}`" class="mt-1 block font-semibold text-[var(--color-navy)] hover:text-[var(--color-accent)]">{{ item.email }}</a>
          </div>
          <div class="bg-white p-4">
            <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">国家/地区</div>
            <div class="mt-1 font-semibold text-[var(--color-navy)]">{{ item.country || '-' }}</div>
          </div>
        </div>

        <h2 class="mb-4 mt-7 text-[18px] font-bold text-[var(--color-navy)]">需求详情</h2>
        <div class="whitespace-pre-line border border-[var(--color-line)] bg-[var(--color-panel)] p-5 text-[15px] leading-relaxed text-[var(--color-graphite)]">
          {{ item.message }}
        </div>
      </div>

      <aside class="space-y-5">
        <div class="border border-[var(--color-line)] bg-white p-5">
          <h2 class="mb-4 text-[17px] font-bold text-[var(--color-navy)]">处理状态</h2>
          <div class="space-y-3 text-[14px]">
            <div>阅读状态：{{ item.readAt ? '已读' : '未读' }}</div>
            <div>处理状态：{{ item.handledAt ? '已处理' : '未处理' }}</div>
          </div>
          <div class="mt-5 grid gap-2">
            <el-button plain @click="updateFlag('read', !item.readAt)">{{ item.readAt ? '标记未读' : '标记已读' }}</el-button>
            <el-button color="#0f2a4a" @click="updateFlag('handled', !item.handledAt)">{{ item.handledAt ? '取消处理' : '标记已处理' }}</el-button>
          </div>
        </div>

        <div class="border border-[var(--color-line)] bg-white p-5">
          <h2 class="mb-4 text-[17px] font-bold text-[var(--color-navy)]">邮件转发</h2>
          <div class="space-y-3 text-[14px] text-[var(--color-graphite)]">
            <div>状态：{{ mailStatusLabel(item.mailStatus) }}</div>
            <div>收件邮箱：{{ item.mailTo || '-' }}</div>
            <div>服务商：{{ item.mailProvider || '-' }}</div>
            <div>尝试次数：{{ item.mailAttempts || 0 }} 次</div>
            <div>最后尝试：{{ formatDate(item.lastMailAttemptAt) }}</div>
            <div>下次重试：{{ formatDate(item.nextMailAttemptAt) }}</div>
            <div>成功时间：{{ formatDate(item.forwardedAt) }}</div>
            <div v-if="item.mailMessageId" class="break-all">邮件 ID：{{ item.mailMessageId }}</div>
            <div v-if="item.mailError" class="break-all text-[var(--color-accent)]">错误：{{ item.mailError }}</div>
          </div>
          <el-button class="mt-5 w-full" color="#c1121f" @click="resend">重新发送邮件</el-button>
        </div>
      </aside>
    </div>
  </div>
</template>
