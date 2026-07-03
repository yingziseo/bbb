<script setup lang="ts">
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '博客文章 | YIYUAN' })

const query = reactive({
  q: '',
  status: '',
})

const { data, pending, refresh } = await useFetch('/api/admin/posts', {
  query,
})

const removePost = async (id: number, title: string) => {
  try {
    await ElMessageBox.confirm(`确定删除文章「${title}」吗？删除后不可恢复。`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await $fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    ElMessage.success('文章已删除')
    await refresh()
  } catch (error: any) {
    if (error === 'cancel') return
    ElMessage.error(error?.data?.message || error?.statusMessage || '删除失败')
  }
}

const formatDate = (value: string) => (value ? new Date(value).toLocaleString('zh-CN') : '-')
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">博客文章</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">管理文章发布、封面图、HTML 内容和单篇文章 SEO。</p>
      </div>
      <NuxtLink to="/like/posts/new">
        <el-button color="#c1121f">
          <el-icon class="mr-1"><Plus /></el-icon>
          新建文章
        </el-button>
      </NuxtLink>
    </div>

    <div class="mb-4 flex flex-wrap gap-3 border border-[var(--color-line)] bg-white p-4">
      <el-input v-model="query.q" placeholder="搜索标题或 slug" class="w-full sm:!w-[280px]" clearable @change="refresh" />
      <el-select v-model="query.status" placeholder="状态" class="w-full sm:!w-[160px]" clearable @change="refresh">
        <el-option label="草稿" value="draft" />
        <el-option label="已发布" value="published" />
      </el-select>
      <el-button :loading="pending" @click="refresh">查询</el-button>
    </div>

    <div class="table-scroll border border-[var(--color-line)] bg-white" style="--table-min-width: 900px">
      <el-table :data="data?.items || []" stripe>
        <el-table-column label="封面" width="110">
          <template #default="{ row }">
            <img v-if="row.coverImage" :src="row.coverImage" alt="" class="h-14 w-20 border border-[var(--color-line)] object-cover" />
            <span v-else class="text-[12px] text-[var(--color-slate-muted)]">无封面</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="240" show-overflow-tooltip />
        <el-table-column prop="slug" label="Slug" min-width="180" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="plain" class="!rounded-none">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" min-width="180">
          <template #default="{ row }">{{ formatDate(row.publishedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="190" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <NuxtLink :to="`/like/posts/${row.id}`">
                <el-button size="small" color="#0f2a4a">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </NuxtLink>
              <el-button size="small" type="danger" plain @click="removePost(row.id, row.title)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
