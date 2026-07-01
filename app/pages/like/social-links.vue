<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '社交链接 | YIYUAN' })

const { data, refresh } = await useFetch('/api/admin/social-links')
const savingId = ref<number | null>(null)

const save = async (item: any) => {
  savingId.value = item.id
  try {
    await $fetch(`/api/admin/social-links/${item.id}`, {
      method: 'PUT',
      body: item,
    })
    ElMessage.success(`${item.name} 已保存`)
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
  } finally {
    savingId.value = null
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">社交链接</h1>
      <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">配置页脚社交媒体图标链接。默认新窗口打开，未填写链接时前台显示为不可点击图标。</p>
    </div>

    <div class="border border-[var(--color-line)] bg-white">
      <el-table :data="data?.items || []" stripe>
        <el-table-column label="平台" min-width="160">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center border border-[var(--color-line)] text-[var(--color-navy)]">
                <SocialIcon :name="row.platformKey" />
              </span>
              <span class="font-semibold text-[var(--color-navy)]">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="链接" min-width="320">
          <template #default="{ row }">
            <el-input v-model="row.url" placeholder="https://..." />
          </template>
        </el-table-column>
        <el-table-column label="启用" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" />
          </template>
        </el-table-column>
        <el-table-column label="新窗口" width="110">
          <template #default="{ row }">
            <el-switch v-model="row.newWindow" />
          </template>
        </el-table-column>
        <el-table-column label="排序" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.sortOrder" :min="0" :step="1" controls-position="right" class="!w-[92px]" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button size="small" color="#c1121f" :loading="savingId === row.id" @click="save(row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
