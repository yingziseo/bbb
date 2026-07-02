<script setup lang="ts">
import { Delete, Message, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '客户询盘 | YIYUAN' })

const query = reactive({ status: '' })
const { data, pending, refresh } = await useFetch('/api/admin/inquiries', { query })

const formatDate = (value: string) => (value ? new Date(value).toLocaleString('zh-CN') : '-')

const statusType = (status: string) => {
  if (status === 'sent') return 'success'
  if (status === 'failed') return 'danger'
  if (status === 'retrying') return 'warning'
  if (status === 'skipped') return 'warning'
  return 'info'
}

const statusLabel = (status: string) => {
  if (status === 'sent') return '成功'
  if (status === 'retrying') return '重试中'
  if (status === 'failed') return '失败'
  if (status === 'skipped') return '未启用'
  return '等待'
}

const removeInquiry = async (id: number) => {
  try {
    await ElMessageBox.confirm(`确定删除询盘 #${id} 吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await $fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
    ElMessage.success('询盘已删除')
    await refresh()
  } catch (error: any) {
    if (error === 'cancel') return
    ElMessage.error(error?.data?.message || error?.statusMessage || '删除失败')
  }
}

const resend = async (id: number) => {
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
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">客户询盘</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">查看、阅读和管理客户提交的全部询盘信息，邮件转发状态作为辅助提醒。</p>
      </div>
      <el-button :loading="pending" @click="refresh">刷新</el-button>
    </div>

    <div class="mb-4 flex flex-wrap gap-3 border border-[var(--color-line)] bg-white p-4">
      <el-select v-model="query.status" placeholder="筛选状态" class="w-full sm:!w-[180px]" clearable @change="refresh">
        <el-option label="未读" value="unread" />
        <el-option label="已处理" value="handled" />
        <el-option label="转发异常" value="failed" />
      </el-select>
      <el-button @click="refresh">查询</el-button>
    </div>

    <div class="border border-[var(--color-line)] bg-white">
      <el-table :data="data?.items || []" stripe>
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.readAt ? 'info' : 'danger'" effect="plain" class="!rounded-none">
              {{ row.readAt ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
        <el-table-column prop="country" label="国家/地区" min-width="150" show-overflow-tooltip />
        <el-table-column label="邮件转发" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.mailStatus)" effect="plain" class="!rounded-none">{{ statusLabel(row.mailStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="尝试" width="90">
          <template #default="{ row }">{{ row.mailAttempts || 0 }} 次</template>
        </el-table-column>
        <el-table-column label="下次重试" min-width="180">
          <template #default="{ row }">{{ formatDate(row.nextMailAttemptAt) }}</template>
        </el-table-column>
        <el-table-column label="提交时间" min-width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <NuxtLink :to="`/like/inquiries/${row.id}`">
                <el-button size="small" color="#0f2a4a">
                  <el-icon><Message /></el-icon>
                </el-button>
              </NuxtLink>
              <el-button size="small" plain @click="resend(row.id)">
                <el-icon><Refresh /></el-icon>
              </el-button>
              <el-button size="small" type="danger" plain @click="removeInquiry(row.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
