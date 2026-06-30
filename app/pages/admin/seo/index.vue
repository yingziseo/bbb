<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'SEO 管理 | YIYUAN' })

const { data, pending, refresh } = await useFetch('/api/admin/seo')

const typeLabel = (type: string) => {
  const labels: Record<string, string> = {
    page: '页面',
    product: '产品',
    post: '博客',
  }
  return labels[type] || type
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">SEO 管理</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">集中维护所有页面的 Title、Description、Keywords、Canonical、Robots 和 OG 信息。</p>
      </div>
      <el-button :loading="pending" @click="refresh">刷新</el-button>
    </div>

    <div class="border border-[var(--color-line)] bg-white">
      <el-table :data="data?.items || []" stripe>
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag effect="plain" class="!rounded-none">{{ typeLabel(row.pageType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="页面" min-width="180" />
        <el-table-column prop="path" label="路径" min-width="180" />
        <el-table-column prop="title" label="Title" min-width="260" show-overflow-tooltip />
        <el-table-column label="状态" width="140">
          <template #default="{ row }">
            <el-tag v-if="row.robots.includes('noindex')" type="warning" effect="plain" class="!rounded-none">Noindex</el-tag>
            <el-tag v-else type="success" effect="plain" class="!rounded-none">Index</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <NuxtLink :to="`/admin/seo/${row.id}`">
              <el-button size="small" color="#0f2a4a">编辑</el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
