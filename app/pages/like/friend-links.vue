<script setup lang="ts">
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '友情链接 | YIYUAN' })

type FriendLink = {
  id?: number
  name: string
  url: string
  description: string
  enabled: boolean
  sortOrder: number
  newWindow: boolean
}

const emptyForm = (): FriendLink => ({
  name: '',
  url: '',
  description: '',
  enabled: true,
  sortOrder: 0,
  newWindow: true,
})

const { data, pending, refresh } = await useFetch<{ items: FriendLink[] }>('/api/admin/friend-links')
const dialogVisible = ref(false)
const saving = ref(false)
const form = reactive<FriendLink>(emptyForm())

const openCreate = () => {
  Object.assign(form, emptyForm())
  dialogVisible.value = true
}

const openEdit = (item: FriendLink) => {
  Object.assign(form, {
    id: item.id,
    name: item.name,
    url: item.url,
    description: item.description || '',
    enabled: item.enabled,
    sortOrder: item.sortOrder || 0,
    newWindow: item.newWindow,
  })
  dialogVisible.value = true
}

const save = async () => {
  if (!form.name.trim() || !form.url.trim()) {
    ElMessage.warning('请填写名称和链接')
    return
  }

  saving.value = true
  try {
    const path = form.id ? `/api/admin/friend-links/${form.id}` : '/api/admin/friend-links'
    await $fetch(path, {
      method: form.id ? 'PUT' : 'POST',
      body: form,
    })
    ElMessage.success('友情链接已保存')
    dialogVisible.value = false
    await refresh()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
  } finally {
    saving.value = false
  }
}

const remove = async (item: FriendLink) => {
  if (!item.id) return
  try {
    await ElMessageBox.confirm(`确定删除友情链接「${item.name}」吗？`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await $fetch(`/api/admin/friend-links/${item.id}`, { method: 'DELETE' })
    ElMessage.success('友情链接已删除')
    await refresh()
  } catch (error: any) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error?.data?.message || error?.statusMessage || '删除失败')
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">友情链接</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">
          管理页脚低优先级友链。前台只展示已启用且填写链接的项目，手机端默认折叠。
        </p>
      </div>
      <el-button color="#c1121f" @click="openCreate">
        <el-icon><Plus /></el-icon>
        <span>新增友链</span>
      </el-button>
    </div>

    <div class="table-scroll border border-[var(--color-line)] bg-white" style="--table-min-width: 920px">
      <el-table v-loading="pending" :data="data?.items || []" stripe>
        <el-table-column label="名称" min-width="180">
          <template #default="{ row }">
            <div class="font-semibold text-[var(--color-navy)]">{{ row.name }}</div>
            <div v-if="row.description" class="mt-1 line-clamp-2 text-[12px] text-[var(--color-slate-muted)]">
              {{ row.description }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="链接" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <a :href="row.url" target="_blank" rel="noopener" class="text-[var(--color-accent)] hover:underline">
              {{ row.url }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="启用" width="90">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'" effect="plain">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="新窗口" width="100">
          <template #default="{ row }">
            {{ row.newWindow ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="90" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <el-button size="small" plain @click="openEdit(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" plain @click="remove(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑友情链接' : '新增友情链接'" width="min(92vw, 620px)">
      <div class="grid gap-4">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="Partner website name" />
        </el-form-item>
        <el-form-item label="链接" required>
          <el-input v-model="form.url" placeholder="https://example.com" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="简短说明，可选" />
        </el-form-item>
        <div class="grid gap-4 sm:grid-cols-3">
          <el-form-item label="启用">
            <el-switch v-model="form.enabled" />
          </el-form-item>
          <el-form-item label="新窗口打开">
            <el-switch v-model="form.newWindow" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sortOrder" :min="0" :step="1" controls-position="right" class="!w-full" />
          </el-form-item>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button plain @click="dialogVisible = false">取消</el-button>
          <el-button color="#c1121f" :loading="saving" @click="save">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
