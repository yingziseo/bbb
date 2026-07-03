<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: '页面 TDK | YIYUAN' })

const { data, pending, refresh } = await useFetch('/api/admin/seo')
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">页面 TDK 管理</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">只维护首页、产品页、公司页、博客页、联系页等主要页面的 Title、Description 和 Keywords。</p>
      </div>
      <el-button :loading="pending" @click="refresh">刷新</el-button>
    </div>

    <div class="table-scroll border border-[var(--color-line)] bg-white" style="--table-min-width: 880px">
      <el-table :data="data?.items || []" stripe>
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
            <NuxtLink :to="`/like/seo/${row.id}`">
              <el-button size="small" color="#0f2a4a">编辑</el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
