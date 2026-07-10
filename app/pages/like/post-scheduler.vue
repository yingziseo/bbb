<script setup lang="ts">
import { Refresh, SetUp, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '定时发布 | YIYUAN' })

const loading = ref(false)
const planning = ref(false)
const running = ref(false)

const query = reactive({
  queuePage: 1,
  queuePageSize: 20,
  recentPage: 1,
  recentPageSize: 10,
})

const { data, pending, refresh } = await useFetch('/api/admin/post-scheduler', { query })

const form = reactive({
  enabled: true,
  startTime: '09:00',
  endTime: '17:30',
  dailyLimit: 1,
})

watchEffect(() => {
  const settings = data.value?.settings
  if (!settings) return
  form.enabled = settings.enabled
  form.startTime = settings.startTime
  form.endTime = settings.endTime
  form.dailyLimit = settings.dailyLimit
})

const formatDate = (value: string) => (
  value ? new Date(value).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '-'
)

const changeQueuePageSize = () => {
  query.queuePage = 1
}

const changeRecentPageSize = () => {
  query.recentPage = 1
}

const saveSettings = async () => {
  loading.value = true
  try {
    await $fetch('/api/admin/post-scheduler/settings', {
      method: 'PUT',
      body: form,
    })
    ElMessage.success('设置已保存')
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
  } finally {
    loading.value = false
  }
}

const planDrafts = async () => {
  try {
    await ElMessageBox.confirm('为未排期草稿生成未来 30 天发布时间？已有排期不会被覆盖。', '生成排期', {
      type: 'warning',
      confirmButtonText: '生成',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  planning.value = true
  try {
    const result = await $fetch<{ planned: number }>('/api/admin/post-scheduler/plan', {
      method: 'POST',
      body: { days: 30 },
    })
    ElMessage.success(`已生成 ${result.planned} 篇排期`)
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '生成失败')
  } finally {
    planning.value = false
  }
}

const runDue = async () => {
  running.value = true
  try {
    const result = await $fetch<{ published: number; skipped?: string }>('/api/admin/post-scheduler/run', {
      method: 'POST',
    })
    ElMessage.success(result.skipped ? `未发布：${result.skipped}` : `已发布 ${result.published} 篇`)
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '执行失败')
  } finally {
    running.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">定时发布</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">按中国时间白天随机排期，每天自动发布草稿文章。</p>
      </div>
      <el-button :loading="pending" plain @click="refresh">
        <el-icon class="mr-1"><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <div class="mb-6 grid gap-4 md:grid-cols-3">
      <div class="border border-[var(--color-line)] bg-white p-4">
        <div class="text-[13px] font-semibold text-[var(--color-slate-muted)]">未排期草稿</div>
        <div class="mt-2 text-[28px] font-extrabold text-[var(--color-navy)]">{{ data?.stats.unscheduledDrafts || 0 }}</div>
      </div>
      <div class="border border-[var(--color-line)] bg-white p-4">
        <div class="text-[13px] font-semibold text-[var(--color-slate-muted)]">到期待发布</div>
        <div class="mt-2 text-[28px] font-extrabold text-[var(--color-navy)]">{{ data?.stats.dueDrafts || 0 }}</div>
      </div>
      <div class="border border-[var(--color-line)] bg-white p-4">
        <div class="text-[13px] font-semibold text-[var(--color-slate-muted)]">今日已发布</div>
        <div class="mt-2 text-[28px] font-extrabold text-[var(--color-navy)]">{{ data?.stats.publishedToday || 0 }}</div>
      </div>
    </div>

    <div class="mb-6 border border-[var(--color-line)] bg-white p-5">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-[17px] font-bold text-[var(--color-navy)]">发布规则</h2>
        <div class="flex flex-wrap gap-2">
          <el-button :loading="planning" plain @click="planDrafts">
            <el-icon class="mr-1"><SetUp /></el-icon>
            生成排期
          </el-button>
          <el-button :loading="running" color="#0f2a4a" @click="runDue">
            <el-icon class="mr-1"><VideoPlay /></el-icon>
            执行发布
          </el-button>
        </div>
      </div>

      <el-form label-position="top" class="grid gap-4 md:grid-cols-[160px_180px_180px_160px_auto] md:items-end">
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker v-model="form.startTime" value-format="HH:mm" format="HH:mm" class="!w-full" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker v-model="form.endTime" value-format="HH:mm" format="HH:mm" class="!w-full" />
        </el-form-item>
        <el-form-item label="每日数量">
          <el-input-number v-model="form.dailyLimit" :min="1" :max="5" class="!w-full" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button color="#c1121f" :loading="loading" class="w-full" @click="saveSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
      <div class="text-[13px] text-[var(--color-slate-muted)]">
        当前时区：{{ data?.settings.timezone || 'Asia/Shanghai' }}；上次执行：{{ formatDate(data?.settings.lastRunAt || '') }}
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <div class="table-scroll border border-[var(--color-line)] bg-white" style="--table-min-width: 760px">
        <div class="border-b border-[var(--color-line)] p-4">
          <h2 class="text-[17px] font-bold text-[var(--color-navy)]">
            待发布队列（{{ data?.pagination?.queue?.total || 0 }}）
          </h2>
        </div>
        <el-table :data="data?.queue || []" stripe>
          <el-table-column prop="title" label="标题" min-width="260" show-overflow-tooltip />
          <el-table-column prop="slug" label="Slug" min-width="220" show-overflow-tooltip />
          <el-table-column label="排期时间" width="190">
            <template #default="{ row }">{{ formatDate(row.scheduledPublishAt) }}</template>
          </el-table-column>
        </el-table>
        <div class="overflow-x-auto border-t border-[var(--color-line)] px-4 py-3">
          <el-pagination
            v-model:current-page="query.queuePage"
            v-model:page-size="query.queuePageSize"
            class="min-w-max justify-end"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[10, 20, 50, 100]"
            :total="data?.pagination?.queue?.total || 0"
            @size-change="changeQueuePageSize"
          />
        </div>
      </div>

      <div class="table-scroll border border-[var(--color-line)] bg-white" style="--table-min-width: 560px">
        <div class="border-b border-[var(--color-line)] p-4">
          <h2 class="text-[17px] font-bold text-[var(--color-navy)]">
            最近自动发布（{{ data?.pagination?.recent?.total || 0 }}）
          </h2>
        </div>
        <el-table :data="data?.recent || []" stripe>
          <el-table-column prop="title" label="标题" min-width="260" show-overflow-tooltip />
          <el-table-column label="发布时间" width="190">
            <template #default="{ row }">{{ formatDate(row.publishedBySchedulerAt) }}</template>
          </el-table-column>
        </el-table>
        <div class="overflow-x-auto border-t border-[var(--color-line)] px-4 py-3">
          <el-pagination
            v-model:current-page="query.recentPage"
            v-model:page-size="query.recentPageSize"
            class="min-w-max justify-end"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[10, 20, 50, 100]"
            :total="data?.pagination?.recent?.total || 0"
            @size-change="changeRecentPageSize"
          />
        </div>
      </div>
    </div>
  </div>
</template>
