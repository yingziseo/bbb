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
const activeMailStatuses = ['pending', 'submitted', 'retrying', 'delayed']
const exceptionMailStatuses = ['failed', 'retrying', 'delayed', 'bounced', 'suppressed', 'complained', 'skipped']

const mailStatusLabel = (status?: string) => {
  if (status === 'submitted') return '已提交给 Resend'
  if (status === 'delivered') return '已投递到收件服务器'
  if (status === 'delayed') return '投递延迟'
  if (status === 'retrying') return '重试中'
  if (status === 'failed') return '失败'
  if (status === 'bounced') return '已退信'
  if (status === 'suppressed') return '已被 Resend 抑制'
  if (status === 'complained') return '收件人垃圾投诉'
  if (status === 'skipped') return '未启用'
  return '等待'
}

const mailStatusType = (status?: string) => {
  if (status === 'delivered') return 'success'
  if (['failed', 'bounced', 'suppressed', 'complained'].includes(status || '')) return 'danger'
  if (['retrying', 'delayed', 'skipped'].includes(status || '')) return 'warning'
  return 'info'
}

const mailStatusHelp = (status?: string) => {
  if (status === 'suppressed') return '收件地址位于 Resend 抑制名单。请先在 Resend 后台解除并确认地址有效，再点击重新发送。'
  if (status === 'bounced') return '收件服务器永久拒绝了邮件。请先确认邮箱地址和退信原因，再决定是否重发。'
  if (status === 'complained') return '收件人曾将邮件标记为垃圾邮件，不建议直接重复发送。'
  if (status === 'delayed') return '收件服务器暂时延迟接收，Resend 会继续尝试；系统也会定时同步最终状态。'
  if (status === 'retrying') return '邮件尚未被 Resend 接受，服务器会按退避计划自动重试。'
  if (status === 'failed') return '邮件发送或投递失败，请查看下方错误信息。'
  if (status === 'skipped') return '自动转发未启用或服务密钥缺失。'
  return ''
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
    ElMessage.success('邮件已重新提交，正在等待最终投递结果')
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
          <el-alert
            v-if="exceptionMailStatuses.includes(item.mailStatus)"
            class="mb-4 !rounded-none"
            :type="mailStatusType(item.mailStatus) === 'danger' ? 'error' : 'warning'"
            :closable="false"
            show-icon
            :title="mailStatusLabel(item.mailStatus)"
            :description="mailStatusHelp(item.mailStatus)"
          />
          <div class="space-y-3 text-[14px] text-[var(--color-graphite)]">
            <div class="flex items-center gap-2">
              <span>状态：</span>
              <el-tag :type="mailStatusType(item.mailStatus)" effect="plain" class="!rounded-none">{{ mailStatusLabel(item.mailStatus) }}</el-tag>
            </div>
            <div>收件邮箱：{{ item.mailTo || '-' }}</div>
            <div>服务商：{{ item.mailProvider || '-' }}</div>
            <div>尝试次数：{{ item.mailAttempts || 0 }} 次</div>
            <div>最后尝试：{{ formatDate(item.lastMailAttemptAt) }}</div>
            <div>下次重试：{{ formatDate(item.nextMailAttemptAt) }}</div>
            <div>实际投递时间：{{ formatDate(item.forwardedAt) }}</div>
            <div>服务商事件：{{ item.mailLastEvent || '-' }}</div>
            <div>状态更新时间：{{ formatDate(item.mailLastEventAt) }}</div>
            <div>最后核验：{{ formatDate(item.mailLastCheckedAt) }}</div>
            <div v-if="item.mailMessageId" class="break-all">邮件 ID：{{ item.mailMessageId }}</div>
            <div v-if="item.mailError" class="break-all text-[var(--color-accent)]">错误：{{ item.mailError }}</div>
            <div v-if="item.mailCheckError" class="break-all text-[var(--color-accent)]">核验错误：{{ item.mailCheckError }}</div>
          </div>
          <el-button
            class="mt-5 w-full"
            color="#c1121f"
            :disabled="activeMailStatuses.includes(item.mailStatus)"
            @click="resend"
          >
            {{ activeMailStatuses.includes(item.mailStatus) ? '等待投递结果' : '重新发送邮件' }}
          </el-button>
        </div>
      </aside>
    </div>
  </div>
</template>
